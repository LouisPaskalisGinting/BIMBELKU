import { useEffect, useState } from "react";
import "./Register.css";

export default function Register() {
  const [programList, setProgramList] = useState([]);

  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    asal_sekolah: "",
    no_hp: "",
    nama_orangtua: "",
    no_hp_orangtua: "",
    program_id: "",
    email: "",
    password: "",
  });

  // BUKTI PEMBAYARAN
  const [buktiPembayaran, setBuktiPembayaran] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    try {
      const res = await fetch("http://localhost:3000/program");
      const data = await res.json();
      setProgramList(data);
    } catch (error) {
      console.error("Gagal ambil program:", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE UPLOAD BUKTI
  const handleBuktiChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setBuktiPembayaran(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDASI
    for (let key in form) {
      if (!form[key]) {
        alert("Semua data wajib diisi!");
        return;
      }
    }

    if (!buktiPembayaran) {
      alert("Bukti pembayaran wajib diupload!");
      return;
    }

    try {
      // FORM DATA
      const formData = new FormData();

      formData.append("nama", form.nama);
      formData.append("kelas", form.kelas);
      formData.append("asal_sekolah", form.asal_sekolah);
      formData.append("no_hp", form.no_hp);
      formData.append("nama_orangtua", form.nama_orangtua);
      formData.append("no_hp_orangtua", form.no_hp_orangtua);
      formData.append("program_id", form.program_id);
      formData.append("email", form.email.trim().toLowerCase());
      formData.append("password", form.password);

      // FILE BUKTI
      formData.append("bukti_pembayaran", buktiPembayaran);

      const res = await fetch("http://localhost:3000/register/siswa", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("RESP REGISTER:", data);

      if (res.ok) {
        alert("Pendaftaran berhasil!");
        window.location.href = "/";
      } else {
        alert(data.message || "Gagal daftar");
      }
    } catch (error) {
      console.error(error);
      alert("Server tidak terhubung");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Form Pendaftaran Siswa</h2>

        <input
          name="nama"
          placeholder="Nama"
          value={form.nama}
          onChange={handleChange}
        />

        <input
          name="kelas"
          placeholder="Kelas"
          value={form.kelas}
          onChange={handleChange}
        />

        <input
          name="asal_sekolah"
          placeholder="Asal Sekolah"
          value={form.asal_sekolah}
          onChange={handleChange}
        />

        <input
          name="no_hp"
          placeholder="No HP"
          value={form.no_hp}
          onChange={handleChange}
        />

        <input
          name="nama_orangtua"
          placeholder="Nama Orang Tua"
          value={form.nama_orangtua}
          onChange={handleChange}
        />

        <input
          name="no_hp_orangtua"
          placeholder="No HP Orang Tua"
          value={form.no_hp_orangtua}
          onChange={handleChange}
        />

        {/* PROGRAM */}
        <select
          name="program_id"
          value={form.program_id}
          onChange={handleChange}
        >
          <option value="">Pilih Program</option>

          {programList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama_program} - Rp {p.harga}
            </option>
          ))}
        </select>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        {/* UPLOAD BUKTI PEMBAYARAN */}
        <div className="upload-box">
          <label>Upload Bukti Pembayaran</label>

          <input type="file" accept="image/*" onChange={handleBuktiChange} />
        </div>

        {/* PREVIEW */}
        {preview && (
          <img src={preview} alt="Preview Bukti" className="preview-image" />
        )}

        <button className="btn-login" onClick={handleSubmit}>
          Daftar
        </button>
      </div>
    </div>
  );
}
