import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Untuk tombol see / hide password
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        alert("Email dan password wajib diisi!");
        return;
      }

      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      console.log("DATA LOGIN:", data);

      if (!res.ok) {
        alert(data.message || "Login gagal");
        return;
      }

      // Hapus data lama agar tidak bentrok
      localStorage.removeItem("user");
      localStorage.removeItem("siswa");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");

      // Simpan data umum user
      localStorage.setItem("user_id", data.user?.id || "");
      localStorage.setItem("role", data.role || "");
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      // Simpan data siswa jika role siswa
      if (data.role === "siswa" && data.siswa) {
        localStorage.setItem("siswa", JSON.stringify(data.siswa));
      }

      if (data.role === "admin") {
        window.location.href = "/dashboard-admin";
      } else if (data.role === "tentor") {
        window.location.href = "/dashboard-tentor";
      } else if (data.role === "siswa") {
        window.location.href = "/dashboard-siswa";
      } else {
        alert("Role tidak dikenali");
      }
    } catch (error) {
      console.error("ERROR LOGIN:", error);
      alert("Tidak bisa terhubung ke server!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                // ICON MATA TERTUTUP
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12a18.45 18.45 0 0 1 5.06-6.94" />
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                  <path d="M1 1l22 22" />
                </svg>
              ) : (
                // ICON MATA TERBUKA
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <p
            className="forgot-password"
            onClick={() => {
              window.location.href = "/forgot-password";
            }}
          >
            Lupa Password?
          </p>

          <button type="submit" className="login-submit-btn">
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
