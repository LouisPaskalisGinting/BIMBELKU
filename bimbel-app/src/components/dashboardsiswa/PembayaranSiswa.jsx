import { useEffect, useState } from "react";
import "./PembayaranSiswa.css";

export default function PembayaranSiswa() {
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [jumlah, setJumlah] = useState("");
  const [siswaId, setSiswaId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= AMBIL siswa_id =================
  useEffect(() => {
    const id = parseInt(localStorage.getItem("siswa_id"));

    console.log("AMBIL siswa_id:", id);

    if (!id || isNaN(id)) {
      setLoading(false);
      return;
    }

    setSiswaId(id);
  }, []);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      if (!siswaId) return;

      console.log("FETCH DATA UNTUK:", siswaId);

      try {
        const res = await fetch(
          `http://localhost:3000/pembayaran/siswa/${siswaId}`
        );

        const result = await res.json();

        console.log("DATA API:", result);

        setData(result);
      } catch (err) {
        console.error("ERROR FETCH:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [siswaId]);

  // ================= OPEN DETAIL =================
  const openDetail = async (id) => {
    setSelectedId(id);

    try {
      const res = await fetch(`http://localhost:3000/pembayaran/detail/${id}`);

      const result = await res.json();

      setDetail(result);
      setShowDetail(true);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= BAYAR =================
  const bayar = async () => {
    if (!jumlah || jumlah <= 0) {
      alert("Masukkan jumlah");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/pembayaran/${selectedId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jumlah: Number(jumlah) }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert("Pembayaran berhasil");

      setJumlah("");

      // refresh detail
      openDetail(selectedId);

      // refresh data utama
      const res2 = await fetch(
        `http://localhost:3000/pembayaran/siswa/${siswaId}`
      );
      const newData = await res2.json();
      setData(newData);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= RENDER =================
  if (loading) {
    return <p>Loading...</p>;
  }

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
              <p>Kelas: {item.kelas}</p>

              <p>Total: Rp {item.total_tagihan.toLocaleString()}</p>
              <p>Dibayar: Rp {item.sudah_dibayar.toLocaleString()}</p>

              <p className="sisa">
                Sisa: Rp {item.sisa_tagihan.toLocaleString()}
              </p>

              <button
                onClick={() => openDetail(item.id)}
                disabled={item.sisa_tagihan === 0}
              >
                {item.sisa_tagihan === 0 ? "Lunas" : "Detail"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showDetail && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Detail Pembayaran</h2>

            <div className="bayar-form">
              <input
                type="number"
                placeholder="Jumlah bayar"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
              />
              <button onClick={bayar}>Bayar</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {detail.length === 0 ? (
                  <tr>
                    <td colSpan="2">Belum ada pembayaran</td>
                  </tr>
                ) : (
                  detail.map((d) => (
                    <tr key={d.id}>
                      <td>{new Date(d.tanggal).toLocaleString()}</td>
                      <td>Rp {d.jumlah.toLocaleString()}</td>
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
