import { useEffect, useState } from "react";
import "./Pembayaran.css";

export default function Pembayaran() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [detail, setDetail] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [jumlah, setJumlah] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // ================= GET DATA =================
  const fetchData = async () => {
    const res = await fetch("http://localhost:3000/pembayaran");
    const result = await res.json();
    setData(result);
  };

  // ================= OPEN DETAIL =================
  const openDetail = async (id) => {
    setSelectedId(id);

    const res = await fetch(
      `http://localhost:3000/pembayaran/detail/${id}` // ✅ FIX
    );
    const result = await res.json();

    setDetail(result);
    setShowDetail(true);
  };

  // ================= TAMBAH PEMBAYARAN =================
  const tambahPembayaran = async () => {
    if (!jumlah || jumlah <= 0) {
      alert("Masukkan jumlah yang valid");
      return;
    }

    const res = await fetch(`http://localhost:3000/pembayaran/${selectedId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jumlah: Number(jumlah) }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message);
      return;
    }

    alert(result.message);

    setJumlah("");
    openDetail(selectedId); // refresh detail
    fetchData(); // refresh tabel utama
  };

  // ================= SEARCH =================
  const filtered = data.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pembayaran-page">
      <h1>Pembayaran</h1>

      {/* SEARCH */}
      <input
        className="search-input"
        placeholder="Search siswa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="pembayaran-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Sisa Tagihan</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((d) => (
            <tr key={d.id}>
              <td>{d.nama}</td>
              <td>{d.kelas}</td>
              <td>Rp {d.sisa_tagihan?.toLocaleString()}</td>

              <td>
                <button className="btn-detail" onClick={() => openDetail(d.id)}>
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL DETAIL ================= */}
      {showDetail && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Detail Pembayaran</h2>

            {/* FORM TAMBAH BAYAR */}
            <div className="bayar-form">
              <input
                type="number"
                placeholder="Jumlah bayar"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
              />

              <button onClick={tambahPembayaran}>Tambah Pembayaran</button>
            </div>

            {/* RIWAYAT */}
            <table className="detail-table">
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
                      <td>Rp {d.jumlah?.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <button className="btn-close" onClick={() => setShowDetail(false)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
