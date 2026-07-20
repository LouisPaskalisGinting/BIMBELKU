const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

// ======================
// Konfigurasi Upload
// ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ======================
// GET HERO
// ======================
router.get("/", (req, res) => {
  db.query("SELECT * FROM hero_section LIMIT 1", (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) return res.json({});

    res.json(result[0]);
  });
});

// ======================
// UPDATE HERO
// ======================
router.put("/:id", upload.single("background"), (req, res) => {
  const { title, subtitle, button_text } = req.body;

  let background = null;

  if (req.file) {
    background = "/uploads/" + req.file.filename;
  }

  db.query(
    "SELECT * FROM hero_section WHERE id=?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length === 0)
        return res.status(404).json({
          message: "Data tidak ditemukan",
        });

      if (!background) {
        background = rows[0].background;
      }

      db.query(
        `UPDATE hero_section
           SET
             title=?,
             subtitle=?,
             button_text=?,
             background=?
           WHERE id=?`,
        [title, subtitle, button_text, background, req.params.id],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({
            success: true,
            message: "Hero berhasil diperbarui",
          });
        }
      );
    }
  );
});

module.exports = router;
