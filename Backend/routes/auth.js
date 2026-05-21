const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// ============================
// LOGIN (USER + ROLE)
// ============================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM user WHERE LOWER(email)=LOWER(?)",
    [email],
    async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(401).json({
          message: "Email tidak ditemukan",
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Password salah",
        });
      }

      // LOGIN SISWA
      if (user.role === "siswa") {
        db.query(
          `
          SELECT siswa.*, program.nama_program
          FROM siswa
          LEFT JOIN program
          ON siswa.program_id = program.id
          WHERE siswa.user_id=?
          `,
          [user.id],
          (err, siswaResult) => {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            }

            if (siswaResult.length === 0) {
              return res.status(404).json({
                message: "Data siswa tidak ditemukan",
              });
            }

            const siswa = siswaResult[0];

            if (siswa.status !== "approved") {
              return res.status(403).json({
                message: "Akun belum disetujui admin",
              });
            }

            return res.json({
              message: "Login berhasil",
              role: user.role,
              user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role,
              },
              siswa: {
                id: siswa.id,
                nama: siswa.nama,
                email: siswa.email,
                kelas: siswa.kelas,
                asal_sekolah: siswa.asal_sekolah,
                no_hp: siswa.no_hp,
                nama_orangtua: siswa.nama_orangtua,
                no_hp_orangtua: siswa.no_hp_orangtua,
                program_id: siswa.program_id,
                nama_program: siswa.nama_program,
                status: siswa.status,
              },
            });
          }
        );
      } else {
        return res.json({
          message: "Login berhasil",
          role: user.role,
          user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role,
          },
        });
      }
    }
  );
});

// ============================
// GENERATE HASH
// ============================
router.get("/generate", async (req, res) => {
  try {
    const hash = await bcrypt.hash("123", 10);
    res.json({ hash });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ============================
// FORGOT PASSWORD
// ============================
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM user WHERE email=?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Email tidak ditemukan",
      });
    }

    const user = result[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expire = Date.now() + 15 * 60 * 1000;

    db.query(
      "UPDATE user SET reset_token=?, reset_token_expire=? WHERE id=?",
      [token, expire, user.id],
      (err) => {
        if (err) return res.status(500).json(err);

        const resetLink = `http://localhost:3001/reset-password/${token}`;

        console.log("RESET LINK:");
        console.log(resetLink);

        res.json({
          message: "Link reset password berhasil dibuat",
          resetLink,
        });
      }
    );
  });
});

// ============================
// RESET PASSWORD
// ============================
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  db.query(
    "SELECT * FROM user WHERE reset_token=?",
    [token],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(400).json({
          message: "Token tidak valid",
        });
      }

      const user = result[0];

      if (Date.now() > user.reset_token_expire) {
        return res.status(400).json({
          message: "Token sudah expired",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        `
      UPDATE user
      SET password=?,
          reset_token=NULL,
          reset_token_expire=NULL
      WHERE id=?
      `,
        [hashedPassword, user.id],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({
            message: "Password berhasil direset",
          });
        }
      );
    }
  );
});

// ============================
// CREATE ADMIN
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
          return res.status(500).json(err);
        }

        res.json({
          message: "Admin berhasil dibuat",
        });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "EMAIL_GMAIL_ANDA",
    pass: "APP_PASSWORD_GMAIL",
  },
});

module.exports = router;
