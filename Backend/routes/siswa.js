const express = require("express");
const db = require("../db");
const router = express.Router();

router.put("/masuk-kelas/:id", (req, res) => {
  console.log("PARAM ID:", req.params.id);
  console.log("BODY:", req.body);

  const { kelas_bimbel_id } = req.body;

  db.query(
    "UPDATE siswa SET kelas_bimbel_id=? WHERE id=?",
    [kelas_bimbel_id, req.params.id],
    (err, result) => {
      if (err) {
        console.log("ERROR:", err);
        return res.status(500).json(err);
      }

      console.log("RESULT:", result);

      res.json({
        message: "OK",
        affectedRows: result.affectedRows,
      });
    }
  );
});

// ===============================
// GET semua siswa (HANYA APPROVED)
// ===============================
router.get("/", (req, res) => {
  const sql = `
    SELECT siswa.*, program.nama_program
    FROM siswa
    LEFT JOIN program ON siswa.program_id = program.id
    WHERE siswa.status = 'approved'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    console.log("APPROVED:", result);
    res.json(result);
  });
});

// ===============================
// GET siswa pending (UNTUK PESAN)
// ===============================
router.get("/pending", (req, res) => {
  const sql = `
    SELECT siswa.*, program.nama_program
    FROM siswa
    LEFT JOIN program ON siswa.program_id = program.id
    WHERE LOWER(siswa.status) = 'pending'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    console.log("PENDING:", result);
    res.json(result);
  });
});

router.get("/kelas/:id", (req, res) => {
  db.query(
    "SELECT * FROM siswa WHERE kelas_bimbel_id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});
// ===============================
// APPROVE SISWA
// ===============================
router.put("/approve/:id", (req, res) => {
  const id = req.params.id;

  const sql = "UPDATE siswa SET status='approved' WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    console.log("APPROVE:", result); // 🔥 debug

    res.json({
      message: "Siswa berhasil di-approve",
      affectedRows: result.affectedRows,
    });
  });
});

// ===============================
// SEARCH SISWA
// ===============================
router.get("/search/:nama", (req, res) => {
  const nama = req.params.nama;

  const sql = `
  SELECT 
  siswa.id,
  siswa.nama,
  program.nama_program
  FROM siswa
  LEFT JOIN program
  ON siswa.program_id = program.id
  WHERE siswa.nama LIKE ?
  LIMIT 10
  `;

  db.query(sql, [`%${nama}%`], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// ===============================
// SISWA BERDASARKAN KELAS
// ===============================
router.get("/kelas/:kelas", (req, res) => {
  const kelas = req.params.kelas;

  const sql = `
  SELECT 
  siswa.*,
  program.nama_program
  FROM siswa
  LEFT JOIN program
  ON siswa.program_id = program.id
  WHERE siswa.kelas = ?
  `;

  db.query(sql, [kelas], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// ===============================
// MASUKKAN SISWA KE KELAS
// ===============================
router.put("/masuk-kelas/:id", (req, res) => {
  const siswa_id = req.params.id;
  const kelas_bimbel_id = req.body.kelas;

  db.query(
    "UPDATE siswa SET kelas=? WHERE id=?",
    [kelas_bimbel_id, siswa_id, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Siswa berhasil masuk kelas",
        affectedRows: result.affectedRows,
      });
    }
  );
});

// ===============================
// POST tambah siswa
// ===============================
router.post("/", (req, res) => {
  db.query("INSERT INTO siswa SET ?", req.body, (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Siswa berhasil ditambahkan" });
  });
});

// ===============================
// UPDATE siswa
// ===============================
router.put("/:id", (req, res) => {
  const id = req.params.id;

  const { nama, email, asal_sekolah, no_hp, nama_orangtua, no_hp_orangtua } =
    req.body;

  const sql = `
    UPDATE siswa 
    SET 
      nama=?,
      email=?,
      asal_sekolah=?,
      no_hp=?,
      nama_orangtua=?,
      no_hp_orangtua=?
    WHERE id=?
  `;

  db.query(
    sql,
    [nama, email, asal_sekolah, no_hp, nama_orangtua, no_hp_orangtua, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      console.log("UPDATED:", result); // 🔥 debug

      res.json({
        message: "Update berhasil",
        affectedRows: result.affectedRows,
      });
    }
  );
});

// ===============================
// DELETE siswa
// ===============================
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM siswa WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Siswa berhasil dihapus" });
  });
});

module.exports = router;
router.get("/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
  SELECT siswa.*, program.nama_program
  FROM siswa
  LEFT JOIN program ON siswa.program_id = program.id
  WHERE siswa.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json(result[0]);
  });
});
