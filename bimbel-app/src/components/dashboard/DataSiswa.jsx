import { useEffect, useState } from "react";
import "./DataSiswa.css";

export default function DataSiswa() {
  const [siswa, setSiswa] = useState([]);
  const [pending, setPending] = useState([]);
  const [activeTab, setActiveTab] = useState("siswa");

  const [selectedSiswa, setSelectedSiswa] = useState(null);

  useEffect(() => {
    fetchSiswa();
    fetchPending();
  }, []);

  const fetchSiswa = async () => {
    try {
      const res = await fetch("http://localhost:3000/siswa");
      const data = await res.json();

      console.log("SISWA:", data); // 🔥 DEBUG

      setSiswa(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSiswa([]);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await fetch("http://localhost:3000/siswa/pending");
      const data = await res.json();

      console.log("PENDING:", data); // 🔥 DEBUG

      setPending(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPending([]);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Setujui siswa ini?")) return;

    await fetch(`http://localhost:3000/siswa/approve/${id}`, {
      method: "PUT",
    });

    fetchPending();
    fetchSiswa();
  };
  const handleDecline = async (id) => {
    if (!window.confirm("Tolak siswa ini?")) return;

    await fetch(`http://localhost:3000/siswa/${id}`, {
      method: "DELETE",
    });

    fetchPending(); // refresh list
  };

  return (
    <div className="main">
      <h1>Manajemen Siswa</h1>

      {/* TAB */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("siswa")}>Data Siswa</button>

        <button onClick={() => setActiveTab("pesan")}>
          Pesan ({pending.length})
        </button>
      </div>

      {/* ================= DATA SISWA ================= */}
      {activeTab === "siswa" && (
        <>
          <h2>Data Siswa</h2>

          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Kelas</th>
                <th>Program</th>
              </tr>
            </thead>

            <tbody>
              {siswa.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedSiswa(s)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{s.nama}</td>
                  <td>{s.email}</td>
                  <td>{s.kelas}</td>
                  <td>{s.nama_program || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= PESAN ================= */}
      {activeTab === "pesan" && (
        <>
          <h2>Permintaan Siswa</h2>

          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Program</th>
                <th>Bukti</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {pending.map((s) => (
                <tr key={s.id}>
                  <td
                    onClick={() => setSelectedSiswa(s)}
                    style={{ cursor: "pointer" }}
                  >
                    {s.nama}
                  </td>

                  <td>{s.email}</td>
                  <td>{s.nama_program || "-"}</td>

                  <td>
                    {s.bukti_pembayaran && (
                      <a
                        href={`http://localhost:3000/uploads/${s.bukti_pembayaran}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Lihat
                      </a>
                    )}
                  </td>

                  <td>
                    <button
                      style={{
                        background: "green",
                        color: "white",
                        marginRight: "5px",
                      }}
                      onClick={() => handleApprove(s.id)}
                    >
                      Approve
                    </button>

                    <button
                      style={{ background: "red", color: "white" }}
                      onClick={() => handleDecline(s.id)}
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= MODAL DETAIL ================= */}
      {selectedSiswa && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Detail Siswa</h2>

            <p>
              <b>Nama:</b> {selectedSiswa.nama}
            </p>
            <p>
              <b>Email:</b> {selectedSiswa.email}
            </p>
            <p>
              <b>Kelas:</b> {selectedSiswa.kelas}
            </p>
            <p>
              <b>Asal Sekolah:</b> {selectedSiswa.asal_sekolah}
            </p>
            <p>
              <b>No HP:</b> {selectedSiswa.no_hp}
            </p>
            <p>
              <b>Program:</b> {selectedSiswa.nama_program}
            </p>

            {selectedSiswa.bukti_pembayaran && (
              <p>
                <b>Bukti:</b>{" "}
                <a
                  href={`http://localhost:3000/uploads/${selectedSiswa.bukti_pembayaran}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Lihat Bukti
                </a>
              </p>
            )}

            <button onClick={() => setSelectedSiswa(null)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
