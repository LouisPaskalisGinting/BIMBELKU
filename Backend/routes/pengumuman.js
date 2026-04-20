const express = require("express");
const router = express.Router();
const db = require("../db");

// GET semua pengumuman
router.get("/", (req, res) => {
  db.query("SELECT * FROM pengumuman ORDER BY tanggal DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST tambah pengumuman
router.post("/", (req, res) => {
  const { judul, isi } = req.body;

  db.query(
    "INSERT INTO pengumuman (judul, isi) VALUES (?, ?)",
    [judul, isi],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Pengumuman ditambahkan" });
    }
  );
});

// PUT edit
router.put("/:id", (req, res) => {
  const { judul, isi } = req.body;

  db.query(
    "UPDATE pengumuman SET judul=?, isi=? WHERE id=?",
    [judul, isi, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Pengumuman diupdate" });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM pengumuman WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Pengumuman dihapus" });
  });
});

module.exports = router;
