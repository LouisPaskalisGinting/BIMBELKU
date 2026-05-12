import { useState, useEffect } from "react";

export default function NilaiSiswa() {
  const [event, setEvent] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [nilai, setNilai] = useState([]);

  // ✅ TARUH DI ATAS
  const siswa_id = 29; // sementara untuk testing

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const res = await fetch("http://localhost:3000/event");
    const data = await res.json();
    setEvent(data);
  };

  const fetchNilai = async (eventId) => {
    console.log("EVENT:", eventId);
    console.log("SISWA:", siswa_id);

    const res = await fetch(
      `http://localhost:3000/nilai/siswa/${eventId}/${siswa_id}`
    );
    const data = await res.json();

    console.log("HASIL:", data);

    setNilai(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Nilai Saya</h1>

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
            {ev.judul}
          </option>
        ))}
      </select>

      <hr />

      <table border="1" cellPadding="10">
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
                <td>{n.nilai}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">Belum ada nilai</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
