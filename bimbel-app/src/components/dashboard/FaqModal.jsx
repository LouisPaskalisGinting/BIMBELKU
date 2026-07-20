import { useEffect, useState } from "react";
import "./FaqModal.css";

export default function FAQModal({ editData, onClose }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (editData) {
      setQuestion(editData.question);
      setAnswer(editData.answer);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      question,
      answer,
    };

    try {
      let url = "http://localhost:3000/faq";
      let method = "POST";

      if (editData) {
        url = `http://localhost:3000/faq/${editData.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      alert(result.message);

      onClose();
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <div className="faq-modal-overlay">
      <div className="faq-modal">
        <h2>{editData ? "Edit FAQ" : "Tambah FAQ"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Pertanyaan</label>

          <textarea
            rows="3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />

          <label>Jawaban</label>

          <textarea
            rows="6"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />

          <div className="faq-button-group">
            <button type="submit" className="btn-save">
              Simpan
            </button>

            <button type="button" className="btn-cancel" onClick={onClose}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
