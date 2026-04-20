const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

// ============================
// LOGIN (USER + ROLE)
// ============================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM user WHERE LOWER(email)=LOWER(?)",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(401).json({ message: "Email tidak ditemukan" });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Password salah" });
      }

      // 🔥 CEK KHUSUS SISWA
      if (user.role === "siswa") {
        db.query(
          "SELECT status FROM siswa WHERE user_id=?",
          [user.id],
          (err, siswaResult) => {
            if (err) return res.status(500).json(err);

            if (siswaResult.length === 0) {
              return res
                .status(401)
                .json({ message: "Data siswa tidak ditemukan" });
            }

            if (siswaResult[0].status !== "approved") {
              return res.status(403).json({
                message: "Akun belum disetujui admin",
              });
            }

            // ✅ lanjut login
            return res.json({
              message: "Login berhasil",
              role: user.role,
              user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
              },
            });
          }
        );
      } else {
        // admin / tentor langsung login
        return res.json({
          message: "Login berhasil",
          role: user.role,
          user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
          },
        });
      }
    }
  );
});

// ============================
// GENERATE HASH (WAJIB PAKAI)
// ============================
router.get("/generate", async (req, res) => {
  try {
    const hash = await bcrypt.hash("123", 10);
    res.json({ hash });
  } catch (error) {
    res.json(error);
  }
});

// ============================
// CREATE ADMIN (AUTO HASH)
// ============================
router.get("/create-admin", async (req, res) => {
  try {
    const hashed = await bcrypt.hash("123", 10);

    db.query(
      "INSERT INTO user (nama, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin", "admin@gmail.com", hashed, "admin"],
      (err) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        res.json({ message: "Admin berhasil dibuat" });
      }
    );
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
