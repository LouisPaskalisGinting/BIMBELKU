import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  // ===========================
  // STATE
  // ===========================

  const [hero, setHero] = useState({
    title: "",
    subtitle: "",
    button_text: "",
    background: "",
  });

  const [about, setAbout] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [program, setProgram] = useState([]);

  const [testimonial, setTestimonial] = useState([]);

  const [faq, setFaq] = useState([]);

  const [galeri, setGaleri] = useState([]);

  const [kontak, setKontak] = useState({});

  const [activeFAQ, setActiveFAQ] = useState(null);

  // ===========================
  // USE EFFECT
  // ===========================

  useEffect(() => {
    fetchHero();
    fetchAbout();
    fetchProgram();
    fetchTestimonial();
    fetchFAQ();
    fetchGaleri();
    fetchKontak();
  }, []);

  // ===========================
  // NAVIGASI
  // ===========================

  const handleDaftar = () => {
    navigate("/Register");
  };

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({
      behavior: "smooth",
    });
  };

  // ===========================
  // FETCH HERO
  // ===========================

  const fetchHero = async () => {
    try {
      const res = await fetch("http://localhost:3000/hero");
      const data = await res.json();

      setHero(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // FETCH ABOUT
  // ===========================

  const fetchAbout = async () => {
    try {
      const res = await fetch("http://localhost:3000/about");
      const data = await res.json();

      setAbout(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // FETCH PROGRAM
  // ===========================

  const fetchProgram = async () => {
    try {
      const res = await fetch("http://localhost:3000/program/aktif");
      const data = await res.json();

      setProgram(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // FETCH TESTIMONIAL
  // ===========================

  const fetchTestimonial = async () => {
    try {
      const res = await fetch("http://localhost:3000/testimonial");
      const data = await res.json();

      setTestimonial(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // FETCH FAQ
  // ===========================

  const fetchFAQ = async () => {
    try {
      const res = await fetch("http://localhost:3000/faq");
      const data = await res.json();

      setFaq(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // FETCH GALERI
  // ===========================

  const fetchGaleri = async () => {
    try {
      const res = await fetch("http://localhost:3000/galeri");
      const data = await res.json();

      setGaleri(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // FETCH KONTAK
  // ===========================

  const fetchKontak = async () => {
    try {
      const res = await fetch("http://localhost:3000/kontak");
      const data = await res.json();

      setKontak(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // RENDER
  // ===========================

  return (
    <div className="landing-container">
      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="logo">
          <img src="/logobimbelku.png" alt="Logo" />
        </div>

        <nav className="nav-menu">
          <span onClick={() => scrollToSection("hero")}>Home</span>

          <span onClick={() => scrollToSection("about")}>About</span>

          <span onClick={() => scrollToSection("program")}>Program</span>

          <span onClick={() => scrollToSection("testimoni")}>Testimoni</span>

          <span onClick={() => scrollToSection("faq")}>FAQ</span>

          <span onClick={() => scrollToSection("galeri")}>Galeri</span>

          <span onClick={() => scrollToSection("kontak")}>Kontak</span>

          <button className="btn-login" onClick={() => navigate("/Login")}>
            Login
          </button>
        </nav>

        <button className="btn-daftar" onClick={handleDaftar}>
          {hero.button_text || "DAFTAR SEKARANG"}
        </button>
      </header>
      {/* ================= HERO ================= */}

      <section
        id="hero"
        className="hero"
        style={{
          backgroundImage: hero.background
            ? `url(http://localhost:3000${hero.background})`
            : "none",
        }}
      >
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>{hero.title}</h1>

            <p>{hero.subtitle}</p>

            <button className="hero-btn" onClick={handleDaftar}>
              {hero.button_text}
            </button>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section id="about" className="about">
        <div className="about-container">
          <div className="about-image">
            {about.image && (
              <img
                src={`http://localhost:3000${about.image}`}
                alt={about.title}
              />
            )}
          </div>

          <div className="about-content">
            <h2>{about.title}</h2>

            <p>{about.description}</p>
          </div>
        </div>
      </section>

      {/* ================= PROGRAM ================= */}

      <section id="program" className="program">
        <h2>Program Kami</h2>

        <div className="program-grid">
          {program.length === 0 ? (
            <p>Belum ada program tersedia.</p>
          ) : (
            program.map((item) => (
              <div className="program-card" key={item.id}>
                {item.gambar && (
                  <img
                    src={item.gambar}
                    alt={item.nama_program}
                    className="program-img"
                  />
                )}

                <h3>{item.nama_program}</h3>

                <p className="program-desc">{item.deskripsi}</p>

                <div className="program-info">
                  <span>Durasi : {item.durasi}</span>

                  <span>{item.jumlah_pertemuan} Pertemuan</span>
                </div>

                <div className="price-box">
                  Rp {Number(item.harga).toLocaleString("id-ID")}
                </div>

                <button className="btn-daftar-card" onClick={handleDaftar}>
                  Daftar Sekarang
                </button>
              </div>
            ))
          )}
        </div>
      </section>
      {/* ================= TESTIMONI ================= */}

      <section id="testimoni" className="testimoni">
        <h2>Testimoni Alumni</h2>

        <div className="testimoni-scroll">
          {testimonial.length === 0 ? (
            <p>Belum ada testimoni.</p>
          ) : (
            testimonial.map((item) => (
              <div className="testimoni-card" key={item.id}>
                <img
                  src={`http://localhost:3000${item.foto}`}
                  alt={item.nama}
                />

                <h4>{item.nama}</h4>

                <p>{item.asal_sekolah}</p>

                <p>{item.universitas}</p>

                <p className="pesan">"{item.pesan}"</p>

                <p className="signature">{item.signature}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ================= FAQ ================= */}

      <section id="faq" className="faq">
        <h2>Pertanyaan Yang Sering Diajukan</h2>

        <div className="faq-container">
          {faq.map((item) => (
            <div className="faq-item" key={item.id}>
              <div
                className="faq-question"
                onClick={() =>
                  setActiveFAQ(activeFAQ === item.id ? null : item.id)
                }
              >
                <h3>{item.question}</h3>

                <span>{activeFAQ === item.id ? "-" : "+"}</span>
              </div>

              {activeFAQ === item.id && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= GALERI ================= */}

      <section id="galeri" className="galeri">
        <h2>Galeri Kegiatan</h2>

        <div className="galeri-grid">
          {galeri.length === 0 ? (
            <p>Belum ada foto.</p>
          ) : (
            galeri.map((item) => (
              <div className="galeri-card" key={item.id}>
                <img
                  src={`http://localhost:3000${item.gambar}`}
                  alt={item.judul}
                />

                <div className="galeri-info">
                  <h4>{item.judul}</h4>

                  <p>{item.deskripsi}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ================= KONTAK ================= */}

      <footer id="kontak" className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h2>{kontak.nama_bimbel}</h2>

            <p>{kontak.alamat}</p>

            <p>📞 {kontak.telepon}</p>

            <p>📱 {kontak.whatsapp}</p>

            <p>✉ {kontak.email}</p>
          </div>

          <div className="footer-right">
            <h3>Media Sosial</h3>

            <p>
              <a href={kontak.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </p>

            <p>
              <a href={kontak.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </p>

            <p>
              <a href={kontak.youtube} target="_blank" rel="noreferrer">
                Youtube
              </a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} {kontak.nama_bimbel}
        </div>
      </footer>
    </div>
  );
}
