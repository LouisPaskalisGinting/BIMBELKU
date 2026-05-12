import { useEffect, useState } from "react";
import "./DataTentor.css";

export default function DataTentor() {
  const [tentor, setTentor] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    nama: "",
    mapel: "",
    status: "Aktif",
    no_hp: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("http://localhost:3000/tentor");
    const data = await res.json();
    setTentor(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus tentor?")) return;

    await fetch(`http://localhost:3000/tentor/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  const handleEdit = (t) => {
    setForm({
      nama: t.nama,
      mapel: t.mapel,
      status: t.status,
      no_hp: t.no_hp,
      email: t.email,
      password: "", // password tidak ditampilkan
    });

    setEditId(t.id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.mapel || !form.no_hp || !form.email) {
      alert("Semua data wajib diisi!");
      return;
    }

    if (!editId && !form.password) {
      alert("Password wajib diisi!");
      return;
    }

    try {
      if (editId) {
        await fetch(`http://localhost:3000/tentor/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("http://localhost:3000/tentor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      fetchData();

      setForm({
        nama: "",
        mapel: "",
        status: "Aktif",
        no_hp: "",
        email: "",
        password: "",
      });

      setEditId(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Terjadi error");
    }
  };

  const filtered = tentor.filter((t) =>
    t.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tentor-page">
      <h1>Data Tentor</h1>

      <div className="tentor-toolbar">
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn-add"
          onClick={() => {
            setForm({
              nama: "",
              mapel: "",
              status: "Aktif",
              no_hp: "",
              email: "",
              password: "",
            });
            setEditId(null);
            setShowModal(true);
          }}
        >
          Tambah Tentor
        </button>
      </div>

      <table>
        <tbody>
          {filtered.map((t) => (
            <tr key={t.id}>
              <td>{t.nama}</td>
              <td>{t.mapel}</td>
              <td>{t.no_hp}</td>
              <td>{t.email}</td>
              <td>{t.status}</td>
              <td>
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div>
          <h2>{editId ? "Edit Tentor" : "Tambah Tentor"}</h2>

          <input name="nama" placeholder="Nama" onChange={handleChange} />
          <input name="mapel" placeholder="Mapel" onChange={handleChange} />
          <input name="no_hp" placeholder="No HP" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />

          {!editId && (
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
          )}

          <button onClick={handleSubmit}>Simpan</button>
          <button onClick={() => setShowModal(false)}>Batal</button>
        </div>
      )}
    </div>
  );
}
