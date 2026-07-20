import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetailKelas.css";

export default function DetailKelas() {
  const { id } = useParams();

  const [kelas, setKelas] = useState({});
  const [siswaKelas, setSiswaKelas] = useState([]);
  const [search, setSearch] = useState("");
  const [hasilCari, setHasilCari] = useState([]);

  useEffect(() => {
    fetchKelas();
    fetchSiswaKelas();
  }, [id]);

  const fetchKelas = async () => {
    try {
      const res = await fetch(`http://localhost:3000/kelas/${id}`);
      const data = await res.json();

      setKelas(Array.isArray(data) ? data[0] || {} : data || {});
    } catch (err) {
      console.error("ERROR FETCH KELAS:", err);
    }
  };

  const fetchSiswaKelas = async () => {
    try {
      const res = await fetch(`http://localhost:3000/siswa/kelas/${id}`);
      const data = await res.json();

      console.log("SISWA DALAM KELAS:", data);

      setSiswaKelas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ERROR FETCH SISWA KELAS:", err);
      setSiswaKelas([]);
    }
  };

  const cariSiswa = async (value) => {
    setSearch(value);

    if (value.length < 2) {
      setHasilCari([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/siswa/search/${value}`);
      const data = await res.json();

      setHasilCari(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ERROR SEARCH SISWA:", err);
      setHasilCari([]);
    }
  };

  const pilihSiswa = async (idSiswa) => {
    try {
      const res = await fetch(
        `http://localhost:3000/siswa/masuk-kelas/${idSiswa}/${id}`,
        {
          method: "PUT",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal menambahkan siswa");
        return;
      }

      alert("Siswa berhasil ditambahkan ke kelas");

      setSearch("");
      setHasilCari([]);
      fetchSiswaKelas();
    } catch (err) {
      console.error("ERROR TAMBAH SISWA:", err);
      alert("Terjadi kesalahan saat menambahkan siswa");
    }
  };

  const hapusSiswa = async (idSiswa) => {
    const yakin = window.confirm("Keluarkan siswa dari kelas ini?");
    if (!yakin) return;

    try {
      const res = await fetch(
        `http://localhost:3000/siswa/keluar-kelas/${idSiswa}`,
        {
          method: "PUT",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal mengeluarkan siswa");
        return;
      }

      alert("Siswa berhasil dikeluarkan dari kelas");
      fetchSiswaKelas();
    } catch (err) {
      console.error("ERROR HAPUS SISWA:", err);
      alert("Terjadi kesalahan saat mengeluarkan siswa");
    }
  };

  return (
    <div className="detail-kelas-container">
      <h1>Detail Kelas</h1>

      <div className="kelas-top-row">
        <div className="detail-kelas-card">
          <h3>Kelas: {kelas?.nama_kelas || "-"}</h3>
          <p>Program: {kelas?.nama_program || kelas?.program || "-"}</p>
        </div>

        <div className="tambah-siswa-card">
          <h2>Tambah Siswa</h2>

          <div className="search-box">
            <input
              type="text"
              placeholder="Ketik nama siswa..."
              value={search}
              onChange={(e) => cariSiswa(e.target.value)}
            />

            {hasilCari.length > 0 && (
              <div className="search-result">
                {hasilCari.map((s) => (
                  <div
                    key={s.id}
                    className="search-item"
                    onClick={() => pilihSiswa(s.id)}
                  >
                    <strong>{s.nama}</strong>
                    <span>
                      {s.nama_program || "-"} •{" "}
                      {s.nama_kelas || "Belum ada kelas"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="siswa-table-card">
        <h2>Daftar Siswa</h2>

        <table className="siswa-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Sekolah</th>
              <th>No HP</th>
              <th>Program</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {siswaKelas.length > 0 ? (
              siswaKelas.map((s) => (
                <tr key={s.id}>
                  <td>{s.nama || "-"}</td>
                  <td>{s.asal_sekolah || "-"}</td>
                  <td>{s.no_hp || "-"}</td>
                  <td>{s.nama_program || "-"}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => hapusSiswa(s.id)}
                    >
                      Keluarkan
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-data">
                  Belum ada siswa di kelas ini
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
