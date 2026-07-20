import { useEffect, useState } from "react";
import "./GaleriModal.css";

export default function GaleriModal({ editData, onClose }) {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (editData) {
      setJudul(editData.judul);
      setDeskripsi(editData.deskripsi);

      if (editData.gambar) {
        setPreview(`http://localhost:3000${editData.gambar}`);
      }
    }
  }, [editData]);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setGambar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("judul", judul);
    formData.append("deskripsi", deskripsi);

    if (gambar) {
      formData.append("gambar", gambar);
    }

    try {
      let url = "http://localhost:3000/galeri";
      let method = "POST";

      if (editData) {
        url = `http://localhost:3000/galeri/${editData.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const result = await res.json();

      alert(result.message);

      onClose();
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="galeri-modal">
        <h2>{editData ? "Edit Galeri" : "Tambah Galeri"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Judul Foto</label>

          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Masukkan judul foto"
            required
          />

          <label>Deskripsi</label>

          <textarea
            rows="4"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Masukkan deskripsi"
          />

          <label>Upload Foto</label>

          <input type="file" accept="image/*" onChange={handleImage} />

          {preview && (
            <img src={preview} alt="Preview" className="preview-image" />
          )}

          <div className="modal-buttons">
            <button className="btn-save" type="submit">
              Simpan
            </button>

            <button className="btn-cancel" type="button" onClick={onClose}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
