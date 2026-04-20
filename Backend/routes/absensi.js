const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// GENERATE ABSENSI
// ===============================
router.post("/generate", (req, res) => {
  const { jadwal_id, tanggal } = req.body;

  const checkSql = `
    SELECT * FROM absensi 
    WHERE jadwal_id = ? AND tanggal = ?
  `;

  db.query(checkSql, [jadwal_id, tanggal], (err, checkResult) => {
    if (err) return res.status(500).json(err);

    if (checkResult.length > 0) {
      return res.json({ message: "Absensi sudah ada" });
    }

    const sqlJadwal = `
      SELECT kelas_bimbel_id FROM jadwal WHERE id = ?
    `;

    db.query(sqlJadwal, [jadwal_id], (err, jadwalResult) => {
      if (err) return res.status(500).json(err);

      const kelasId = jadwalResult[0].kelas_bimbel_id;

      const sqlSiswa = `
        SELECT id FROM siswa WHERE kelas_bimbel_id = ?
      `;

      db.query(sqlSiswa, [kelasId], (err, siswaResult) => {
        if (err) return res.status(500).json(err);

        const values = siswaResult.map((s) => [
          jadwal_id,
          s.id,
          tanggal,
          "alpha",
        ]);

        const sqlInsert = `
          INSERT INTO absensi (jadwal_id, siswa_id, tanggal, status)
          VALUES ?
        `;

        db.query(sqlInsert, [values], (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Absensi berhasil dibuat" });
        });
      });
    });
  });
});

// ===============================
// GET ABSENSI BY JADWAL (HARI INI)
// ===============================
router.get("/by-jadwal/:jadwal_id", (req, res) => {
  const tanggal = new Date().toISOString().split("T")[0];

  const sql = `
    SELECT 
      absensi.id,
      absensi.status,
      siswa.nama
    FROM absensi
    JOIN siswa ON siswa.id = absensi.siswa_id
    WHERE absensi.jadwal_id = ?
    AND absensi.tanggal = ?
  `;

  db.query(sql, [req.params.jadwal_id, tanggal], (err, result) => {
    if (err) return res.status(500).json(err);

    console.log(result); // 🔥 DEBUG WAJIB
    res.json(result);
  });
});

// ===============================
// UPDATE STATUS
// ===============================
router.put("/:id", (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE absensi SET status=? WHERE id=?",
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Status diupdate" });
    }
  );
});
router.get("/siswa/:id", (req, res) => {
  const sql = `
    SELECT 
      absensi.id,
      absensi.tanggal,
      absensi.status,
      jadwal.mata_pelajaran
    FROM absensi
    LEFT JOIN jadwal ON jadwal.id = absensi.jadwal_id
    WHERE absensi.siswa_id = ?
    ORDER BY absensi.tanggal DESC
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    console.log("HASIL SISWA:", result); // debug
    res.json(result);
  });
});

module.exports = router;
