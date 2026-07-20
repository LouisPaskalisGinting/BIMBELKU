const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// GET JADWAL HARI INI
// ===============================
router.get("/hari-ini", (req, res) => {
  const hariIni = new Date()
    .toLocaleDateString("id-ID", { weekday: "long" })
    .toLowerCase();

  const sql = `
    SELECT 
      jadwal.*,
      kelas.nama_kelas AS kelas,
      kelas.nama_kelas,
      program.nama_program
    FROM jadwal
    LEFT JOIN kelas ON kelas.id = jadwal.kelas_id
    LEFT JOIN program ON program.id = kelas.program_id
    WHERE LOWER(jadwal.hari) LIKE ?
    ORDER BY jadwal.jam ASC
  `;

  db.query(sql, [`%${hariIni}%`], (err, result) => {
    if (err) {
      console.log("ERROR GET JADWAL HARI INI:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

// ===============================
// GET SEMUA JADWAL UNTUK ADMIN
// ===============================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      jadwal.*,
      kelas.nama_kelas AS kelas,
      kelas.nama_kelas,
      program.nama_program
    FROM jadwal
    LEFT JOIN kelas ON kelas.id = jadwal.kelas_id
    LEFT JOIN program ON program.id = kelas.program_id
    ORDER BY jadwal.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("ERROR GET JADWAL:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

// ===============================
// GET JADWAL BERDASARKAN SISWA
// ===============================
router.get("/siswa/:id", (req, res) => {
  const siswaId = req.params.id;

  const sql = `
    SELECT 
      jadwal.*,
      kelas.nama_kelas AS kelas,
      kelas.nama_kelas,
      program.nama_program
    FROM siswa
    JOIN jadwal ON siswa.kelas_id = jadwal.kelas_id
    LEFT JOIN kelas ON kelas.id = jadwal.kelas_id
    LEFT JOIN program ON program.id = kelas.program_id
    WHERE siswa.id = ?
    ORDER BY jadwal.id DESC
  `;

  db.query(sql, [siswaId], (err, result) => {
    if (err) {
      console.log("ERROR JADWAL SISWA:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

// ===============================
// GET JADWAL BERDASARKAN TENTOR
// ===============================
router.get("/tentor/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT nama FROM user WHERE id = ?",
    [userId],
    (err, userResult) => {
      if (err) {
        console.log("ERROR GET USER TENTOR:", err);
        return res.status(500).json(err);
      }

      if (userResult.length === 0) {
        return res.json([]);
      }

      const namaTentor = userResult[0].nama;

      const sql = `
      SELECT 
        jadwal.*,
        kelas.nama_kelas AS kelas,
        kelas.nama_kelas,
        program.nama_program
      FROM jadwal
      LEFT JOIN kelas ON kelas.id = jadwal.kelas_id
      LEFT JOIN program ON program.id = kelas.program_id
      WHERE jadwal.tentor = ?
      ORDER BY jadwal.id DESC
    `;

      db.query(sql, [namaTentor], (err, result) => {
        if (err) {
          console.log("ERROR JADWAL TENTOR:", err);
          return res.status(500).json(err);
        }

        res.json(result);
      });
    }
  );
});

// ===============================
// POST TAMBAH JADWAL
// ===============================
router.post("/", (req, res) => {
  const { kelas_id, mata_pelajaran, tentor, hari, jam, tentor_id } = req.body;

  if (!kelas_id || !mata_pelajaran || !tentor || !hari || !jam) {
    return res.status(400).json({
      message: "Kelas, mata pelajaran, tentor, hari, dan jam wajib diisi",
      body_diterima: req.body,
    });
  }

  const sqlKelas = `
    SELECT nama_kelas 
    FROM kelas 
    WHERE id = ?
  `;

  db.query(sqlKelas, [kelas_id], (err, kelasResult) => {
    if (err) {
      console.log("ERROR CEK KELAS:", err);
      return res.status(500).json(err);
    }

    if (kelasResult.length === 0) {
      return res.status(404).json({
        message: "Kelas tidak ditemukan",
      });
    }

    const namaKelas = kelasResult[0].nama_kelas;

    const sql = `
      INSERT INTO jadwal 
      (kelas, kelas_id, mata_pelajaran, tentor, hari, jam, tentor_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        namaKelas,
        kelas_id,
        mata_pelajaran,
        tentor,
        hari,
        jam,
        tentor_id || null,
      ],
      (err) => {
        if (err) {
          console.log("ERROR TAMBAH JADWAL:", err);
          return res.status(500).json(err);
        }

        res.json({
          message: "Jadwal berhasil ditambah",
        });
      }
    );
  });
});

// ===============================
// PUT UPDATE JADWAL
// ===============================
router.put("/:id", (req, res) => {
  const { kelas_id, mata_pelajaran, tentor, hari, jam, tentor_id } = req.body;

  if (!kelas_id || !mata_pelajaran || !tentor || !hari || !jam) {
    return res.status(400).json({
      message: "Kelas, mata pelajaran, tentor, hari, dan jam wajib diisi",
      body_diterima: req.body,
    });
  }

  const sqlKelas = `
    SELECT nama_kelas 
    FROM kelas 
    WHERE id = ?
  `;

  db.query(sqlKelas, [kelas_id], (err, kelasResult) => {
    if (err) {
      console.log("ERROR CEK KELAS:", err);
      return res.status(500).json(err);
    }

    if (kelasResult.length === 0) {
      return res.status(404).json({
        message: "Kelas tidak ditemukan",
      });
    }

    const namaKelas = kelasResult[0].nama_kelas;

    const sql = `
      UPDATE jadwal
      SET 
        kelas = ?,
        kelas_id = ?,
        mata_pelajaran = ?,
        tentor = ?,
        hari = ?,
        jam = ?,
        tentor_id = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        namaKelas,
        kelas_id,
        mata_pelajaran,
        tentor,
        hari,
        jam,
        tentor_id || null,
        req.params.id,
      ],
      (err) => {
        if (err) {
          console.log("ERROR UPDATE JADWAL:", err);
          return res.status(500).json(err);
        }

        res.json({
          message: "Jadwal berhasil diupdate",
        });
      }
    );
  });
});

// ===============================
// DELETE JADWAL
// ===============================
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM jadwal WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.log("ERROR DELETE JADWAL:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Jadwal dihapus",
    });
  });
});

module.exports = router;
