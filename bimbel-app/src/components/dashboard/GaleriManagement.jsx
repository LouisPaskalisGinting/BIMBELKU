import { useEffect, useState } from "react";

import GaleriModal from "./GaleriModal";

export default function GaleriManagement() {
  const [galeri, setGaleri] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      const res = await fetch("http://localhost:3000/galeri");
      const data = await res.json();
      setGaleri(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus data galeri ini?");

    if (!konfirmasi) return;

    try {
      await fetch(`http://localhost:3000/galeri/${id}`, {
        method: "DELETE",
      });

      fetchGaleri();
    } catch (err) {
      console.log(err);
      alert("Gagal menghapus data.");
    }
  };

  return (
    <div className="galeri-page">
      <div className="galeri-header">
        <h1>Kelola Galeri</h1>

        <button
          className="btn-add"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
        >
          + Tambah Foto
        </button>
      </div>

      <table className="galeri-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Foto</th>
            <th>Judul</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {galeri.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Belum ada data galeri
              </td>
            </tr>
          ) : (
            galeri.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>
                  {item.gambar ? (
                    <img
                      src={`http://localhost:3000${item.gambar}`}
                      alt={item.judul}
                      className="galeri-image"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td>{item.judul}</td>

                <td>{item.deskripsi}</td>

                <td>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditData(item);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <GaleriModal
          editData={editData}
          onClose={() => {
            setShowModal(false);
            fetchGaleri();
          }}
        />
      )}
    </div>
  );
}
