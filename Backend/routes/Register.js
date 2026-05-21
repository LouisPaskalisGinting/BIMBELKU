const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// KONEKSI DATABASE
const db = require("../db"); // sesuaikan dengan file database Anda

// STORAGE MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// REGISTER SISWA
router.post("/siswa", upload.single("bukti_pembayaran"), (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const {
      nama,
      kelas,
      asal_sekolah,
      no_hp,
      nama_orangtua,
      no_hp_orangtua,
      program_id,
      email,
      password,
    } = req.body;

    // FILE
    const bukti_pembayaran = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO siswa
        (
          nama,
          kelas,
          asal_sekolah,
          no_hp,
          nama_orangtua,
          no_hp_orangtua,
          program_id,
          email,
          password,
          bukti_pembayaran,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending")
      `;

    db.query(
      sql,
      [
        nama,
        kelas,
        asal_sekolah,
        no_hp,
        nama_orangtua,
        no_hp_orangtua,
        program_id,
        email,
        password,
        bukti_pembayaran,
      ],
      (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Gagal register",
          });
        }

        res.json({
          message: "Pendaftaran berhasil",
        });
      }
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
