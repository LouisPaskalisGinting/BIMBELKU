import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Kelas.css";

export default function Kelas() {
  const [kelas, setKelas] = useState([]);
  const [programList, setProgramList] = useState([]);

  const [form, setForm] = useState({
    nama_kelas: "",
    program_id: "",
  });

  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchProgram();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/kelas");
      const data = await res.json();
      setKelas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data kelas:", err);
      setKelas([]);
    }
  };

  const fetchProgram = async () => {
    try {
      const res = await fetch("http://localhost:3000/program");
      const data = await res.json();
      setProgramList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data program:", err);
      setProgramList([]);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.nama_kelas || !form.program_id) {
      alert("Nama kelas dan program wajib diisi");
      return;
    }

    const payload = {
      nama_kelas: form.nama_kelas,
      program_id: form.program_id,
    };

    try {
      if (editId) {
        await fetch(`http://localhost:3000/kelas/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:3000/kelas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      setForm({
        nama_kelas: "",
        program_id: "",
      });

      setEditId(null);
      fetchData();
    } catch (err) {
      console.error("Gagal menyimpan kelas:", err);
    }
  };

  const handleEdit = (k) => {
    setForm({
      nama_kelas: k.nama_kelas || "",
      program_id: k.program_id || "",
    });

    setEditId(k.id);
  };

  const handleDelete = async (id) => {
    const yakin = window.confirm("Yakin ingin menghapus kelas ini?");

    if (!yakin) return;

    try {
      await fetch(`http://localhost:3000/kelas/${id}`, {
        method: "DELETE",
      });

      fetchData();
    } catch (err) {
      console.error("Gagal menghapus kelas:", err);
    }
  };

  const handleDetail = (id) => {
    navigate(`/kelas/${id}`);
  };

  return (
    <div className="kelas-container">
      <h1>Data Kelas</h1>

      <div className="kelas-form">
        <input
          name="nama_kelas"
          placeholder="Nama Kelas"
          value={form.nama_kelas}
          onChange={handleChange}
        />

        <select
          name="program_id"
          value={form.program_id}
          onChange={handleChange}
        >
          <option value="">Pilih Program</option>

          {programList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama_program}
            </option>
          ))}
        </select>

        <button onClick={handleSubmit}>{editId ? "Update" : "Tambah"}</button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({
                nama_kelas: "",
                program_id: "",
              });
            }}
          >
            Batal
          </button>
        )}
      </div>

      <table className="kelas-table">
        <thead>
          <tr>
            <th>Nama Kelas</th>
            <th>Program</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {kelas.length === 0 ? (
            <tr>
              <td colSpan="3">Belum ada data kelas</td>
            </tr>
          ) : (
            kelas.map((k) => (
              <tr key={k.id}>
                <td>{k.nama_kelas}</td>
                <td>{k.nama_program || "-"}</td>
                <td>
                  <button onClick={() => handleDetail(k.id)}>Detail</button>
                  <button onClick={() => handleEdit(k)}>Edit</button>
                  <button onClick={() => handleDelete(k.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
