const express = require("express");
const router = express.Router();
const db = require("../db");

const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");
// ===============================
// AMBIL NILAI BERDASARKAN EVENT
// ===============================
router.get("/siswa/:event_id/:siswa_id", (req, res) => {
  const { event_id, siswa_id } = req.params;

  const sql = `
    SELECT 
      nilai.*,
      siswa.nama
    FROM nilai
    JOIN siswa ON nilai.siswa_id = siswa.id
    WHERE nilai.event_id = ? AND nilai.siswa_id = ?
  `;

  db.query(sql, [event_id, siswa_id], (err, result) => {
    if (err) return res.json(err);

    res.json(result);
  });
});
// ===============================
// KONFIGURASI MULTER
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ===============================
// UPLOAD NILAI + SIMPAN FILE
// ===============================
router.post("/upload/:event_id", upload.single("file"), (req, res) => {
  console.log("FILE MASUK:", req.file);
  const event_id = req.params.event_id;

  if (!req.file) {
    return res.json({ message: "File tidak ditemukan" });
  }

  // validasi file excel
  if (!req.file.originalname.endsWith(".xlsx")) {
    return res.json({ message: "File harus Excel (.xlsx)" });
  }

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    data.forEach((row) => {
      if (!row.nama || !row.nilai) return;

      db.query(
        "SELECT id FROM siswa WHERE nama=?",
        [row.nama],
        (err, result) => {
          if (err) return console.log(err);

          if (result.length > 0) {
            const siswa_id = result[0].id;

            db.query(
              "INSERT INTO nilai (siswa_id,event_id,nilai) VALUES (?,?,?)",
              [siswa_id, event_id, row.nilai],
              (err) => {
                if (err) console.log(err);
              }
            );
          }
        }
      );
    });

    // simpan file ke database
    db.query(
      "INSERT INTO file_nilai (event_id, nama_file, path_file) VALUES (?, ?, ?)",
      [event_id, req.file.originalname, req.file.filename],
      (err) => {
        if (err) return res.json(err);

        res.json({ message: "Upload berhasil" });
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ message: "Error membaca file" });
  }
});

// ===============================
// AMBIL FILE BERDASARKAN EVENT
// ===============================
router.get("/files/:event_id", (req, res) => {
  const event_id = req.params.event_id;

  db.query(
    "SELECT * FROM file_nilai WHERE event_id=?",
    [event_id],
    (err, result) => {
      if (err) return res.json(err);

      res.json(result);
    }
  );
});

module.exports = router;
