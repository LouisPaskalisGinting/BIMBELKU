import { useState, useEffect } from "react";
import "./Nilai.css";

export default function UploadNilai() {
  const [event, setEvent] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await fetch("http://localhost:3000/event");
      const data = await res.json();

      setEvent(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data event:", err);
      setEvent([]);
    }
  };

  const fetchFiles = async (eventId) => {
    if (!eventId) {
      setFiles([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/nilai/files/${eventId}`);
      const data = await res.json();

      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil file nilai:", err);
      setFiles([]);
    }
  };

  const uploadFile = async () => {
    if (!file || !selectedEvent) {
      alert("Pilih event dan file terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch(`http://localhost:3000/nilai/upload/${selectedEvent}`, {
        method: "POST",
        body: formData,
      });

      alert("Nilai berhasil diupload");

      setFile(null);
      fetchFiles(selectedEvent);
    } catch (err) {
      console.error("Gagal upload nilai:", err);
      alert("Gagal upload nilai");
    }
  };

  return (
    <div className="upload-nilai-page">
      <h1>Upload Nilai</h1>

      <div className="upload-card">
        <h2>Form Upload Nilai</h2>

        <div className="upload-form">
          <div className="form-group">
            <label>Pilih Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                fetchFiles(e.target.value);
              }}
            >
              <option value="">Pilih Event</option>

              {event.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.judul}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Upload File Excel</label>
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file && <p className="file-name">File dipilih: {file.name}</p>}
          </div>

          <button className="btn-upload" onClick={uploadFile}>
            Upload Excel
          </button>
        </div>
      </div>

      <div className="file-card">
        <h2>File Nilai</h2>

        {files.length > 0 ? (
          <div className="file-list">
            {files.map((f) => (
              <div className="file-item" key={f.id}>
                <div>
                  <h3>{f.nama_file}</h3>
                  <p>File nilai siswa</p>
                </div>

                <a
                  href={`http://localhost:3000/uploads/${f.path_file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-open"
                >
                  Buka
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-file">Belum ada file nilai untuk event ini</div>
        )}
      </div>
    </div>
  );
}
