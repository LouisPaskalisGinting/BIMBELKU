import { useEffect, useState } from "react";
import FormAbsensi from "./FormAbsensi";
import "./Absensi.css";

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
    try {
      const res = await fetch("http://localhost:3000/jadwal");

      if (!res.ok) {
        throw new Error("Gagal mengambil data jadwal");
      }

      let data = await res.json();
      data = Array.isArray(data) ? data : [];

      data.sort((a, b) => b.id - a.id);

      console.log("DATA JADWAL:", data);

      setJadwal(data);
      setFilteredJadwal(data);
    } catch (err) {
      console.error("ERROR FETCH JADWAL:", err);
      alert("Gagal mengambil data jadwal. Pastikan backend berjalan.");
      setJadwal([]);
      setFilteredJadwal([]);
    }
  };

  useEffect(() => {
    let result = jadwal;

    if (filterKelas) {
      result = result.filter((j) =>
        (j.kelas || j.nama_kelas || "")
          .toLowerCase()
          .includes(filterKelas.toLowerCase())
      );
    }

    if (filterMapel) {
      result = result.filter((j) =>
        (j.mata_pelajaran || "")
          .toLowerCase()
          .includes(filterMapel.toLowerCase())
      );
    }

    if (filterHari) {
      result = result.filter((j) =>
        (j.hari || "").toLowerCase().includes(filterHari.toLowerCase())
      );
    }

    setFilteredJadwal(result);
  }, [filterKelas, filterMapel, filterHari, jadwal]);

  const pilihJadwal = (j) => {
    if (!j.kelas_id) {
      alert(
        "Jadwal ini belum memiliki kelas_id. Silakan cek data jadwal di database."
      );
      return;
    }

    setSelectedJadwal(j);
  };

  return (
    <div className="absensi-page">
      {!selectedJadwal ? (
        <>
          <h1>Data Jadwal</h1>

          <div className="filter-card">
            <h2>Filter Jadwal</h2>

            <div className="filter-wrapper">
              <input
                type="text"
                placeholder="Filter Kelas"
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
              />

              <input
                type="text"
                placeholder="Filter Mapel"
                value={filterMapel}
                onChange={(e) => setFilterMapel(e.target.value)}
              />

              <input
                type="text"
                placeholder="Filter Hari"
                value={filterHari}
                onChange={(e) => setFilterHari(e.target.value)}
              />
            </div>
          </div>

          <div className="absensi-table-card">
            <table className="absensi-table">
              <thead>
                <tr>
                  <th>Kelas</th>
                  <th>Mapel</th>
                  <th>Hari</th>
                  <th>Jam</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredJadwal.length > 0 ? (
                  filteredJadwal.map((j) => (
                    <tr key={j.id}>
                      <td>{j.kelas || j.nama_kelas || "-"}</td>
                      <td>{j.mata_pelajaran || "-"}</td>
                      <td>{j.hari || "-"}</td>
                      <td>{j.jam || "-"}</td>
                      <td>
                        <button
                          className="btn-absensi"
                          onClick={() => pilihJadwal(j)}
                        >
                          Isi Absensi
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-data">
                      Tidak ada data jadwal
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="form-absensi-wrapper">
          <FormAbsensi
            jadwal={selectedJadwal}
            onBack={() => setSelectedJadwal(null)}
          />
        </div>
      )}
    </div>
  );
}
