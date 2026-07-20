import { useEffect, useState } from "react";
import "./TestimonialManagement.css";
import TestimonialModal from "./TestimonialModal";

export default function TestimonialManagement() {
  const [testimonial, setTestimonial] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchTestimonial();
  }, []);

  const fetchTestimonial = async () => {
    try {
      const res = await fetch("http://localhost:3000/testimonial");
      const data = await res.json();
      setTestimonial(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus testimoni ini?");

    if (!konfirmasi) return;

    try {
      await fetch(`http://localhost:3000/testimonial/${id}`, {
        method: "DELETE",
      });

      fetchTestimonial();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="testimonial-page">
      <div className="testimonial-header">
        <h1>Kelola Testimoni</h1>

        <button
          className="btn-add"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
        >
          + Tambah Testimoni
        </button>
      </div>

      <table className="testimonial-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Foto</th>
            <th>Nama</th>
            <th>Asal Sekolah</th>
            <th>Universitas</th>
            <th>Pesan</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {testimonial.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Belum ada data testimoni
              </td>
            </tr>
          ) : (
            testimonial.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>
                  {item.foto ? (
                    <img
                      src={`http://localhost:3000${item.foto}`}
                      alt={item.nama}
                      className="testimonial-img"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td>{item.nama}</td>

                <td>{item.asal_sekolah}</td>

                <td>{item.universitas}</td>

                <td className="pesan-cell">{item.pesan}</td>

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
        <TestimonialModal
          editData={editData}
          onClose={() => {
            setShowModal(false);
            fetchTestimonial();
          }}
        />
      )}
    </div>
  );
}
