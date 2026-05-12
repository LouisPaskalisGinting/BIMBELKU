import { useEffect, useState } from "react";
import "./Program.css";
import ProgramModal from "./ProgramModal";

export default function Program() {
  const [program, setProgram] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    const res = await fetch("http://localhost:3000/program");
    const data = await res.json();
    setProgram(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus program?")) return;

    await fetch(`http://localhost:3000/program/${id}`, {
      method: "DELETE",
    });

    fetchProgram();
  };

  return (
    <div className="program-page">
      <h1>Program Bimbel</h1>

      <button
        className="btn-add"
        onClick={() => {
          setEditData(null);
          setShowModal(true);
        }}
      >
        + Tambah Program
      </button>

      <table className="program-table">
        <thead>
          <tr>
            <th>Program</th>
            <th>Harga</th>
            <th>Durasi</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {program.map((p) => (
            <tr key={p.id}>
              <td>{p.nama_program}</td>

              <td>Rp {p.harga}</td>

              <td>{p.durasi}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={() => {
                    setEditData(p);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn-delete"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <ProgramModal
          editData={editData}
          onClose={() => {
            setShowModal(false);
            fetchProgram();
          }}
        />
      )}
    </div>
  );
}
