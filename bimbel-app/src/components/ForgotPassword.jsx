import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      alert(data.message);
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Lupa Password</h2>

        <input
          type="email"
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleSubmit}>Kirim Link Reset</button>
      </div>
    </div>
  );
}
