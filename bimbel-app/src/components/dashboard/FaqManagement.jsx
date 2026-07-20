import { useEffect, useState } from "react";
import "./FaqManagement.css";
import FaqModal from "./FaqModal";

export default function FAQManagement() {
  const [faq, setFaq] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const res = await fetch("http://localhost:3000/faq");

      const data = await res.json();

      setFaq(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus FAQ?")) return;

    await fetch(`http://localhost:3000/faq/${id}`, {
      method: "DELETE",
    });

    fetchFaq();
  };

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1>Kelola FAQ</h1>

        <button
          className="btn-add"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
        >
          + Tambah FAQ
        </button>
      </div>

      <table className="faq-table">
        <thead>
          <tr>
            <th>No</th>

            <th>Pertanyaan</th>

            <th>Jawaban</th>

            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {faq.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>

              <td>{item.question}</td>

              <td>{item.answer}</td>

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
          ))}
        </tbody>
      </table>

      {showModal && (
        <FaqModal
          editData={editData}
          onClose={() => {
            setShowModal(false);
            fetchFaq();
          }}
        />
      )}
    </div>
  );
}
