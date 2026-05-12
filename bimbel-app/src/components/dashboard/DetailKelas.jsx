import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetailKelas.css";

export default function DetailKelas() {
  const { id } = useParams();

  const [kelas, setKelas] = useState({});
  const [siswaKelas, setSiswaKelas] = useState([]);

  const [search, setSearch] = useState("");
  const [hasilCari, setHasilCari] = useState([]);

  // ============================
  // FETCH DATA KELAS
  // ============================
  const fetchKelas = async () => {
    const res = await fetch(`http://localhost:3000/kelas/${id}`);
    const data = await res.json();

    if (data.length > 0) {
      setKelas(data[0]);
    }
  };

  // ============================
  // FETCH SISWA DALAM KELAS
  // ============================
  const fetchSiswaKelas = async (kelasId) => {
    const res = await fetch(`http://localhost:3000/siswa/kelas/${kelasId}`);
    const data = await res.json();

    setSiswaKelas(data);
  };

  useEffect(() => {
    fetchKelas();
  }, [id]);

  useEffect(() => {
    if (kelas.id) {
      fetchSiswaKelas(kelas.id);
    }
  }, [kelas]);

  // ============================
  // SEARCH SISWA
  // ============================
  const cariSiswa = async (value) => {
    setSearch(value);

    if (value.length < 2) {
      setHasilCari([]);
      return;
    }

    const res = await fetch(`http://localhost:3000/siswa/search/${value}`);
    const data = await res.json();

    setHasilCari(data);
  };

  // ============================
  // TAMBAH SISWA KE KELAS
  // ============================
  const pilihSiswa = async (idSiswa) => {
    console.log("klik siswa:", idSiswa, "kelas:", kelas.id);

    await fetch(`http://localhost:3000/siswa/masuk-kelas/${idSiswa}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kelas_bimbel_id: kelas.id,
      }),
    });

    fetchSiswaKelas(kelas.id);
  };

  // ============================
  // KELUARKAN SISWA
  // ============================
  const hapusSiswa = async (idSiswa) => {
    await fetch(`http://localhost:3000/siswa/masuk-kelas/${idSiswa}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kelas_bimbel_id: null, // 🔥 FIX
      }),
    });

    fetchSiswaKelas(kelas.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Detail Kelas</h1>

      <h3>Kelas : {kelas?.nama_kelas}</h3>
      <p>Program : {kelas?.program}</p>

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
              {s.nama}
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
          {siswaKelas.map((s) => (
            <tr key={s.id}>
              <td>{s.nama}</td>
              <td>{s.asal_sekolah}</td>
              <td>{s.no_hp}</td>
              <td>
                <button onClick={() => hapusSiswa(s.id)}>Keluarkan</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
