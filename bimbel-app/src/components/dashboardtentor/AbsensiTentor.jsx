import { useEffect, useState } from "react";

export default function AbsensiTentor() {
  const [jadwal, setJadwal] = useState([]);

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(`http://localhost:3000/jadwal/tentor/${user.id}`);

    const data = await res.json();
    setJadwal(data);
  };

  const handleAbsensi = async (jadwalId) => {
    await fetch("http://localhost:3000/absensi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jadwal_id: jadwalId,
      }),
    });

    alert("Absensi berhasil!");
  };

  return (
    <div>
      <h2>Absensi</h2>

      {jadwal.map((j) => (
        <div key={j.id}>
          <p>
            {j.kelas} - {j.mapel}
          </p>
          <button onClick={() => handleAbsensi(j.id)}>Absen</button>
        </div>
      ))}
    </div>
  );
}
