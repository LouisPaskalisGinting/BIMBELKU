const express = require("express");
const db = require("../db");
const router = express.Router();
const bcrypt = require("bcryptjs");

// ===============================
// GET semua siswa approved
// ===============================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      siswa.*,
      program.nama_program,
      kelas.nama_kelas
    FROM siswa
    LEFT JOIN program ON siswa.program_id = program.id
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    WHERE siswa.status='approved'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ===============================
// GET siswa pending
// ===============================
router.get("/pending", (req, res) => {
  const sql = `
    SELECT 
      siswa.*,
      program.nama_program,
      kelas.nama_kelas
    FROM siswa
    LEFT JOIN program ON siswa.program_id = program.id
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    WHERE siswa.status='pending'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ===============================
// GET DETAIL SISWA UNTUK DASHBOARD
// ===============================
router.get("/dashboard/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { email } = req.query;

  const sql = `
    SELECT 
      siswa.*,
      program.nama_program,
      kelas.nama_kelas
    FROM siswa
    LEFT JOIN program ON siswa.program_id = program.id
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    WHERE siswa.user_id = ? OR siswa.email = ?
    LIMIT 1
  `;

  db.query(sql, [user_id, email], (err, result) => {
    if (err) {
      console.log("DASHBOARD SISWA ERROR:", err);
      return res.status(500).json({
        message: "Gagal mengambil data siswa",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Data siswa tidak ditemukan",
      });
    }

    res.json(result[0]);
  });
});

// ===============================
// APPROVE SISWA
// ===============================
router.put("/approve/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM siswa WHERE id=?", [id], async (err, siswaResult) => {
    if (err) return res.status(500).json(err);

    if (siswaResult.length === 0) {
      return res.status(404).json({
        message: "Siswa tidak ditemukan",
      });
    }

    const siswa = siswaResult[0];

    db.query(
      "SELECT * FROM user WHERE email=?",
      [siswa.email],
      async (err, userCheck) => {
        if (err) return res.status(500).json(err);

        if (userCheck.length > 0) {
          return res.status(400).json({
            message: "Email sudah digunakan",
          });
        }

        try {
          const hashedPassword = await bcrypt.hash(siswa.password, 10);

          db.query(
            `
          INSERT INTO user (nama, email, password, role)
          VALUES (?, ?, ?, ?)
          `,
            [siswa.nama, siswa.email, hashedPassword, "siswa"],
            (err, userInsert) => {
              if (err) return res.status(500).json(err);

              const user_id = userInsert.insertId;

              db.query(
                `
              UPDATE siswa
              SET status='approved', user_id=?
              WHERE id=?
              `,
                [user_id, id],
                (err) => {
                  if (err) return res.status(500).json(err);

                  res.json({
                    message: "Siswa berhasil diapprove",
                  });
                }
              );
            }
          );
        } catch (error) {
          res.status(500).json({
            message: "Hash password gagal",
          });
        }
      }
    );
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
      siswa.email,
      program.nama_program,
      kelas.nama_kelas
    FROM siswa
    LEFT JOIN program ON siswa.program_id = program.id
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    WHERE siswa.nama LIKE ?
  `;

  db.query(sql, [`%${nama}%`], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ===============================
// SISWA BERDASARKAN KELAS
// ===============================
router.get("/kelas/:kelas_id", (req, res) => {
  const kelas_id = req.params.kelas_id;

  const sql = `
    SELECT 
      siswa.*,
      program.nama_program,
      kelas.nama_kelas
    FROM siswa
    LEFT JOIN program ON siswa.program_id = program.id
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    WHERE siswa.kelas_id = ?
  `;

  db.query(sql, [kelas_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ===============================
// MASUKKAN SISWA KE KELAS
// ===============================
router.put("/masuk-kelas/:id", (req, res) => {
  const id = req.params.id;
  const { kelas_id } = req.body;

  if (!kelas_id) {
    return res.status(400).json({
      message: "kelas_id wajib diisi",
    });
  }

  const sql = `
    UPDATE siswa
    SET kelas_id = ?
    WHERE id = ?
  `;

  db.query(sql, [kelas_id, id], (err, result) => {
    if (err) {
      console.log("ERROR MASUK KELAS:", err);
      return res.status(500).json({
        message: "Gagal memasukkan siswa ke kelas",
      });
    }

    res.json({
      message: "Siswa berhasil dimasukkan ke kelas",
    });
  });
});

// ===============================
// SISWA BERDASARKAN KELAS BIMBEL
// ===============================
router.get("/kelas-bimbel/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      siswa.*,
      program.nama_program,
      kelas.nama_kelas
    FROM siswa
    LEFT JOIN program ON siswa.program_id = program.id
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    WHERE siswa.kelas_bimbel_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ===============================
// GET DETAIL SISWA BY ID
// ===============================
router.get("/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      siswa.*,
      program.nama_program,
      kelas.nama_kelas
    FROM siswa
    LEFT JOIN program ON siswa.program_id = program.id
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    WHERE siswa.id=?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    res.json(result[0]);
  });
});

// ===============================
// TAMBAH SISWA
// ===============================
router.post("/", (req, res) => {
  db.query("INSERT INTO siswa SET ?", req.body, (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Siswa berhasil ditambahkan",
    });
  });
});

// ===============================
// UPDATE SISWA
// ===============================
router.put("/:id", (req, res) => {
  const id = req.params.id;

  const {
    nama,
    email,
    asal_sekolah,
    no_hp,
    nama_orangtua,
    no_hp_orangtua,
    program_id,
    kelas_id,
  } = req.body;

  const sql = `
    UPDATE siswa
    SET
      nama=?,
      email=?,
      asal_sekolah=?,
      no_hp=?,
      nama_orangtua=?,
      no_hp_orangtua=?,
      program_id=?,
      kelas_id=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      nama,
      email,
      asal_sekolah,
      no_hp,
      nama_orangtua,
      no_hp_orangtua,
      program_id,
      kelas_id,
      id,
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Update berhasil",
      });
    }
  );
});

// ===============================
// DELETE SISWA
// ===============================
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM siswa WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Siswa berhasil dihapus",
    });
  });
});

module.exports = router;
