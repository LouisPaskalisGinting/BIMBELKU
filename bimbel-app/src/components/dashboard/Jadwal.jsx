import { useEffect, useState } from "react";
import "./Jadwal.css";

export default function Jadwal() {
  const [jadwal, setJadwal] = useState([]);

  const [form, setForm] = useState({
    kelas_bimbel_id: "",
    mata_pelajaran: "",
    tentor: "",
    hari: "",
    jam: "",
  });

  const [kelasList, setKelasList] = useState([]);
  const [tentorList, setTentorList] = useState([]);
  const [editId, setEditId] = useState(null);

  const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const jamList = ["17:00", "19:00", "20:30"];

  useEffect(() => {
    fetchData();
    fetchKelas();
    fetchTentor();
  }, []);

  const fetchData = async () => {
    const res = await fetch("http://localhost:3000/jadwal");
    const data = await res.json();
    setJadwal(Array.isArray(data) ? data : []);
  };

  const fetchKelas = async () => {
    const res = await fetch("http://localhost:3000/kelas");
    const data = await res.json();
    setKelasList(data);
  };

  const fetchTentor = async () => {
    const res = await fetch("http://localhost:3000/tentor");
    const data = await res.json();
    setTentorList(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.kelas_bimbel_id || !form.tentor || !form.hari) {
      alert("Kelas, tentor, dan hari wajib dipilih");
      return;
    }

    if (editId) {
      await fetch(`http://localhost:3000/jadwal/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("http://localhost:3000/jadwal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({
      kelas_bimbel_id: "",
      mata_pelajaran: "",
      tentor: "",
      hari: "",
      jam: "",
    });

    setEditId(null);
    fetchData();
  };

  const handleEdit = (j) => {
    setForm({
      kelas_bimbel_id: j.kelas_bimbel_id,
      mata_pelajaran: j.mata_pelajaran,
      tentor: j.tentor,
      hari: j.hari,
      jam: j.jam,
    });
    setEditId(j.id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/jadwal/${id}`, {
      method: "DELETE",
    });
    fetchData();
  };

  return (
    <div className="jadwal-container">
      <h1>Manajemen Jadwal</h1>

      <div className="jadwal-form">
        {/* KELAS */}
        <select
          name="kelas_bimbel_id"
          value={form.kelas_bimbel_id}
          onChange={handleChange}
        >
          <option value="">Pilih Kelas</option>
          {kelasList.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama_kelas}
            </option>
          ))}
        </select>

        {/* MAPEL */}
        <input
          name="mata_pelajaran"
          placeholder="Mata Pelajaran"
          value={form.mata_pelajaran}
          onChange={handleChange}
        />

        {/* TENTOR */}
        <select name="tentor" value={form.tentor} onChange={handleChange}>
          <option value="">Pilih Tentor</option>
          {tentorList.map((t) => (
            <option key={t.id} value={t.nama}>
              {t.nama}
            </option>
          ))}
        </select>

        {/* HARI */}
        <select name="hari" value={form.hari} onChange={handleChange}>
          <option value="">Pilih Hari</option>
          {hariList.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        {/* JAM */}
        <select name="jam" value={form.jam} onChange={handleChange}>
          <option value="">Pilih Jam</option>
          {jamList.map((j) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>

        <button onClick={handleSubmit}>
          {editId ? "Update Jadwal" : "Tambah Jadwal"}
        </button>
      </div>

      <table className="jadwal-table">
        <thead>
          <tr>
            <th>Kelas</th>
            <th>Mapel</th>
            <th>Tentor</th>
            <th>Hari</th>
            <th>Jam</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {jadwal.map((j) => (
            <tr key={j.id}>
              <td>{j.kelas}</td>
              <td>{j.mata_pelajaran}</td>
              <td>{j.tentor}</td>
              <td>{j.hari}</td>
              <td>{j.jam}</td>
              <td>
                <button onClick={() => handleEdit(j)}>Edit</button>
                <button onClick={() => handleDelete(j.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
