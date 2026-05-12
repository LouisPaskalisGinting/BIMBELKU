import { useEffect, useState } from "react";

export default function JadwalSiswa() {
  const [jadwal, setJadwal] = useState([]);

  // ambil data siswa dari localStorage
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
    <div style={{ padding: "20px" }}>
      <h2>Jadwal Saya</h2>

      <table border="1" cellPadding="10" width="100%">
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
                <td>{j.mata_pelajaran}</td>
                <td>{j.tentor}</td>
                <td>{j.hari}</td>
                <td>{j.jam}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Belum ada jadwal
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
