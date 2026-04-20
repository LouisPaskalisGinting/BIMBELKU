const express = require("express");
const router = express.Router();
const db = require("../db");

// GET EVENT
router.get("/", (req, res) => {
  db.query("SELECT * FROM event ORDER BY tanggal ASC", (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// POST EVENT
router.post("/", (req, res) => {
  db.query("INSERT INTO event SET ?", req.body, (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Event berhasil ditambahkan" });
  });
});

module.exports = router;
