const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// import routes
const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/Register");
const siswaRoutes = require("./routes/siswa");
const kelasRoute = require("./routes/Kelas");
const jadwalRoute = require("./routes/jadwal");
const tentorRoute = require("./routes/tentor");
const pembayaranRoute = require("./routes/pembayaran");
const absensiRoute = require("./routes/absensi");
const pengumumanRoute = require("./routes/pengumuman");
const programRoute = require("./routes/program");
const eventRoute = require("./routes/event");
const nilaiRoute = require("./routes/nilai");
const notifikasiRoute = require("./routes/notifikasi");
const dashboardRoute = require("./routes/dashboard");
const aboutRoute = require("./routes/about");
const testimonialRoute = require("./routes/testimonial");
const faqRoute = require("./routes/faq");
const galeriRoute = require("./routes/galeri");
const kontakRoute = require("./routes/kontak");

app.use("/auth", authRoutes);
app.use("/register", registerRoutes);
app.use("/siswa", siswaRoutes);
app.use("/kelas", kelasRoute);
app.use("/jadwal", jadwalRoute);
app.use("/tentor", tentorRoute);
app.use("/pembayaran", pembayaranRoute);
app.use("/absensi", absensiRoute);
app.use("/pengumuman", pengumumanRoute);
app.use("/program", programRoute);
app.use("/event", eventRoute);
app.use("/nilai", nilaiRoute);
app.use("/notifikasi", notifikasiRoute);
app.use("/dashboard", dashboardRoute);
app.use("/about", aboutRoute);
app.use("/testimonial", testimonialRoute);
app.use("/faq", faqRoute);
app.use("/galeri", galeriRoute);
app.use("/kontak", kontakRoute);

app.use("/hero", require("./routes/hero"));
app.get("/", (req, res) => {
  res.send("Backend Bimbel Berjalan");
});

app.listen(3000, () => console.log("Server running on port 3000"));
