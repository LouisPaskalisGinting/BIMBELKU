import { useEffect, useState } from "react";
import "./PembayaranSiswa.css";

export default function PembayaranSiswa() {
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [jumlah, setJumlah] = useState("");
  const [bukti, setBukti] = useState(null);
  const [siswaId, setSiswaId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const siswaData =
        localStorage.getItem("siswa") || localStorage.getItem("user");

      if (!siswaData) {
        setLoading(false);
        return;
      }

      const siswa = JSON.parse(siswaData);

      if (!siswa?.id) {
        setLoading(false);
        return;
      }

      setSiswaId(siswa.id);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    if (!siswaId) {
      setLoading(false);
      return;
    }

    try {
      await fetch("http://localhost:3000/pembayaran/generate", {
        method: "POST",
      });

      const res = await fetch(
        `http://localhost:3000/pembayaran/siswa/${siswaId}`
      );

      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [siswaId]);

  const openDetail = async (id) => {
    setSelectedId(id);

    try {
      const res = await fetch(`http://localhost:3000/pembayaran/detail/${id}`);

      const result = await res.json();

      setDetail(Array.isArray(result) ? result : []);
      setShowDetail(true);
    } catch (err) {
      console.error(err);
    }
  };

  const bayar = async () => {
    if (!jumlah || Number(jumlah) <= 0) {
      alert("Masukkan jumlah pembayaran");
      return;
    }

    if (!bukti) {
      alert("Upload bukti pembayaran terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("jumlah", jumlah);
    formData.append("bukti_pembayaran", bukti);

    try {
      const res = await fetch(
        `http://localhost:3000/pembayaran/${selectedId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Pembayaran gagal");
        return;
      }

      alert(result.message);

      setJumlah("");
      setBukti(null);

      openDetail(selectedId);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengajukan pembayaran");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!siswaId) {
    return <p>Silakan login terlebih dahulu</p>;
  }

  return (
    <div className="pembayaran-page">
      <h1>Pembayaran Saya</h1>

      {data.length === 0 ? (
        <p>Tidak ada tagihan</p>
      ) : (
        <div className="card-container">
          {data.map((item) => (
            <div className="card" key={item.id}>
              <h3>{item.nama}</h3>

              <p>Kelas: {item.nama_kelas || "-"}</p>
              <p>Program: {item.nama_program || "-"}</p>

              <p>
                Total: Rp {Number(item.total_tagihan || 0).toLocaleString()}
              </p>

              <p>
                Dibayar: Rp {Number(item.sudah_dibayar || 0).toLocaleString()}
              </p>

              <p className="sisa">
                Sisa: Rp {Number(item.sisa_tagihan || 0).toLocaleString()}
              </p>

              <button
                onClick={() => openDetail(item.id)}
                disabled={Number(item.sisa_tagihan) === 0}
              >
                {Number(item.sisa_tagihan) === 0 ? "Lunas" : "Bayar / Detail"}
              </button>
            </div>
          ))}
        </div>
      )}

      {showDetail && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Ajukan Pembayaran</h2>

            <div className="bayar-form">
              <input
                type="number"
                placeholder="Jumlah bayar"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBukti(e.target.files[0])}
              />

              <button onClick={bayar}>Ajukan Pembayaran</button>
            </div>

            <h3>Riwayat Pembayaran</h3>

            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jumlah</th>
                  <th>Bukti</th>
                  <th>Status</th>
                  <th>Catatan</th>
                </tr>
              </thead>

              <tbody>
                {detail.length === 0 ? (
                  <tr>
                    <td colSpan="5">Belum ada pembayaran</td>
                  </tr>
                ) : (
                  detail.map((d) => (
                    <tr key={d.id}>
                      <td>{new Date(d.tanggal).toLocaleString()}</td>

                      <td>Rp {Number(d.jumlah || 0).toLocaleString()}</td>

                      <td>
                        {d.bukti_pembayaran ? (
                          <a
                            href={`http://localhost:3000/uploads/${d.bukti_pembayaran}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Lihat Bukti
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>{d.status || "-"}</td>
                      <td>{d.catatan || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <button onClick={() => setShowDetail(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
