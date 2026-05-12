import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Kelas.css";

export default function Kelas() {
  const [kelas, setKelas] = useState([]);
  const [form, setForm] = useState({
    nama_kelas: "",
    program: "",
  });

  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("http://localhost:3000/kelas");
    const data = await res.json();
    setKelas(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.nama_kelas || !form.program) {
      alert("Nama kelas dan program wajib diisi");
      return;
    }

    if (editId) {
      await fetch(`http://localhost:3000/kelas/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("http://localhost:3000/kelas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ nama_kelas: "", program: "" });
    setEditId(null);
    fetchData();
  };

  const handleEdit = (k) => {
    setForm({
      nama_kelas: k.nama_kelas,
      program: k.program,
    });
    setEditId(k.id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/kelas/${id}`, {
      method: "DELETE",
    });
    fetchData();
  };

  const handleDetail = (id) => {
    navigate(`/kelas/${id}`);
  };

  return (
    <div className="kelas-container">
      <h1>Data Kelas</h1>

      {/* FORM TAMBAH KELAS */}
      <div className="kelas-form">
        <input
          name="nama_kelas"
          placeholder="Nama Kelas"
          value={form.nama_kelas}
          onChange={handleChange}
        />

        <input
          name="program"
          placeholder="Program"
          value={form.program}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>{editId ? "Update" : "Tambah"}</button>
      </div>

      {/* TABLE */}
      <table className="kelas-table">
        <thead>
          <tr>
            <th>Nama Kelas</th>
            <th>Program</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {kelas.map((k) => (
            <tr key={k.id}>
              <td>{k.nama_kelas}</td>
              <td>{k.program}</td>
              <td>
                <button onClick={() => handleDetail(k.id)}>Detail</button>
                <button onClick={() => handleEdit(k)}>Edit</button>
                <button onClick={() => handleDelete(k.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
