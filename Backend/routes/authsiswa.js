import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login gagal!");
        return;
      }

      // Simpan token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirect sesuai role
      if (data.role === "admin") {
        window.location.href = "/dashboard-admin";
      } else if (data.role === "tentor") {
        window.location.href = "/dashboard-tentor";
      } else {
        window.location.href = "/dashboard-siswa";
      }
    } catch (error) {
      console.error(error);
      alert("Tidak bisa terhubung ke server!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-login" onClick={handleLogin}>
          Masuk
        </button>
      </div>
    </div>
  );
}
