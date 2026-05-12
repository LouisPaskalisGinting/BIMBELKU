import { useEffect, useState } from "react";
import SidebarTentor from "./SidebarTentor";
import JadwalTentor from "./JadwalTentor";
import AbsensiTentor from "./AbsensiTentor";
import "./DashboardTentor.css";

export default function DashboardTentor() {
  const [menu, setMenu] = useState("dashboard");
  const [jadwal, setJadwal] = useState([]);

  useEffect(() => {
    fetchAllJadwal();
  }, []);

  const fetchAllJadwal = async () => {
    try {
      const res = await fetch("http://localhost:3000/jadwal");
      const data = await res.json();
      setJadwal(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard">
      <SidebarTentor setMenu={setMenu} />

      <div className="content">
        {menu === "dashboard" && (
          <div>
            <h2>Dashboard</h2>

            <table className="jadwal-table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Mata Pelajaran</th>
                  <th>Kelas</th>
                  <th>Waktu</th>
                </tr>
              </thead>

              <tbody>
                {jadwal.map((j) => (
                  <tr key={j.id}>
                    <td>{j.hari}</td>
                    <td>{j.mata_pelajaran}</td>
                    <td>{j.kelas}</td>
                    <td>{j.jam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {menu === "jadwal" && <JadwalTentor />}
        {menu === "absensi" && <AbsensiTentor />}
      </div>
    </div>
  );
}
