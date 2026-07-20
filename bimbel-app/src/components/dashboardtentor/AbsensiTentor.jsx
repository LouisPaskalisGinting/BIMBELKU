import { useEffect, useState } from "react";
import FormAbsensi from "../dashboard/FormAbsensi";
import "../dashboard/Absensi.css";

export default function AbsensiTentor() {
  const [jadwal, setJadwal] = useState([]);
  const [filteredJadwal, setFilteredJadwal] = useState([]);
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  const [filterKelas, setFilterKelas] = useState("");
  const [filterMapel, setFilterMapel] = useState("");
  const [filterHari, setFilterHari] = useState("");

  useEffect(() => {
    fetchJadwalTentor();
  }, []);

  const fetchJadwalTentor = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        alert("Data tentor tidak ditemukan. Silakan login ulang.");
        return;
      }

      const res = await fetch(`http://localhost:3000/jadwal/tentor/${user.id}`);

      if (!res.ok) {
        throw new Error("Gagal mengambil data jadwal tentor");
      }

      let data = await res.json();
      data = Array.isArray(data) ? data : [];

      data.sort((a, b) => b.id - a.id);

      console.log("DATA JADWAL TENTOR:", data);

      setJadwal(data);
      setFilteredJadwal(data);
    } catch (err) {
      console.error("ERROR FETCH JADWAL TENTOR:", err);
      alert("Gagal mengambil data jadwal tentor. Pastikan backend berjalan.");
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
        (j.mata_pelajaran || j.mapel || "")
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
        "Jadwal ini belum memiliki kelas_id. Silakan cek query jadwal tentor di backend."
      );
      return;
    }

    setSelectedJadwal(j);
  };

  const tampilJam = (j) => {
    if (j.jam) return j.jam;

    if (j.jam_mulai && j.jam_selesai) {
      return `${j.jam_mulai} - ${j.jam_selesai}`;
    }

    return "-";
  };

  return (
    <div className="absensi-page">
      {!selectedJadwal ? (
        <>
          <h1>Absensi Tentor</h1>

          <div className="filter-card">
            <h2>Filter Jadwal Mengajar</h2>

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
                      <td>{j.mata_pelajaran || j.mapel || "-"}</td>
                      <td>{j.hari || "-"}</td>
                      <td>{tampilJam(j)}</td>
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
                      Tidak ada jadwal mengajar
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
