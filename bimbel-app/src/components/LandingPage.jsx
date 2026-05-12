import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [program, setProgram] = useState([]);

  const handleDaftar = () => {
    navigate("/Register");
  };

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    try {
      const res = await fetch("http://localhost:3000/program/aktif");
      const data = await res.json();
      setProgram(data);
    } catch (err) {
      console.log(err);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-container">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>

        <nav className="nav-menu">
          <span onClick={() => scrollToSection("hero")}>Home</span>
          <span onClick={() => scrollToSection("program")}>Program</span>
          <span onClick={() => scrollToSection("testimoni")}>Testimoni</span>
          <span onClick={() => scrollToSection("about")}>About Us</span>

          <button className="btn-login" onClick={() => navigate("/Login")}>
            Login
          </button>
        </nav>

        <button className="btn-daftar" onClick={handleDaftar}>
          DAFTAR SEKARANG
        </button>
      </header>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-text">
          <h1>BIMBELKU</h1>
          <p>“Shine Brighter, Learn Smarter”</p>

          <button className="hero-btn" onClick={handleDaftar}>
            Daftar Sekarang
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about">
        <h2>About Us</h2>

        <p>
          Alpha Star College adalah lembaga bimbingan belajar yang berdiri pada
          tahun 2024 dengan tujuan membantu siswa memahami pelajaran dengan
          metode yang mudah dipahami dan menyenangkan.
        </p>
      </section>

      {/* PROGRAM */}
      <section id="program" className="program">
        <h2>Program Kami</h2>

        <div className="program-grid">
          {program.map((p) => (
            <div className="program-card" key={p.id}>
              {p.gambar && (
                <img
                  src={p.gambar}
                  alt={p.nama_program}
                  className="program-img"
                />
              )}

              <h3>{p.nama_program}</h3>

              <p className="program-desc">{p.deskripsi}</p>

              <div className="program-info">
                <span>Durasi : {p.durasi}</span>

                <span>{p.jumlah_pertemuan} Pertemuan</span>
              </div>

              <div className="price-box">
                Rp {Number(p.harga).toLocaleString("id-ID")}
              </div>

              <button className="btn-daftar-card" onClick={handleDaftar}>
                Daftar Sekarang
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONI */}
      <section id="testimoni" className="testimoni">
        <h2>Testimoni</h2>

        <div className="testimoni-scroll">
          {[1, 2, 3, 4].map((item) => (
            <div className="testimoni-card" key={item}>
              <img src="/student-testimoni.png" alt="Siswa" />

              <h4>Brian Haganta Ginting</h4>

              <p>SMA 1 Tiganderket</p>

              <p>Kedokteran Hewan - Udayana</p>

              <p className="pesan">
                “Proses pembelajaran di ASC seru dan mudah dipahami.”
              </p>

              <p className="signature">Pesan : Semangat, ASC The Best</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
