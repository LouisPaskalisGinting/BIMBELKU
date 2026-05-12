import React from "react";
import { Link } from "react-router-dom";

export default function dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div>
      <h2>Dashboard ({role})</h2>

      <nav>
        <Link to="/siswa">Data Siswa</Link> |{" "}
        <Link to="/tentor">Data Tentor</Link> |{" "}
        <Link to="/kelas">Data Kelas</Link> | <Link to="/jadwal">Jadwal</Link> |{" "}
        <Link to="/absensi">Absensi</Link> | <Link to="/nilai">Nilai</Link> |{" "}
        <Link to="/pembayaran">Pembayaran</Link> |{" "}
        <Link to="/pengumuman">Pengumuman</Link>
      </nav>
    </div>
  );
}
