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

  // ============================
  // FETCH DETAIL KELAS
  // ============================
  const fetchKelas = async () => {
    try {
      const res = await fetch(`http://localhost:3000/kelas/${id}`);
      const data = await res.json();

      console.log("DETAIL KELAS:", data);

      // jika backend mengirim array
      if (Array.isArray(data)) {
        setKelas(data[0] || {});
      } else {
        // jika backend mengirim object
        setKelas(data || {});
      }
    } catch (err) {
      console.error("ERROR FETCH KELAS:", err);
    }
  };

  // ============================
  // FETCH SISWA DALAM KELAS
  // ============================
  const fetchSiswaKelas = async () => {
    try {
      const res = await fetch(`http://localhost:3000/siswa/kelas-bimbel/${id}`);
      const data = await res.json();

      console.log("SISWA KELAS:", data);

      setSiswaKelas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ERROR FETCH SISWA KELAS:", err);
      setSiswaKelas([]);
    }
  };

  // ============================
  // SEARCH SISWA
  // ============================
  const cariSiswa = async (value) => {
    setSearch(value);

    if (value.length < 2) {
      setHasilCari([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/siswa/search/${value}`);
      const data = await res.json();

      console.log("HASIL CARI:", data);

      setHasilCari(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ERROR SEARCH SISWA:", err);
      setHasilCari([]);
    }
  };

  // ============================
  // TAMBAH SISWA KE KELAS
  // ============================
  const pilihSiswa = async (idSiswa) => {
    try {
      console.log("SISWA DIPILIH:", idSiswa);
      console.log("KELAS ID:", id);

      const res = await fetch(
        `http://localhost:3000/siswa/masuk-kelas/${idSiswa}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kelas_bimbel_id: id,
          }),
        }
      );

      const result = await res.json();

      console.log("HASIL TAMBAH:", result);

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

  // ============================
  // KELUARKAN SISWA DARI KELAS
  // ============================
  const hapusSiswa = async (idSiswa) => {
    try {
      const res = await fetch(
        `http://localhost:3000/siswa/masuk-kelas/${idSiswa}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kelas_bimbel_id: null,
          }),
        }
      );

      const result = await res.json();

      console.log("HASIL HAPUS:", result);

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

      <div className="detail-kelas-card">
        <h3>Kelas: {kelas?.nama_kelas || "-"}</h3>
        <p>Program: {kelas?.program || "-"}</p>
      </div>

      <hr />

      <h2>Tambah Siswa</h2>

      <input
        type="text"
        placeholder="Ketik nama siswa..."
        value={search}
        onChange={(e) => cariSiswa(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
        }}
      />

      {hasilCari.length > 0 && (
        <div
          style={{
            border: "1px solid #ccc",
            width: "300px",
            background: "white",
            marginTop: "5px",
          }}
        >
          {hasilCari.map((s) => (
            <div
              key={s.id}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => pilihSiswa(s.id)}
            >
              {s.nama} - {s.nama_program || "-"}
            </div>
          ))}
        </div>
      )}

      <hr />

      <h2>Daftar Siswa</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Sekolah</th>
            <th>No HP</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {siswaKelas.length > 0 ? (
            siswaKelas.map((s) => (
              <tr key={s.id}>
                <td>{s.nama}</td>
                <td>{s.asal_sekolah}</td>
                <td>{s.no_hp}</td>
                <td>
                  <button onClick={() => hapusSiswa(s.id)}>Keluarkan</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Belum ada siswa di kelas ini</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
