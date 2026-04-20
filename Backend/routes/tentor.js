const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

// ============================
// GET semua tentor
// ============================
router.get("/", (req, res) => {
  db.query("SELECT * FROM tentor", (err, result) => {
    if (err) {
      console.log("ERROR GET:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// ============================
// POST tambah tentor + login
// ============================
router.post("/", async (req, res) => {
  console.log("DATA MASUK:", req.body);

  const { nama, mapel, status, no_hp, email, password } = req.body;

  try {
    // 🔴 VALIDASI
    if (!nama || !mapel || !email || !password) {
      return res.status(400).json({
        message: "Nama, mapel, email, dan password wajib diisi",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ============================
    // CEK EMAIL
    // ============================
    db.query("SELECT * FROM user WHERE email=?", [email], (err, result) => {
      if (err) {
        console.log("ERROR CEK EMAIL:", err);
        return res.status(500).json(err);
      }

      if (result.length > 0) {
        return res.status(400).json({
          message: "Email sudah digunakan!",
        });
      }

      // ============================
      // 1. INSERT USER
      // ============================
      db.query(
        "INSERT INTO user (nama, email, password, role) VALUES (?, ?, ?, ?)",
        [nama, email, hashedPassword, "tentor"],
        (err, userResult) => {
          if (err) {
            console.log("ERROR USER:", err);
            return res.status(500).json(err);
          }

          const userId = userResult.insertId;

          // ============================
          // 2. INSERT TENTOR
          // ============================
          db.query(
            `INSERT INTO tentor 
            (user_id, nama, mapel, status, no_hp, email, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              nama,
              mapel,
              status || "Aktif",
              no_hp,
              email,
              hashedPassword,
            ],
            (err, result) => {
              if (err) {
                console.log("ERROR TENTOR:", err);
                return res.status(500).json(err);
              }

              console.log("✅ TENTOR MASUK");

              res.json({
                message: "Tentor berhasil ditambahkan & bisa login",
                id: result.insertId,
              });
            }
          );
        }
      );
    });
  } catch (error) {
    console.log("ERROR SERVER:", error);
    res.status(500).json(error);
  }
});

// ============================
// UPDATE tentor
// ============================
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { nama, mapel, status, no_hp, email } = req.body;

  db.query(
    "UPDATE tentor SET nama=?, mapel=?, status=?, no_hp=?, email=? WHERE id=?",
    [nama, mapel, status, no_hp, email, id],
    (err) => {
      if (err) {
        console.log("ERROR UPDATE:", err);
        return res.status(500).json(err);
      }

      res.json({ message: "Tentor berhasil diupdate" });
    }
  );
});

// ============================
// DELETE tentor
// ============================
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM tentor WHERE id=?", [id], (err) => {
    if (err) {
      console.log("ERROR DELETE:", err);
      return res.status(500).json(err);
    }

    res.json({ message: "Tentor berhasil dihapus" });
  });
});

module.exports = router;
