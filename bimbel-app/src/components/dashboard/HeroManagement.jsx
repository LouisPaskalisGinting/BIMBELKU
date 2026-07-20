import React, { useEffect, useState } from "react";
import "./HeroManagement.css";

export default function HeroManagement() {
  const [hero, setHero] = useState({
    id: 1,
    title: "",
    subtitle: "",
    button_text: "",
    background: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch("http://localhost:3000/hero");
      const data = await res.json();

      setHero(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setHero({
      ...hero,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", hero.title);
    formData.append("subtitle", hero.subtitle);
    formData.append("button_text", hero.button_text);

    if (image) {
      formData.append("background", image);
    }

    await fetch(`http://localhost:3000/hero/${hero.id}`, {
      method: "PUT",
      body: formData,
    });

    alert("Hero berhasil diperbarui");

    fetchHero();
  };

  return (
    <div className="hero-management">
      <h1>Kelola Hero Section</h1>

      <form onSubmit={handleSubmit}>
        <label>Judul</label>

        <input
          type="text"
          name="title"
          value={hero.title || ""}
          onChange={handleChange}
        />

        <label>Subtitle</label>

        <textarea
          rows="4"
          name="subtitle"
          value={hero.subtitle || ""}
          onChange={handleChange}
        />

        <label>Text Tombol</label>

        <input
          type="text"
          name="button_text"
          value={hero.button_text || ""}
          onChange={handleChange}
        />

        <label>Background</label>

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        {hero.background && (
          <img
            src={`http://localhost:3000${hero.background}`}
            alt="Hero"
            className="preview-image"
          />
        )}

        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}
