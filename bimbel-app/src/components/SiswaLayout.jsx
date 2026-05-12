import { Outlet, useNavigate } from "react-router-dom";

export default function SiswaLayout() {
  const siswa = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3>{siswa.nama}</h3>

        <button onClick={() => navigate("/dashboard-siswa")}>Dashboard</button>
        <button onClick={() => navigate("/siswa/data-diri")}>Data Diri</button>
        <button onClick={() => navigate("/siswa/jadwal")}>Jadwal</button>
        <button onClick={() => navigate("/siswa/nilai")}>Nilai</button>
        <button onClick={() => navigate("/siswa/absensi")}>Absensi</button>
        <button onClick={() => navigate("/siswa/pembayaran")}>
          Pembayaran
        </button>
        <button onClick={() => navigate("/siswa/pengumuman")}>
          Pengumuman
        </button>

        <button onClick={logout} style={{ marginTop: "20px" }}>
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    background: "#2c3e50",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  content: {
    flex: 1,
    padding: "20px",
    background: "#f5f6fa",
  },
};
