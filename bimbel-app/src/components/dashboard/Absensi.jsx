import { useEffect, useState } from "react";
import FormAbsensi from "./FormAbsensi";

export default function Absensi() {
  const [jadwal, setJadwal] = useState([]);
  const [filteredJadwal, setFilteredJadwal] = useState([]);
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  const [filterKelas, setFilterKelas] = useState("");
  const [filterMapel, setFilterMapel] = useState("");
  const [filterHari, setFilterHari] = useState("");

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    const res = await fetch("http://localhost:3000/jadwal");
    let data = await res.json();

    // 🔥 SORT TERBARU DI ATAS
    data.sort((a, b) => b.id - a.id);

    setJadwal(data);
    setFilteredJadwal(data);
  };

  // ===============================
  // FILTER
  // ===============================
  useEffect(() => {
    let result = jadwal;

    if (filterKelas) {
      result = result.filter((j) =>
        j.kelas.toLowerCase().includes(filterKelas.toLowerCase())
      );
    }

    if (filterMapel) {
      result = result.filter((j) =>
        j.mata_pelajaran.toLowerCase().includes(filterMapel.toLowerCase())
      );
    }

    if (filterHari) {
      result = result.filter((j) =>
        j.hari.toLowerCase().includes(filterHari.toLowerCase())
      );
    }

    setFilteredJadwal(result);
  }, [filterKelas, filterMapel, filterHari, jadwal]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Data Jadwal</h2>

      {!selectedJadwal ? (
        <>
          {/* 🔍 FILTER */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Filter Kelas"
              onChange={(e) => setFilterKelas(e.target.value)}
            />

            <input
              type="text"
              placeholder="Filter Mapel"
              onChange={(e) => setFilterMapel(e.target.value)}
              style={{ marginLeft: "10px" }}
            />

            <input
              type="text"
              placeholder="Filter Hari"
              onChange={(e) => setFilterHari(e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          </div>

          {/* 📊 TABLE */}
          <table border="1" cellPadding="10" width="100%">
            <thead>
              <tr>
                <th>Kelas</th>
                <th>Mapel</th>
                <th>Hari</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredJadwal.length > 0 ? (
                filteredJadwal.map((j) => (
                  <tr key={j.id}>
                    <td>{j.kelas}</td>
                    <td>{j.mata_pelajaran}</td>
                    <td>{j.hari}</td>
                    <td>
                      <button onClick={() => setSelectedJadwal(j)}>
                        Isi Absensi
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" align="center">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <FormAbsensi
          jadwal={selectedJadwal}
          onBack={() => setSelectedJadwal(null)}
        />
      )}
    </div>
  );
}
