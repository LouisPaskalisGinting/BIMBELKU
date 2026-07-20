import { useState, useEffect } from "react";
import "./NilaiSiswa.css";

export default function NilaiSiswa() {
  const [event, setEvent] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [nilai, setNilai] = useState([]);

  const siswaData =
    localStorage.getItem("siswa") || localStorage.getItem("user");

  const siswa = siswaData ? JSON.parse(siswaData) : null;
  const siswa_id = siswa?.id;

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await fetch("http://localhost:3000/event");
      const data = await res.json();
      setEvent(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil event:", err);
      setEvent([]);
    }
  };

  const fetchNilai = async (eventId) => {
    if (!eventId || !siswa_id) return;

    try {
      const res = await fetch(
        `http://localhost:3000/nilai/siswa/${eventId}/${siswa_id}`
      );

      const data = await res.json();

      console.log("HASIL NILAI:", data);

      setNilai(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil nilai:", err);
      setNilai([]);
    }
  };

  return (
    <div className="nilai-siswa-container">
      <div className="nilai-siswa-card">
        <h1 className="nilai-siswa-title">📊 Nilai Saya</h1>

        <div className="nilai-filter">
          <label>Pilih Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => {
              setSelectedEvent(e.target.value);
              fetchNilai(e.target.value);
            }}
          >
            <option value="">Pilih Event</option>

            {event.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.judul || ev.nama_event}
              </option>
            ))}
          </select>
        </div>

        <div className="nilai-table-wrapper">
          <table className="nilai-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Nilai</th>
              </tr>
            </thead>

            <tbody>
              {nilai.length > 0 ? (
                nilai.map((n, index) => (
                  <tr key={index}>
                    <td>{n.nama}</td>
                    <td>
                      <span className="nilai-angka">{n.nilai}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="nilai-empty">
                    Belum ada nilai
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
