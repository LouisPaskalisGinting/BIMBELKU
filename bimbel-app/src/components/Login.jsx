import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
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

      // hapus data lama agar tidak bentrok
      localStorage.removeItem("user");
      localStorage.removeItem("siswa");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");

      // simpan data umum user
      localStorage.setItem("user_id", data.user?.id || "");
      localStorage.setItem("role", data.role || "");
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      // simpan data siswa hanya jika benar-benar ada
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
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p
          style={{
            marginTop: "10px",
            color: "blue",
            cursor: "pointer",
          }}
          onClick={() => {
            window.location.href = "/forgot-password";
          }}
        >
          Lupa Password?
        </p>

        <button onClick={handleLogin}>Masuk</button>
      </div>
    </div>
  );
}
