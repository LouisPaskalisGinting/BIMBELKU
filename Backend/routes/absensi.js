const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// GENERATE ABSENSI
// ===============================
router.post("/generate", (req, res) => {
  const { jadwal_id, tanggal } = req.body;

  if (!jadwal_id || !tanggal) {
    return res.status(400).json({
      message: "jadwal_id dan tanggal wajib diisi",
    });
  }

  const checkSql = `
    SELECT * FROM absensi 
    WHERE jadwal_id = ? AND tanggal = ?
  `;

  db.query(checkSql, [jadwal_id, tanggal], (err, checkResult) => {
    if (err) {
      console.log("ERROR CEK ABSENSI:", err);
      return res.status(500).json(err);
    }

    if (checkResult.length > 0) {
      return res.json({
        message: "Absensi sudah ada",
      });
    }

    // Ambil kelas_id dari jadwal
    const sqlJadwal = `
      SELECT kelas_id
      FROM jadwal
      WHERE id = ?
    `;

    db.query(sqlJadwal, [jadwal_id], (err, jadwalResult) => {
      if (err) {
        console.log("ERROR GET JADWAL:", err);
        return res.status(500).json(err);
      }

      if (jadwalResult.length === 0) {
        return res.status(404).json({
          message: "Jadwal tidak ditemukan",
        });
      }

      const kelasId = jadwalResult[0].kelas_id;

      if (!kelasId) {
        return res.status(400).json({
          message: "Jadwal belum memiliki kelas_id",
        });
      }

      // Ambil siswa berdasarkan kelas_id
      const sqlSiswa = `
        SELECT id
        FROM siswa
        WHERE kelas_id = ?
        AND status = 'approved'
      `;

      db.query(sqlSiswa, [kelasId], (err, siswaResult) => {
        if (err) {
          console.log("ERROR GET SISWA:", err);
          return res.status(500).json(err);
        }

        if (siswaResult.length === 0) {
          return res.status(404).json({
            message: "Tidak ada siswa di kelas ini",
          });
        }

        const values = siswaResult.map((s) => [
          jadwal_id,
          s.id,
          tanggal,
          "alpha",
        ]);

        const sqlInsert = `
          INSERT INTO absensi 
          (jadwal_id, siswa_id, tanggal, status)
          VALUES ?
        `;

        db.query(sqlInsert, [values], (err) => {
          if (err) {
            console.log("ERROR INSERT ABSENSI:", err);
            return res.status(500).json(err);
          }

          res.json({
            message: "Absensi berhasil dibuat",
          });
        });
      });
    });
  });
});

// ===============================
// GET ABSENSI BY JADWAL DAN TANGGAL
// ===============================
router.get("/by-jadwal/:jadwal_id", (req, res) => {
  const tanggal = req.query.tanggal || new Date().toISOString().split("T")[0];

  const sql = `
    SELECT 
      absensi.id,
      absensi.jadwal_id,
      absensi.siswa_id,
      absensi.tanggal,
      absensi.status,
      siswa.nama,
      siswa.asal_sekolah,
      siswa.no_hp,
      kelas.nama_kelas,
      program.nama_program
    FROM absensi
    JOIN siswa ON siswa.id = absensi.siswa_id
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    LEFT JOIN program ON siswa.program_id = program.id
    WHERE absensi.jadwal_id = ?
    AND absensi.tanggal = ?
    ORDER BY siswa.nama ASC
  `;

  db.query(sql, [req.params.jadwal_id, tanggal], (err, result) => {
    if (err) {
      console.log("ERROR GET ABSENSI:", err);
      return res.status(500).json(err);
    }

    console.log("HASIL ABSENSI:", result);
    res.json(result);
  });
});

// ===============================
// UPDATE STATUS ABSENSI
// ===============================
router.put("/:id", (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      message: "Status wajib diisi",
    });
  }

  db.query(
    "UPDATE absensi SET status = ? WHERE id = ?",
    [status, req.params.id],
    (err) => {
      if (err) {
        console.log("ERROR UPDATE ABSENSI:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Status diupdate",
      });
    }
  );
});

// ===============================
// GET ABSENSI SISWA
// ===============================
router.get("/siswa/:id", (req, res) => {
  const sql = `
    SELECT 
      absensi.id,
      absensi.tanggal,
      absensi.status,
      jadwal.mata_pelajaran,
      jadwal.hari,
      jadwal.jam,
      kelas.nama_kelas
    FROM absensi
    LEFT JOIN jadwal ON jadwal.id = absensi.jadwal_id
    LEFT JOIN kelas ON jadwal.kelas_id = kelas.id
    WHERE absensi.siswa_id = ?
    ORDER BY absensi.tanggal DESC
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log("ERROR GET ABSENSI SISWA:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

module.exports = router;
