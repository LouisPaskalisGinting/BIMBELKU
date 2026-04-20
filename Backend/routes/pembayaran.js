const express = require("express");
const router = express.Router();
const db = require("../db");

// ================= GET SEMUA (ADMIN) =================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      pembayaran.id,
      pembayaran.siswa_id,
      siswa.nama,
      siswa.kelas,
      pembayaran.total_tagihan,
      pembayaran.sudah_dibayar,
      (pembayaran.total_tagihan - pembayaran.sudah_dibayar) AS sisa_tagihan
    FROM pembayaran
    JOIN siswa ON pembayaran.siswa_id = siswa.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ================= GET BY SISWA =================
router.get("/siswa/:id", (req, res) => {
  const siswa_id = req.params.id;

  const sql = `
    SELECT 
      pembayaran.id,
      pembayaran.siswa_id,
      siswa.nama,
      siswa.kelas,
      pembayaran.total_tagihan,
      pembayaran.sudah_dibayar,
      (pembayaran.total_tagihan - pembayaran.sudah_dibayar) AS sisa_tagihan
    FROM pembayaran
    JOIN siswa ON pembayaran.siswa_id = siswa.id
    WHERE pembayaran.siswa_id = ?
  `;

  db.query(sql, [siswa_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ================= GET DETAIL =================
router.get("/detail/:id", (req, res) => {
  const sql = `
    SELECT * FROM pembayaran_detail
    WHERE pembayaran_id = ?
    ORDER BY tanggal DESC
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ================= TAMBAH PEMBAYARAN =================
router.post("/:id", (req, res) => {
  const { jumlah } = req.body;
  const pembayaran_id = req.params.id;

  if (!jumlah || jumlah <= 0) {
    return res.status(400).json({ message: "Jumlah tidak valid" });
  }

  db.query(
    "SELECT total_tagihan, sudah_dibayar FROM pembayaran WHERE id = ?",
    [pembayaran_id],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      const total = rows[0].total_tagihan;
      const sudah = rows[0].sudah_dibayar;
      const sisa = total - sudah;

      if (jumlah > sisa) {
        return res.status(400).json({
          message: `Melebihi sisa tagihan (${sisa})`,
        });
      }

      db.query(
        "INSERT INTO pembayaran_detail (pembayaran_id, jumlah, tanggal) VALUES (?, ?, NOW())",
        [pembayaran_id, jumlah],
        (err) => {
          if (err) return res.status(500).json(err);

          db.query(
            "UPDATE pembayaran SET sudah_dibayar = sudah_dibayar + ? WHERE id = ?",
            [jumlah, pembayaran_id],
            (err) => {
              if (err) return res.status(500).json(err);

              res.json({ message: "Pembayaran berhasil" });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
