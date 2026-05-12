import { useEffect, useState } from "react";

export default function FormAbsensi({ jadwal, onBack }) {
  const [absensi, setAbsensi] = useState([]);

  const tanggal = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let res = await fetch(
      `http://localhost:3000/absensi/by-jadwal/${jadwal.id}`
    );

    let data = await res.json();

    // 🔥 AUTO GENERATE
    if (data.length === 0) {
      await fetch("http://localhost:3000/absensi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jadwal_id: jadwal.id,
          tanggal,
        }),
      });

      res = await fetch(`http://localhost:3000/absensi/by-jadwal/${jadwal.id}`);
      data = await res.json();
    }

    setAbsensi(data);
  };

  const handleChange = (id, status) => {
    const updated = absensi.map((a) => (a.id === id ? { ...a, status } : a));
    setAbsensi(updated);
  };

  const simpan = async () => {
    for (let a of absensi) {
      await fetch(`http://localhost:3000/absensi/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: a.status }),
      });
    }

    alert("Absensi berhasil disimpan");
  };

  return (
    <div>
      <button onClick={onBack}>⬅ Kembali</button>

      <h3>
        {jadwal.kelas} - {jadwal.mata_pelajaran}
      </h3>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {absensi.map((a) => (
            <tr key={a.id}>
              <td>{a.nama}</td>
              <td>
                <select
                  value={a.status}
                  onChange={(e) => handleChange(a.id, e.target.value)}
                >
                  <option value="hadir">Hadir</option>
                  <option value="izin">Izin</option>
                  <option value="alpha">Alpha</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={simpan}>💾 Simpan</button>
    </div>
  );
}
