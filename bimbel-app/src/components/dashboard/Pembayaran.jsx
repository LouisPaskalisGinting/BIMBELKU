import { useEffect, useState } from "react";
import "./Pembayaran.css";

export default function Pembayaran() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [detail, setDetail] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetch("http://localhost:3000/pembayaran/generate", {
      method: "POST",
    });

    const res = await fetch("http://localhost:3000/pembayaran");
    const result = await res.json();

    setData(Array.isArray(result) ? result : []);
  };

  const openDetail = async (id) => {
    setSelectedId(id);

    const res = await fetch(`http://localhost:3000/pembayaran/detail/${id}`);
    const result = await res.json();

    setDetail(Array.isArray(result) ? result : []);
    setShowDetail(true);
  };

  const approvePembayaran = async (detailId) => {
    const res = await fetch(
      `http://localhost:3000/pembayaran/approve/${detailId}`,
      {
        method: "PUT",
      }
    );

    const result = await res.json();
    alert(result.message);

    openDetail(selectedId);
    fetchData();
  };

  const rejectPembayaran = async (detailId) => {
    const catatan = prompt("Masukkan alasan penolakan:");

    const res = await fetch(
      `http://localhost:3000/pembayaran/reject/${detailId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          catatan,
        }),
      }
    );

    const result = await res.json();
    alert(result.message);

    openDetail(selectedId);
    fetchData();
  };

  const filtered = data.filter((d) =>
    d.nama?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pembayaran-page">
      <h1>Pembayaran Admin</h1>

      <input
        className="search-input"
        placeholder="Search siswa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="pembayaran-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Program</th>
            <th>Total Tagihan</th>
            <th>Sudah Dibayar</th>
            <th>Sisa Tagihan</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7">Tidak ada data pembayaran</td>
            </tr>
          ) : (
            filtered.map((d) => (
              <tr key={d.id}>
                <td>{d.nama}</td>
                <td>{d.nama_kelas || "-"}</td>
                <td>{d.nama_program || "-"}</td>

                <td>Rp {Number(d.total_tagihan || 0).toLocaleString()}</td>

                <td>Rp {Number(d.sudah_dibayar || 0).toLocaleString()}</td>

                <td>Rp {Number(d.sisa_tagihan || 0).toLocaleString()}</td>

                <td>
                  <button
                    className="btn-detail"
                    onClick={() => openDetail(d.id)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showDetail && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Detail Pembayaran</h2>

            <table className="detail-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jumlah</th>
                  <th>Bukti</th>
                  <th>Status</th>
                  <th>Catatan</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {detail.length === 0 ? (
                  <tr>
                    <td colSpan="6">Belum ada pembayaran</td>
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

                      <td>
                        {d.status === "pending" ? (
                          <>
                            <button onClick={() => approvePembayaran(d.id)}>
                              Setujui
                            </button>

                            <button onClick={() => rejectPembayaran(d.id)}>
                              Tolak
                            </button>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
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
