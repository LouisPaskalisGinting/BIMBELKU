import { useEffect, useState } from "react";

export default function JadwalTentor() {
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
  console.log("USER LOGIN:", JSON.parse(localStorage.getItem("user")));

  return (
    <div>
      <h2>Jadwal Mengajar</h2>

      <table>
        <thead>
          <tr>
            <th>Hari</th>
            <th>Mata Pelajaran</th>
            <th>Kelas</th>
            <th>Waktu</th>
          </tr>
        </thead>

        <tbody>
          {jadwal.map((j) => (
            <tr key={j.id}>
              <td>{j.hari}</td>
              <td>{j.mata_pelajaran}</td>
              <td>{j.kelas}</td>
              <td>{j.jam}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
