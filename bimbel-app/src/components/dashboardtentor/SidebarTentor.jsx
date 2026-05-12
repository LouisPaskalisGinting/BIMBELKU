export default function SidebarTentor({ setMenu }) {
  return (
    <div className="sidebar">
      <h2>Menu Tentor</h2>

      <button onClick={() => setMenu("jadwal")}>📅 Jadwal</button>

      <button onClick={() => setMenu("absensi")}>✅ Absensi</button>
    </div>
  );
}
