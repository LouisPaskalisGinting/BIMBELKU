import { useEffect, useState } from "react";
import "./Jadwal.css";

export default function Jadwal() {
  const [jadwal, setJadwal] = useState([]);

  const [form, setForm] = useState({
    kelas_id: "",
    mata_pelajaran: "",
    tentor: "",
    tanggal: "",
    hari: "",
    jam_mulai: "",
    jam_selesai: "",
    tentor_id: "",
  });

  const [kelasList, setKelasList] = useState([]);
  const [tentorList, setTentorList] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchKelas();
    fetchTentor();
  }, []);

  const getHariDariTanggal = (tanggal) => {
    if (!tanggal) return "";

    const hariIndonesia = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    const tanggalBersih = String(tanggal).split("T")[0];
    const [tahun, bulan, hari] = tanggalBersih.split("-");

    const date = new Date(tahun, bulan - 1, hari);

    return hariIndonesia[date.getDay()];
  };

  const gabungHariTanggal = (tanggal) => {
    if (!tanggal) return "";

    const tanggalBersih = String(tanggal).split("T")[0];
    const [tahun, bulan, tanggalHari] = tanggalBersih.split("-");

    const date = new Date(tahun, bulan - 1, tanggalHari);

    const namaHari = getHariDariTanggal(tanggalBersih);

    const tanggalFormat = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return `${namaHari}, ${tanggalFormat}`;
  };

  const tampilJam = (j) => {
    if (j.jam_mulai && j.jam_selesai) {
      return `${j.jam_mulai} - ${j.jam_selesai}`;
    }

    if (j.jam) return j.jam;

    return "-";
  };

  const resetForm = () => {
    setForm({
      kelas_id: "",
      mata_pelajaran: "",
      tentor: "",
      tanggal: "",
      hari: "",
      jam_mulai: "",
      jam_selesai: "",
      tentor_id: "",
    });

    setEditId(null);
  };

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/jadwal");

      if (!res.ok) {
        throw new Error("Gagal mengambil data jadwal");
      }

      const data = await res.json();

      const jadwalData = Array.isArray(data) ? data : [];

      jadwalData.sort((a, b) => b.id - a.id);

      console.log("DATA JADWAL:", jadwalData);

      setJadwal(jadwalData);
    } catch (err) {
      console.error("Gagal mengambil data jadwal:", err);
      setJadwal([]);
    }
  };

  const fetchKelas = async () => {
    try {
      const res = await fetch("http://localhost:3000/kelas");

      if (!res.ok) {
        throw new Error("Gagal mengambil data kelas");
      }

      const data = await res.json();

      setKelasList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data kelas:", err);
      setKelasList([]);
    }
  };

  const fetchTentor = async () => {
    try {
      const res = await fetch("http://localhost:3000/tentor");

      if (!res.ok) {
        throw new Error("Gagal mengambil data tentor");
      }

      const data = await res.json();

      setTentorList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data tentor:", err);
      setTentorList([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tentor") {
      const selectedTentor = tentorList.find((t) => t.nama === value);

      setForm({
        ...form,
        tentor: value,
        tentor_id: selectedTentor ? selectedTentor.id : "",
      });

      return;
    }

    if (name === "tanggal") {
      const hariTanggal = gabungHariTanggal(value);

      setForm({
        ...form,
        tanggal: value,
        hari: hariTanggal,
      });

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (
      !form.kelas_id ||
      !form.mata_pelajaran ||
      !form.tentor ||
      !form.tanggal ||
      !form.jam_mulai ||
      !form.jam_selesai
    ) {
      alert(
        "Kelas, mata pelajaran, tentor, tanggal, jam mulai, dan jam selesai wajib diisi"
      );
      return;
    }

    if (form.jam_mulai >= form.jam_selesai) {
      alert("Jam selesai harus lebih besar dari jam mulai");
      return;
    }

    const payload = {
      kelas_id: form.kelas_id,
      mata_pelajaran: form.mata_pelajaran,
      tentor: form.tentor,
      tanggal: form.tanggal,
      hari: form.hari,
      jam_mulai: form.jam_mulai,
      jam_selesai: form.jam_selesai,
      jam: `${form.jam_mulai} - ${form.jam_selesai}`,
      tentor_id: form.tentor_id || null,
    };

    try {
      let res;

      if (editId) {
        res = await fetch(`http://localhost:3000/jadwal/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("http://localhost:3000/jadwal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal menyimpan jadwal");
        console.log("ERROR JADWAL:", result);
        return;
      }

      alert(result.message || "Jadwal berhasil disimpan");

      resetForm();
      fetchData();
    } catch (err) {
      console.error("Gagal menyimpan jadwal:", err);
      alert("Terjadi kesalahan saat menyimpan jadwal");
    }
  };

  const handleEdit = (j) => {
    const tanggalEdit = j.tanggal ? String(j.tanggal).split("T")[0] : "";

    let jamMulai = j.jam_mulai || "";
    let jamSelesai = j.jam_selesai || "";

    if ((!jamMulai || !jamSelesai) && j.jam) {
      const pecahJam = j.jam.split("-");
      jamMulai = pecahJam[0]?.trim() || "";
      jamSelesai = pecahJam[1]?.trim() || "";
    }

    setForm({
      kelas_id: j.kelas_id || "",
      mata_pelajaran: j.mata_pelajaran || "",
      tentor: j.tentor || "",
      tanggal: tanggalEdit,
      hari: j.hari || gabungHariTanggal(tanggalEdit),
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
      tentor_id: j.tentor_id || "",
    });

    setEditId(j.id);
  };

  const handleDelete = async (id) => {
    const yakin = window.confirm("Yakin ingin menghapus jadwal ini?");

    if (!yakin) return;

    try {
      const res = await fetch(`http://localhost:3000/jadwal/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal menghapus jadwal");
        return;
      }

      alert(result.message || "Jadwal berhasil dihapus");
      fetchData();
    } catch (err) {
      console.error("Gagal menghapus jadwal:", err);
      alert("Terjadi kesalahan saat menghapus jadwal");
    }
  };

  return (
    <div className="jadwal-container">
      <h1>Manajemen Jadwal</h1>

      <div className="jadwal-form">
        <select name="kelas_id" value={form.kelas_id} onChange={handleChange}>
          <option value="">Pilih Kelas</option>

          {kelasList.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama_kelas}
            </option>
          ))}
        </select>

        <input
          name="mata_pelajaran"
          placeholder="Mata Pelajaran"
          value={form.mata_pelajaran}
          onChange={handleChange}
        />

        <select name="tentor" value={form.tentor} onChange={handleChange}>
          <option value="">Pilih Tentor</option>

          {tentorList.map((t) => (
            <option key={t.id} value={t.nama}>
              {t.nama}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="tanggal"
          value={form.tanggal}
          onChange={handleChange}
        />

        <input
          name="hari"
          placeholder="Hari / Tanggal"
          value={form.hari}
          readOnly
        />

        <input
          type="time"
          name="jam_mulai"
          value={form.jam_mulai}
          onChange={handleChange}
        />

        <input
          type="time"
          name="jam_selesai"
          value={form.jam_selesai}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update Jadwal" : "Tambah Jadwal"}
        </button>

        {editId && (
          <button type="button" onClick={resetForm}>
            Batal
          </button>
        )}
      </div>

      <table className="jadwal-table">
        <thead>
          <tr>
            <th>Kelas</th>
            <th>Mapel</th>
            <th>Tentor</th>
            <th>Hari / Tanggal</th>
            <th>Waktu</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {jadwal.length === 0 ? (
            <tr>
              <td colSpan="6">Belum ada jadwal</td>
            </tr>
          ) : (
            jadwal.map((j) => (
              <tr key={j.id}>
                <td>{j.nama_kelas || j.kelas || "-"}</td>
                <td>{j.mata_pelajaran || "-"}</td>
                <td>{j.tentor || "-"}</td>
                <td>{j.hari || "-"}</td>
                <td>{tampilJam(j)}</td>
                <td>
                  <button onClick={() => handleEdit(j)}>Edit</button>
                  <button onClick={() => handleDelete(j.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
