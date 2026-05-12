import { useState, useEffect } from "react";

export default function UploadNilai() {
  const [event, setEvent] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const res = await fetch("http://localhost:3000/event");
    const data = await res.json();
    setEvent(data);
  };

  const fetchFiles = async (eventId) => {
    if (!eventId) return;

    const res = await fetch(`http://localhost:3000/nilai/files/${eventId}`);
    const data = await res.json();
    setFiles(data);
  };

  const uploadFile = async () => {
    if (!file || !selectedEvent) {
      alert("Pilih event dan file terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`http://localhost:3000/nilai/upload/${selectedEvent}`, {
      method: "POST",
      body: formData,
    });

    alert("Nilai berhasil diupload");

    fetchFiles(selectedEvent);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload Nilai</h1>

      {/* PILIH EVENT */}
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

      <br />
      <br />

      {/* INPUT FILE */}
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={uploadFile}>Upload Excel</button>

      <hr />

      {/* LIST FILE */}
      <h2>File Nilai</h2>

      <ul>
        {files.map((f) => (
          <li key={f.id}>
            {f.nama_file}{" "}
            <a
              href={`http://localhost:3000/uploads/${f.path_file}`}
              target="_blank"
              rel="noreferrer"
            >
              Buka
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
