const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

// ===============================
// UPLOAD BUKTI PEMBAYARAN
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-bukti-pembayaran" + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// ===============================
// GENERATE TAGIHAN OTOMATIS
// ===============================
router.post("/generate", (req, res) => {
  const sql = `
    INSERT INTO pembayaran 
    (siswa_id, total_tagihan, sudah_dibayar)
    SELECT 
      siswa.id,
      program.harga,
      0
    FROM siswa
    JOIN program ON siswa.program_id = program.id
    LEFT JOIN pembayaran 
    ON pembayaran.siswa_id = siswa.id
    WHERE siswa.status = 'approved'
    AND pembayaran.id IS NULL
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Tagihan berhasil digenerate",
      inserted: result.affectedRows,
    });
  });
});

// ===============================
// GET SEMUA PEMBAYARAN ADMIN
// ===============================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      pembayaran.id,
      pembayaran.siswa_id,
      siswa.nama,
      siswa.kelas_id,
      kelas.nama_kelas,
      program.nama_program,
      pembayaran.total_tagihan,
      pembayaran.sudah_dibayar,
      (
        pembayaran.total_tagihan - pembayaran.sudah_dibayar
      ) AS sisa_tagihan
    FROM pembayaran
    JOIN siswa ON pembayaran.siswa_id = siswa.id
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    LEFT JOIN program ON siswa.program_id = program.id
    ORDER BY pembayaran.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// ===============================
// GET PEMBAYARAN SISWA
// ===============================
router.get("/siswa/:id", (req, res) => {
  const siswa_id = req.params.id;

  const sql = `
    SELECT 
      pembayaran.id,
      pembayaran.siswa_id,
      siswa.nama,
      siswa.email,
      siswa.kelas_id,
      kelas.nama_kelas,
      siswa.program_id,
      program.nama_program,
      pembayaran.total_tagihan,
      pembayaran.sudah_dibayar,
      (pembayaran.total_tagihan - pembayaran.sudah_dibayar) AS sisa_tagihan
    FROM pembayaran
    JOIN siswa ON pembayaran.siswa_id = siswa.id
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    LEFT JOIN program ON siswa.program_id = program.id
    WHERE pembayaran.siswa_id = ?
  `;

  db.query(sql, [siswa_id], (err, result) => {
    if (err) {
      console.log("ERROR GET PEMBAYARAN SISWA:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

// ===============================
// GET DETAIL PEMBAYARAN
// ===============================
router.get("/detail/:id", (req, res) => {
  const pembayaran_id = req.params.id;

  const sql = `
    SELECT *
    FROM pembayaran_detail
    WHERE pembayaran_id = ?
    ORDER BY tanggal DESC
  `;

  db.query(sql, [pembayaran_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// ===============================
// SISWA AJUKAN PEMBAYARAN
// ===============================
router.post("/:id", upload.single("bukti_pembayaran"), (req, res) => {
  const pembayaran_id = req.params.id;
  const { jumlah } = req.body;
  const bukti_pembayaran = req.file ? req.file.filename : null;

  if (!jumlah || Number(jumlah) <= 0) {
    return res.status(400).json({
      message: "Jumlah pembayaran tidak valid",
    });
  }

  if (!bukti_pembayaran) {
    return res.status(400).json({
      message: "Bukti pembayaran wajib diupload",
    });
  }

  db.query(
    "SELECT * FROM pembayaran WHERE id=?",
    [pembayaran_id],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Data pembayaran tidak ditemukan",
        });
      }

      const pembayaran = rows[0];

      const sisa =
        Number(pembayaran.total_tagihan) - Number(pembayaran.sudah_dibayar);

      const bayar = Number(jumlah);

      if (bayar > sisa) {
        return res.status(400).json({
          message: "Jumlah melebihi sisa tagihan",
        });
      }

      const sql = `
          INSERT INTO pembayaran_detail
          (
            pembayaran_id,
            jumlah,
            tanggal,
            bukti_pembayaran,
            status
          )
          VALUES (?, ?, NOW(), ?, 'pending')
        `;

      db.query(sql, [pembayaran_id, bayar, bukti_pembayaran], (err) => {
        if (err) return res.status(500).json(err);

        res.json({
          message: "Pembayaran berhasil diajukan, menunggu persetujuan admin",
        });
      });
    }
  );
});

// ===============================
// ADMIN APPROVE PEMBAYARAN
// ===============================
router.put("/approve/:detailId", (req, res) => {
  const detailId = req.params.detailId;

  db.query(
    "SELECT * FROM pembayaran_detail WHERE id=?",
    [detailId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Detail pembayaran tidak ditemukan",
        });
      }

      const detail = rows[0];

      if (detail.status !== "pending") {
        return res.status(400).json({
          message: "Pembayaran sudah diproses",
        });
      }

      db.query(
        `
        UPDATE pembayaran_detail
        SET status='approved'
        WHERE id=?
        `,
        [detailId],
        (err) => {
          if (err) return res.status(500).json(err);

          db.query(
            `
            UPDATE pembayaran
            SET sudah_dibayar = sudah_dibayar + ?
            WHERE id = ?
            `,
            [detail.jumlah, detail.pembayaran_id],
            (err) => {
              if (err) return res.status(500).json(err);

              res.json({
                message: "Pembayaran disetujui",
              });
            }
          );
        }
      );
    }
  );
});

// ===============================
// ADMIN TOLAK PEMBAYARAN
// ===============================
router.put("/reject/:detailId", (req, res) => {
  const detailId = req.params.detailId;
  const { catatan } = req.body;

  const sql = `
    UPDATE pembayaran_detail
    SET status='rejected',
        catatan=?
    WHERE id=?
    AND status='pending'
  `;

  db.query(sql, [catatan || "Pembayaran ditolak", detailId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Pembayaran tidak ditemukan atau sudah diproses",
      });
    }

    res.json({
      message: "Pembayaran ditolak",
    });
  });
});

module.exports = router;
