const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// GET semua kelas
// ===============================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      kelas.*,
      program.nama_program
    FROM kelas
    LEFT JOIN program ON kelas.program_id = program.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("ERROR GET KELAS:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

// ===============================
// GET kelas berdasarkan ID
// ===============================
router.get("/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      kelas.*,
      program.nama_program
    FROM kelas
    LEFT JOIN program ON kelas.program_id = program.id
    WHERE kelas.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("ERROR GET DETAIL KELAS:", err);
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Kelas tidak ditemukan",
      });
    }

    res.json(result[0]);
  });
});

// ===============================
// POST tambah kelas
// ===============================
router.post("/", (req, res) => {
  const { nama_kelas, program_id } = req.body;

  if (!nama_kelas || !program_id) {
    return res.status(400).json({
      message: "Nama kelas dan program wajib diisi",
    });
  }

  const sql = `
    INSERT INTO kelas (nama_kelas, program_id)
    VALUES (?, ?)
  `;

  db.query(sql, [nama_kelas, program_id], (err) => {
    if (err) {
      console.log("ERROR TAMBAH KELAS:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Kelas berhasil ditambah",
    });
  });
});

// ===============================
// PUT edit kelas
// ===============================
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { nama_kelas, program_id } = req.body;

  if (!nama_kelas || !program_id) {
    return res.status(400).json({
      message: "Nama kelas dan program wajib diisi",
    });
  }

  const sql = `
    UPDATE kelas
    SET nama_kelas = ?, program_id = ?
    WHERE id = ?
  `;

  db.query(sql, [nama_kelas, program_id, id], (err) => {
    if (err) {
      console.log("ERROR UPDATE KELAS:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Kelas berhasil diupdate",
    });
  });
});

// ===============================
// DELETE kelas
// ===============================
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM kelas WHERE id = ?", [id], (err) => {
    if (err) {
      console.log("ERROR DELETE KELAS:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Kelas dihapus",
    });
  });
});

module.exports = router;
