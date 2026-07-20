import React from "react";
import { useNavigate } from "react-router-dom";
import "./KelolaLandingpage.css";

export default function LandingManagement() {
  const navigate = useNavigate();

  const menu = [
    {
      title: "Hero Section",
      icon: "🏠",
      route: "/landing/hero",
    },
    {
      title: "About Us",
      icon: "📖",
      route: "/landing/about",
    },
    {
      title: "Testimoni",
      icon: "⭐",
      route: "/landing/testimoni",
    },
    {
      title: "FAQ",
      icon: "❓",
      route: "/landing/faq",
    },
    {
      title: "Kontak",
      icon: "📞",
      route: "/landing/kontak",
    },
    {
      title: "Galeri",
      icon: "🖼️",
      route: "/landing/galeri",
    },
  ];

  return (
    <div className="landing-management">
      <h1>Kelola Landing Page</h1>

      <div className="landing-grid">
        {menu.map((item) => (
          <div
            key={item.title}
            className="landing-card"
            onClick={() => navigate(item.route)}
          >
            <div className="landing-icon">{item.icon}</div>

            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
