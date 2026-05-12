import { useEffect, useState } from "react";
import "./DataDiri.css";

export default function DataDiri() {
  const siswa = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (siswa?.id) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/siswa/${siswa.id}`);
      const result = await res.json();

      setData(result);
    } catch (err) {
      console.error("ERROR FETCH:", err);
    } finally {
      setLoading(false); // ✅ WAJIB ADA
    }
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        nama: data.nama,
        email: data.email,
        asal_sekolah: data.asal_sekolah,
        no_hp: data.no_hp,
        nama_orangtua: data.nama_orangtua,
        no_hp_orangtua: data.no_hp_orangtua,
      };

      console.log("DIKIRIM:", payload); // 🔥 debug

      await fetch(`http://localhost:3000/siswa/${siswa.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      alert("Data berhasil diupdate ✅");
      setEdit(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading data...</div>;

  return (
    <div className="datadiri-container">
      <h2>👤 Data Diri</h2>

      <div className="datadiri-card">
        <label>Nama</label>
        <input
          name="nama"
          value={data.nama || ""}
          disabled={!edit}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          name="email"
          value={data.email || ""}
          disabled={!edit}
          onChange={handleChange}
        />

        <label>Kelas</label>
        <input value={data.kelas || "-"} disabled />

        <label>Asal Sekolah</label>
        <input
          name="asal_sekolah"
          value={data.asal_sekolah || ""}
          disabled={!edit}
          onChange={handleChange}
        />

        <label>No HP</label>
        <input
          name="no_hp"
          value={data.no_hp || ""}
          disabled={!edit}
          onChange={handleChange}
        />

        <label>Nama Orang Tua</label>
        <input
          name="nama_orangtua"
          value={data.nama_orangtua || ""}
          disabled={!edit}
          onChange={handleChange}
        />

        <label>No HP Orang Tua</label>
        <input
          name="no_hp_orangtua"
          value={data.no_hp_orangtua || ""}
          disabled={!edit}
          onChange={handleChange}
        />

        <label>Program</label>
        <input value={data.nama_program || "-"} disabled />

        {/* BUTTON */}
        <div className="button-group">
          {!edit ? (
            <button className="edit-btn" onClick={() => setEdit(true)}>
              ✏️ Edit
            </button>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave}>
                💾 Simpan
              </button>
              <button className="cancel-btn" onClick={() => setEdit(false)}>
                ❌ Batal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
