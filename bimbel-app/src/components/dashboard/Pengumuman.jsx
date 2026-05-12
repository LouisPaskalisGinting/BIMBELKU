import { useEffect, useState } from "react";
import "./Pengumuman.css";

export default function Pengumuman() {
  const [pengumuman, setPengumuman] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    judul: "",
    isi: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/pengumuman");
      const data = await res.json();
      setPengumuman(data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ judul: "", isi: "" });
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.judul || !form.isi) {
      alert("Judul dan isi wajib diisi");
      return;
    }

    try {
      const url = editId
        ? `http://localhost:3000/pengumuman/${editId}`
        : "http://localhost:3000/pengumuman";

      const method = editId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      resetForm();
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  const handleEdit = (p) => {
    setForm({
      judul: p.judul,
      isi: p.isi,
    });
    setEditId(p.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pengumuman?")) return;

    try {
      await fetch(`http://localhost:3000/pengumuman/${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };

  return (
    <div className="pengumuman-page">
      <h1>Pengumuman</h1>

      <button
        className="btn-add"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        + Tambah Pengumuman
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="pengumuman-list">
          {pengumuman.map((p) => (
            <div className="pengumuman-card" key={p.id}>
              <h3>{p.judul}</h3>
              <p>{p.isi}</p>
              <small>{new Date(p.tanggal).toLocaleDateString()}</small>

              <div className="aksi">
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-bg">
          <div className="modal">
            <h2>{editId ? "Edit Pengumuman" : "Tambah Pengumuman"}</h2>

            <input
              name="judul"
              placeholder="Judul"
              value={form.judul}
              onChange={handleChange}
            />

            <textarea
              name="isi"
              placeholder="Isi pengumuman"
              value={form.isi}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button onClick={handleSubmit}>
                {editId ? "Update" : "Simpan"}
              </button>
              <button onClick={() => setShowModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
