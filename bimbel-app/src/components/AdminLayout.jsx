import { useNavigate, Outlet } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">BIMBELKU TIGABINANGA</div>

        <ul>
          <li onClick={() => navigate("/dashboard-admin")}>Dashboard</li>
          <li onClick={() => navigate("/data-siswa")}>Data Siswa</li>
          <li onClick={() => navigate("/data-tentor")}>Data Tentor</li>
          <li onClick={() => navigate("/kelas")}>Kelas</li>
          <li onClick={() => navigate("/pembayaran")}>Pembayaran</li>
          <li onClick={() => navigate("/absensi")}>Absensi</li>
          <li onClick={() => navigate("/nilai")}>Nilai</li>
          <li onClick={() => navigate("/jadwal")}>Jadwal</li>
          <li onClick={() => navigate("/pengumuman")}>Pengumuman</li>
          <li onClick={() => navigate("/login")}>Log Out</li>
        </ul>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
