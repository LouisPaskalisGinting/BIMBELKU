const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

// ============================
// REGISTER SISWA
// ============================
router.post("/siswa", async (req, res) => {
  const {
    nama,
    email,
    password,
    kelas,
    asal_sekolah,
    no_hp,
    nama_orangtua,
    no_hp_orangtua,
    program_id,
  } = req.body;

  try {
    // 🔴 VALIDASI
    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Data wajib diisi" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // ============================
    // 1. INSERT USER
    // ============================
    db.query(
      "INSERT INTO user (nama, email, password, role) VALUES (?, ?, ?, ?)",
      [nama, email, hashed, "siswa"],
      (err, userResult) => {
        if (err) {
          console.log("ERROR USER:", err);
          return res.status(500).json(err);
        }

        const userId = userResult.insertId;

        // ============================
        // 2. INSERT SISWA
        // ============================
        db.query(
          `INSERT INTO siswa 
          (user_id, nama, email, kelas, asal_sekolah, no_hp, nama_orangtua, no_hp_orangtua, program_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            nama,
            email,
            kelas,
            asal_sekolah,
            no_hp,
            nama_orangtua,
            no_hp_orangtua,
            program_id,
            "pending",
          ],
          (err) => {
            if (err) {
              console.log("❌ ERROR SISWA:", err);
              return res.status(500).json(err);
            }

            console.log("✅ SISWA MASUK");

            res.json({ message: "Register berhasil" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
