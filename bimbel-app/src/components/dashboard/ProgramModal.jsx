import { useState } from "react";

export default function ProgramModal({ onClose }) {
  const [form, setForm] = useState({
    nama_program: "",
    deskripsi: "",
    harga: "",
    durasi: "",
    jumlah_pertemuan: "",
    level: "",
    status: "aktif",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:3000/program", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Tambah Program</h2>

        <input
          name="nama_program"
          placeholder="Nama Program"
          onChange={handleChange}
        />

        <textarea
          name="deskripsi"
          placeholder="Deskripsi"
          onChange={handleChange}
        />

        <input name="harga" placeholder="Harga" onChange={handleChange} />

        <input name="durasi" placeholder="Durasi" onChange={handleChange} />

        <input
          name="jumlah_pertemuan"
          placeholder="Jumlah Pertemuan"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Simpan</button>

        <button onClick={onClose}>Batal</button>
      </div>
    </div>
  );
}
