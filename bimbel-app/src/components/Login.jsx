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

      console.log("EMAIL DIKIRIM:", email);

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
        alert(data.message);
        return;
      }

      localStorage.setItem("user_id", data.user?.id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.role === "admin") {
        window.location.href = "/dashboard-admin";
      } else if (data.role === "tentor") {
        window.location.href = "/dashboard-tentor";
      } else if (data.role === "siswa") {
        window.location.href = "/dashboard-siswa";
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
