import { useEffect, useState } from "react";
import "./KontakManagement.css";

export default function KontakManagement() {
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchKontak();
  }, []);

  const fetchKontak = async () => {
    const res = await fetch("http://localhost:3000/kontak");

    const data = await res.json();

    setForm(data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:3000/kontak/${form.id}`,

      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    alert(data.message);
  };

  return (
    <div className="kontak-page">
      <h1>Kelola Kontak</h1>

      <form className="kontak-form" onSubmit={handleSubmit}>
        <label>Nama Bimbel</label>

        <input
          name="nama_bimbel"
          value={form.nama_bimbel || ""}
          onChange={handleChange}
        />

        <label>Alamat</label>

        <textarea
          rows="3"
          name="alamat"
          value={form.alamat || ""}
          onChange={handleChange}
        />

        <label>Telepon</label>

        <input
          name="telepon"
          value={form.telepon || ""}
          onChange={handleChange}
        />

        <label>WhatsApp</label>

        <input
          name="whatsapp"
          value={form.whatsapp || ""}
          onChange={handleChange}
        />

        <label>Email</label>

        <input name="email" value={form.email || ""} onChange={handleChange} />

        <label>Instagram</label>

        <input
          name="instagram"
          value={form.instagram || ""}
          onChange={handleChange}
        />

        <label>Facebook</label>

        <input
          name="facebook"
          value={form.facebook || ""}
          onChange={handleChange}
        />

        <label>Youtube</label>

        <input
          name="youtube"
          value={form.youtube || ""}
          onChange={handleChange}
        />

        <label>Google Maps</label>

        <textarea
          rows="4"
          name="maps"
          value={form.maps || ""}
          onChange={handleChange}
        />

        <button className="btn-save" type="submit">
          Simpan
        </button>
      </form>
    </div>
  );
}
