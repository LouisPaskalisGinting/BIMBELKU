import { useEffect, useState } from "react";
import "./DashboardSiswa.css";

export default function DashboardSiswa() {
  const [loading, setLoading] = useState(true);

  const siswa = JSON.parse(localStorage.getItem("user"));

  // ===============================
  // PROTEKSI LOGIN
  // ===============================
  useEffect(() => {
    if (!siswa) {
      window.location.href = "/";
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="content">
      {/* HEADER */}
      <div className="header">
        <h2>Halo, {siswa.nama} 👋</h2>
        <p>Selamat datang di sistem bimbingan belajar</p>
      </div>

      {/* DASHBOARD CARD */}
      <div className="dashboard-grid">
        <div className="card">
          <h3>📘 Program</h3>
          <p>{siswa.nama_program || "-"}</p>
        </div>

        <div className="card">
          <h3>🏫 Kelas</h3>
          <p>{siswa.kelas || "-"}</p>
        </div>

        <div className="card">
          <h3>📧 Email</h3>
          <p>{siswa.email}</p>
        </div>

        <div className="card">
          <h3>📊 Status</h3>
          <p className="status-active">Aktif</p>
        </div>
      </div>

      {/* INFO TAMBAHAN */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>📢 Informasi</h3>
        <p>
          Selamat datang di dashboard siswa. Silakan cek data diri, nilai, dan
          jadwal melalui menu yang tersedia.
        </p>
      </div>
    </div>
  );
}
