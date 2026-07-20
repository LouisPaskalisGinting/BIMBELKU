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
    try {
      const res = await fetch("http://localhost:3000/tentor");
      const data = await res.json();

      setTentor(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data tentor:", err);
      setTentor([]);
    }
  };

  const resetForm = () => {
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus tentor?")) return;

    try {
      await fetch(`http://localhost:3000/tentor/${id}`, {
        method: "DELETE",
      });

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus tentor");
    }
  };

  const handleEdit = (t) => {
    setForm({
      nama: t.nama || "",
      mapel: t.mapel || "",
      status: t.status || "Aktif",
      no_hp: t.no_hp || "",
      email: t.email || "",
      password: "",
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
      const payload = { ...form };

      if (editId && !payload.password) {
        delete payload.password;
      }

      if (editId) {
        await fetch(`http://localhost:3000/tentor/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:3000/tentor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      fetchData();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Terjadi error");
    }
  };

  const filtered = tentor.filter((t) =>
    t.nama?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tentor-page">
      <h1>Data Tentor</h1>

      <div className="tentor-toolbar">
        <input
          placeholder="Cari nama tentor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn-add"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Tambah Tentor
        </button>
      </div>

      <div className="tentor-table-card">
        <table className="tentor-table">
          <colgroup>
            <col className="col-nama" />
            <col className="col-mapel" />
            <col className="col-nohp" />
            <col className="col-email" />
            <col className="col-status" />
            <col className="col-aksi" />
          </colgroup>

          <thead>
            <tr>
              <th>Nama</th>
              <th>Mapel</th>
              <th>No HP</th>
              <th>Email</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((t) => (
                <tr key={t.id}>
                  <td title={t.nama}>{t.nama}</td>
                  <td title={t.mapel}>{t.mapel}</td>
                  <td title={t.no_hp}>{t.no_hp}</td>
                  <td title={t.email}>{t.email}</td>
                  <td>
                    <span
                      className={
                        t.status === "Aktif"
                          ? "status-badge aktif"
                          : "status-badge nonaktif"
                      }
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <div className="aksi">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(t.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-data">
                  Data tentor tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editId ? "Edit Tentor" : "Tambah Tentor"}</h2>

            <input
              name="nama"
              placeholder="Nama"
              value={form.nama}
              onChange={handleChange}
            />

            <input
              name="mapel"
              placeholder="Mapel"
              value={form.mapel}
              onChange={handleChange}
            />

            <input
              name="no_hp"
              placeholder="No HP"
              value={form.no_hp}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>

            {!editId && (
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            )}

            <div className="modal-buttons">
              <button className="btn-save" onClick={handleSubmit}>
                Simpan
              </button>

              <button className="btn-cancel" onClick={resetForm}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
