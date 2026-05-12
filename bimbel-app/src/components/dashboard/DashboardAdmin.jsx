import React, { useState } from "react";
import "./DashboardAdmin.css";
import { useNavigate } from "react-router-dom";
import EventModal from "./EventModal";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [showEventModal, setShowEventModal] = useState(false);

  return (
    <div className="admin-container">
      <main className="main-content">
        <h1>Dashboard</h1>

        {/* TOMBOL EVENT */}
        <button className="btn-event" onClick={() => setShowEventModal(true)}>
          + Tambah Event
        </button>

        {/* MODAL EVENT */}
        {showEventModal && (
          <EventModal onClose={() => setShowEventModal(false)} />
        )}

        {/* TOMBOL PROGRAM */}
        <div className="dashboard-button">
          <button className="btn-program" onClick={() => navigate("/program")}>
            📚 Kelola Program
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="kpi-container">
          <div className="kpi-card">
            <h2>200</h2>
            <p>Total Siswa</p>
          </div>

          <div className="kpi-card">
            <h2>20</h2>
            <p>Total Tentor</p>
          </div>

          <div className="kpi-card">
            <h2>7</h2>
            <p>Kelas Hari Ini</p>
          </div>

          <div className="kpi-card highlight">
            <h2>35</h2>
            <p>Total Pendaftaran Bulan Ini</p>
          </div>
        </div>

        {/* NOTIFIKASI */}
        <section className="notification-section">
          <h2>Notifikasi</h2>

          <div className="notification-list">
            <div className="notif-item">
              <span>🔔 Madya baru saja mendaftar</span>
            </div>

            <div className="notif-item">
              <span>🔔 Rizky baru saja membayar</span>
            </div>

            <div className="notif-item">
              <span>🔔 Tentor Budi baru saja mengisi absensi</span>
            </div>

            <div className="notif-item">
              <span>🔔 Kelas Matematika baru saja dimulai</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
