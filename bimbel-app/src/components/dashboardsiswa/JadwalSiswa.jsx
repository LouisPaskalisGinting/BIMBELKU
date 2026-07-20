import { useEffect, useState } from "react";
import "./JadwalSiswa.css";

export default function JadwalSiswa() {
  const [jadwal, setJadwal] = useState([]);

  const siswa = JSON.parse(localStorage.getItem("siswa"));
  const siswaId = siswa?.id;

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/jadwal/siswa/${siswaId}`
        );
        const data = await res.json();
        setJadwal(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
      }
    };

    if (siswaId) {
      fetchJadwal();
    }
  }, [siswaId]);

  return (
    <div className="jadwal-siswa-container">
      <div className="jadwal-siswa-card">
        <h2 className="jadwal-siswa-title">📅 Jadwal Saya</h2>

        <div className="jadwal-table-wrapper">
          <table className="jadwal-table">
            <thead>
              <tr>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>Tentor</th>
                <th>Hari</th>
                <th>Jam</th>
              </tr>
            </thead>

            <tbody>
              {jadwal.length > 0 ? (
                jadwal.map((j) => (
                  <tr key={j.id}>
                    <td>{j.nama_kelas}</td>
                    <td className="jadwal-mapel">{j.mata_pelajaran}</td>
                    <td>{j.tentor}</td>
                    <td>
                      <span className="jadwal-hari">{j.hari}</span>
                    </td>
                    <td className="jadwal-jam">{j.jam}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="jadwal-empty">
                    Belum ada jadwal
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
