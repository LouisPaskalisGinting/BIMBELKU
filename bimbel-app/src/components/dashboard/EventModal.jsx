import { useState } from "react";

export default function EventModal({ onClose }) {
  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    tanggal: "",
    waktu: "",
    lokasi: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:3000/event", {
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
        <h2>Tambah Event</h2>

        <input name="judul" placeholder="Judul Event" onChange={handleChange} />

        <textarea
          name="deskripsi"
          placeholder="Deskripsi"
          onChange={handleChange}
        />

        <input type="date" name="tanggal" onChange={handleChange} />

        <input name="waktu" placeholder="Waktu" onChange={handleChange} />

        <input name="lokasi" placeholder="Lokasi" onChange={handleChange} />

        <button onClick={handleSubmit}>Simpan</button>

        <button onClick={onClose}>Batal</button>
      </div>
    </div>
  );
}
