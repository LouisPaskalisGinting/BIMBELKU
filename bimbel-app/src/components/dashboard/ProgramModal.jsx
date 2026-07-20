import { useEffect, useState } from "react";

export default function ProgramModal({ onClose, editData }) {
  const [form, setForm] = useState({
    nama_program: "",
    deskripsi: "",
    harga: "",
    durasi: "",
    jumlah_pertemuan: "",
    status: "aktif",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        nama_program: editData.nama_program || "",
        deskripsi: editData.deskripsi || "",
        harga: editData.harga || "",
        durasi: editData.durasi || "",
        jumlah_pertemuan: editData.jumlah_pertemuan || "",
        status: editData.status || "aktif",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.nama_program || !form.harga || !form.durasi) {
      alert("Nama program, harga, dan durasi wajib diisi!");
      return;
    }

    try {
      let res;

      if (editData) {
        res = await fetch(`http://localhost:3000/program/${editData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("http://localhost:3000/program", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      }

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal menyimpan program");
        return;
      }

      alert(
        editData
          ? "Program berhasil diperbarui!"
          : "Program berhasil ditambahkan!"
      );

      onClose();
    } catch (err) {
      console.error("ERROR SIMPAN PROGRAM:", err);
      alert("Terjadi kesalahan saat menyimpan program");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editData ? "Edit Program" : "Tambah Program"}</h2>

        <input
          name="nama_program"
          placeholder="Nama Program"
          value={form.nama_program}
          onChange={handleChange}
        />

        <textarea
          name="deskripsi"
          placeholder="Deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
        />

        <input
          type="number"
          name="harga"
          placeholder="Harga"
          value={form.harga}
          onChange={handleChange}
        />

        <input
          name="durasi"
          placeholder="Durasi"
          value={form.durasi}
          onChange={handleChange}
        />

        <input
          type="number"
          name="jumlah_pertemuan"
          placeholder="Jumlah Pertemuan"
          value={form.jumlah_pertemuan}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>

        <div className="modal-actions">
          <button onClick={handleSubmit}>
            {editData ? "Update" : "Simpan"}
          </button>

          <button onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}
