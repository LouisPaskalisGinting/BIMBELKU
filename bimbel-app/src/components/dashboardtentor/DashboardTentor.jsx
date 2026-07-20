import { useEffect, useState } from "react";
import JadwalTentor from "./JadwalTentor";
import AbsensiTentor from "./AbsensiTentor";
import "./DashboardTentor.css";

export default function DashboardTentor() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userLogin = JSON.parse(localStorage.getItem("user"));

    if (!userLogin) {
      window.location.href = "/login";
      return;
    }

    setUser(userLogin);
    fetchJadwalTentor(userLogin.id);
  }, []);

  const fetchJadwalTentor = async (tentorId) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/jadwal/tentor/${tentorId}`
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil jadwal tentor");
      }

      const data = await res.json();

      const jadwalData = Array.isArray(data) ? data : [];

      jadwalData.sort((a, b) => b.id - a.id);

      setJadwal(jadwalData);
    } catch (error) {
      console.error("ERROR FETCH JADWAL TENTOR:", error);
      setJadwal([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const hariIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
  });

  const jadwalHariIni = jadwal.filter(
    (j) => (j.hari || "").toLowerCase() === hariIni.toLowerCase()
  );

  const totalKelas = new Set(
    jadwal.map((j) => j.kelas || j.nama_kelas).filter(Boolean)
  ).size;

  const totalMapel = new Set(
    jadwal.map((j) => j.mata_pelajaran || j.mapel).filter(Boolean)
  ).size;

  const tampilJam = (j) => {
    if (j.jam) return j.jam;

    if (j.jam_mulai && j.jam_selesai) {
      return `${j.jam_mulai} - ${j.jam_selesai}`;
    }

    return "-";
  };

  const renderContent = () => {
    if (activeMenu === "jadwal") {
      return <JadwalTentor />;
    }

    if (activeMenu === "absensi") {
      return <AbsensiTentor />;
    }

    return (
      <div className="dashboard-content">
        <div className="welcome-card">
          <div>
            <h1>Dashboard Tentor</h1>
            <p>
              Selamat datang,{" "}
              <strong>{user?.nama || user?.name || "Tentor"}</strong>
            </p>
          </div>

          <div className="date-box">
            <span>{hariIni}</span>
            <strong>{new Date().toLocaleDateString("id-ID")}</strong>
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <span>Total Jadwal</span>
            <h2>{jadwal.length}</h2>
            <p>Seluruh jadwal mengajar</p>
          </div>

          <div className="summary-card">
            <span>Jadwal Hari Ini</span>
            <h2>{jadwalHariIni.length}</h2>
            <p>Jadwal mengajar hari ini</p>
          </div>

          <div className="summary-card">
            <span>Total Kelas</span>
            <h2>{totalKelas}</h2>
            <p>Kelas yang diajar</p>
          </div>

          <div className="summary-card">
            <span>Total Mapel</span>
            <h2>{totalMapel}</h2>
            <p>Mata pelajaran aktif</p>
          </div>
        </div>

        <div className="dashboard-table-card">
          <div className="table-header">
            <div>
              <h2>Jadwal Hari Ini</h2>
              <p>Daftar jadwal mengajar tentor pada hari ini.</p>
            </div>

            <button
              className="btn-lihat"
              onClick={() => setActiveMenu("jadwal")}
            >
              Lihat Semua
            </button>
          </div>

          {loading ? (
            <p className="empty-text">Memuat jadwal...</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Hari</th>
                  <th>Mata Pelajaran</th>
                  <th>Kelas</th>
                  <th>Waktu</th>
                </tr>
              </thead>

              <tbody>
                {jadwalHariIni.length > 0 ? (
                  jadwalHariIni.map((j, index) => (
                    <tr key={j.id}>
                      <td>{index + 1}</td>
                      <td>{j.hari || "-"}</td>
                      <td>{j.mata_pelajaran || j.mapel || "-"}</td>
                      <td>{j.kelas || j.nama_kelas || "-"}</td>
                      <td>{tampilJam(j)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table">
                      Tidak ada jadwal mengajar hari ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="tentor-layout">
      <aside className="tentor-sidebar">
        <div className="sidebar-logo">
          <h2>BimbelKu</h2>
          <p>Panel Tentor</p>
        </div>

        <div className="sidebar-user">
          <div className="avatar">
            {(user?.nama || user?.name || "T").charAt(0).toUpperCase()}
          </div>

          <div>
            <h4>{user?.nama || user?.name || "Tentor"}</h4>
            <span>{user?.email || "tentor"}</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button
            className={activeMenu === "dashboard" ? "active" : ""}
            onClick={() => setActiveMenu("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activeMenu === "jadwal" ? "active" : ""}
            onClick={() => setActiveMenu("jadwal")}
          >
            Jadwal Mengajar
          </button>

          <button
            className={activeMenu === "absensi" ? "active" : ""}
            onClick={() => setActiveMenu("absensi")}
          >
            Absensi Siswa
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="tentor-main">
        <div className="topbar">
          <div>
            <h3>
              {activeMenu === "dashboard" && "Dashboard"}
              {activeMenu === "jadwal" && "Jadwal Mengajar"}
              {activeMenu === "absensi" && "Absensi Siswa"}
            </h3>
            <p>Sistem Informasi Bimbingan Belajar</p>
          </div>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}
