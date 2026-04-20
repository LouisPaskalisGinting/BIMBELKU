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
    SELECT * FROM jadwal 
    WHERE LOWER(hari) LIKE ?
  `;

  db.query(sql, [`%${hariIni}%`], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ===============================
// GET semua jadwal (UNTUK ADMIN)
// ===============================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      jadwal.*, 
      kelas.nama_kelas AS kelas
    FROM jadwal
    LEFT JOIN kelas 
    ON kelas.id = jadwal.kelas_bimbel_id
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
// GET jadwal berdasarkan siswa
// ===============================
router.get("/siswa/:id", (req, res) => {
  const sql = `
    SELECT jadwal.*, kelas.nama_kelas
    FROM siswa
    JOIN jadwal 
      ON siswa.kelas_bimbel_id = jadwal.kelas_bimbel_id
    LEFT JOIN kelas 
      ON kelas.id = jadwal.kelas_bimbel_id
    WHERE siswa.id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log("ERROR JADWAL SISWA:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});
// ===============================
// GET jadwal berdasarkan tentor
// ===============================
router.get("/tentor/:id", (req, res) => {
  const userId = req.params.id;

  // ambil nama tentor dari tabel user
  db.query("SELECT nama FROM user WHERE id=?", [userId], (err, userResult) => {
    if (err) return res.status(500).json(err);

    if (userResult.length === 0) {
      return res.json([]);
    }

    const namaTentor = userResult[0].nama;

    // ambil jadwal berdasarkan nama
    db.query(
      `SELECT 
          jadwal.*, 
          kelas.nama_kelas AS kelas
        FROM jadwal
        LEFT JOIN kelas 
          ON kelas.id = jadwal.kelas_bimbel_id
        WHERE jadwal.tentor = ?`,
      [namaTentor],
      (err, result) => {
        if (err) {
          console.log("ERROR JADWAL TENTOR:", err);
          return res.status(500).json(err);
        }

        res.json(result);
      }
    );
  });
});

// ===============================
// POST tambah jadwal
// ===============================
router.post("/", (req, res) => {
  const { kelas_bimbel_id, mata_pelajaran, tentor, hari, jam } = req.body;

  db.query(
    "INSERT INTO jadwal (kelas_bimbel_id, mata_pelajaran, tentor, hari, jam) VALUES (?, ?, ?, ?, ?)",
    [kelas_bimbel_id, mata_pelajaran, tentor, hari, jam],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json({ message: "Jadwal berhasil ditambah" });
    }
  );
});

// ===============================
// PUT update jadwal
// ===============================
router.put("/:id", (req, res) => {
  const { kelas_bimbel_id, mata_pelajaran, tentor, hari, jam } = req.body;

  db.query(
    "UPDATE jadwal SET kelas_bimbel_id=?, mata_pelajaran=?, tentor=?, hari=?, jam=? WHERE id=?",
    [kelas_bimbel_id, mata_pelajaran, tentor, hari, jam, req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json({ message: "Jadwal diupdate" });
    }
  );
});

// ===============================
// DELETE jadwal
// ===============================
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM jadwal WHERE id=?", [req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json({ message: "Jadwal dihapus" });
  });
});

module.exports = router;
