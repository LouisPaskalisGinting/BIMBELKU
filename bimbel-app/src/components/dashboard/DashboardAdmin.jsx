import React, { useEffect, useState } from "react";
import "./DashboardAdmin.css";
import { useNavigate } from "react-router-dom";
import EventModal from "./EventModal";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const [showEventModal, setShowEventModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(true);

  const [stats, setStats] = useState({
    total_siswa: 0,
    total_tentor: 0,
    kelas_hari_ini: 0,
    pendaftar_bulan_ini: 0,
  });

  useEffect(() => {
    fetchStats();
    fetchNotifikasi();

    const interval = setInterval(() => {
      fetchStats();
      fetchNotifikasi();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:3000/dashboard/stats");
      const data = await res.json();

      setStats({
        total_siswa: data.total_siswa || 0,
        total_tentor: data.total_tentor || 0,
        kelas_hari_ini: data.kelas_hari_ini || 0,
        pendaftar_bulan_ini: data.pendaftar_bulan_ini || 0,
      });
    } catch (error) {
      console.error("Gagal mengambil statistik dashboard:", error);
    }
  };

  const fetchNotifikasi = async () => {
    try {
      const res = await fetch("http://localhost:3000/notifikasi");
      const data = await res.json();

      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
      setNotifications([]);
    } finally {
      setLoadingNotif(false);
    }
  };

  const getNotificationTime = (waktu) => {
    if (!waktu) {
      return "Baru saja";
    }

    const date = new Date(waktu);

    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (tipe) => {
    if (tipe === "pendaftaran") return "📝";
    if (tipe === "pembayaran") return "💳";
    if (tipe === "absensi") return "✅";
    if (tipe === "jadwal") return "📚";
    return "🔔";
  };

  const kpiData = [
    {
      title: "Total Siswa",
      value: stats.total_siswa,
      icon: "🎓",
    },
    {
      title: "Total Tentor",
      value: stats.total_tentor,
      icon: "👨‍🏫",
    },
    {
      title: "Kelas Hari Ini",
      value: stats.kelas_hari_ini,
      icon: "📚",
    },
    {
      title: "Pendaftaran Bulan Ini",
      value: stats.pendaftar_bulan_ini,
      icon: "📝",
    },
  ];

  const summaryData = [
    {
      label: "Pendaftaran Pending",
      value: notifications.filter((item) => item.tipe === "pendaftaran").length,
    },
    {
      label: "Pembayaran Pending",
      value: notifications.filter((item) => item.tipe === "pembayaran").length,
    },
    {
      label: "Notifikasi Aktif",
      value: notifications.length,
    },
    {
      label: "Update Data",
      value: "10s",
    },
  ];

  return (
    <div className="admin-container">
      <main className="main-content">
        {/* HEADER */}
        <section className="dashboard-header">
          <div>
            <span className="dashboard-label">Dashboard Admin</span>
            <h1>Selamat Datang 👋</h1>
            <p>
              Pantau aktivitas siswa, tentor, program, pembayaran, dan jadwal
              bimbel secara ringkas.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowEventModal(true)}
            >
              + Tambah Event
            </button>

            <button
              className="btn btn-outline"
              onClick={() => navigate("/program")}
            >
              Kelola Program
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/Kelola-Landingpage")}
            >
              Kelola Landing Page
            </button>
          </div>
        </section>

        {/* MODAL EVENT */}
        {showEventModal && (
          <EventModal onClose={() => setShowEventModal(false)} />
        )}

        {/* KPI */}
        <section className="kpi-container">
          {kpiData.map((item, index) => (
            <div className="kpi-card" key={index}>
              <div className="kpi-icon">{item.icon}</div>

              <div>
                <h2>{item.value}</h2>
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CONTENT */}
        <section className="dashboard-content">
          {/* NOTIFIKASI */}
          <div className="panel notification-panel">
            <div className="panel-header">
              <div>
                <h2>Notifikasi Terbaru</h2>
                <p>Aktivitas terbaru pada sistem bimbel.</p>
              </div>

              <span className="status-badge">Realtime</span>
            </div>

            <div className="notification-list">
              {loadingNotif ? (
                <div className="empty-notification">Memuat notifikasi...</div>
              ) : notifications.length === 0 ? (
                <div className="empty-notification">
                  Belum ada notifikasi terbaru.
                </div>
              ) : (
                notifications.map((notif, index) => (
                  <div
                    className="notification-item"
                    key={`${notif.tipe}-${notif.id}-${index}`}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notif.tipe)}
                    </div>

                    <div className="notification-info">
                      <h4>{notif.title}</h4>
                      <p>{notif.description}</p>
                    </div>

                    <span className="notification-time">
                      {getNotificationTime(notif.waktu)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RINGKASAN */}
          <div className="panel summary-panel">
            <div className="panel-header">
              <div>
                <h2>Ringkasan</h2>
                <p>Status penting hari ini.</p>
              </div>
            </div>

            <div className="summary-list">
              {summaryData.map((item, index) => (
                <div className="summary-item" key={index}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
