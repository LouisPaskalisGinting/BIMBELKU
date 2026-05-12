import { useEffect, useState } from "react";

export default function AbsensiSiswa() {
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);

  const siswa = JSON.parse(localStorage.getItem("siswa")) || {};
  const siswaId = siswa.id;

  console.log("DATA SISWA:", siswa);
  console.log("SISWA ID:", siswaId);
  useEffect(() => {
    const fetchAbsensi = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/absensi/siswa/${siswaId}`
        );
        const data = await res.json();
        setAbsensi(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (siswaId) fetchAbsensi();
  }, [siswaId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Absensi Saya</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Mapel</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {absensi.length > 0 ? (
              absensi.map((a) => (
                <tr key={a.id}>
                  <td>{a.tanggal}</td>
                  <td>{a.mata_pelajaran}</td>
                  <td>{a.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" align="center">
                  Belum ada absensi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
