import React, { useEffect, useState } from "react";
import "./AboutManagement.css";

export default function AboutManagement() {
  const [about, setAbout] = useState({
    id: 1,
    title: "",
    description: "",
    image: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    const res = await fetch("http://localhost:3000/about");
    const data = await res.json();

    setAbout(data);
  };

  const handleChange = (e) => {
    setAbout({
      ...about,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", about.title);
    formData.append("description", about.description);

    if (image) {
      formData.append("image", image);
    }

    await fetch(`http://localhost:3000/about/${about.id}`, {
      method: "PUT",
      body: formData,
    });

    alert("About berhasil diperbarui");

    fetchAbout();
  };

  return (
    <div className="about-management">
      <h1>Kelola About</h1>

      <form onSubmit={handleSubmit}>
        <label>Judul</label>

        <input name="title" value={about.title || ""} onChange={handleChange} />

        <label>Deskripsi</label>

        <textarea
          rows="8"
          name="description"
          value={about.description || ""}
          onChange={handleChange}
        />

        <label>Gambar</label>

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        {about.image && (
          <img
            src={`http://localhost:3000${about.image}`}
            className="preview-about"
            alt=""
          />
        )}

        <button>Simpan</button>
      </form>
    </div>
  );
}
