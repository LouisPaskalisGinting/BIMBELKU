const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// GET semua kelas
// ===============================
router.get("/", (req, res) => {
  db.query("SELECT * FROM kelas", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ===============================
// GET kelas berdasarkan ID
// ===============================
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM kelas WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ===============================
// POST tambah kelas
// ===============================
router.post("/", (req, res) => {
  const { nama_kelas, program } = req.body;

  db.query(
    "INSERT INTO kelas (nama_kelas, program) VALUES (?, ?)",
    [nama_kelas, program],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json({ message: "Kelas berhasil ditambah" });
    }
  );
});

// ===============================
// PUT edit kelas
// ===============================
router.put("/:id", (req, res) => {
  const { nama_kelas, program, tentor, jadwal } = req.body;

  db.query(
    "UPDATE kelas SET Kelas=?, program=?, tentor=?, jadwal=? WHERE id=?",
    [nama_kelas, program, tentor, jadwal, req.params.id],
    (err) => {
      if (err) return res.json(err);
      res.json({ message: "Kelas berhasil diupdate" });
    }
  );
});

// ===============================
// DELETE kelas
// ===============================
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM kelas WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    res.json({ message: "Kelas dihapus" });
  });
});

module.exports = router;
