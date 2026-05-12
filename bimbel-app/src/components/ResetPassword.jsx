import { useParams } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");

  const handleReset = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      alert(data.message);

      if (res.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="Password Baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleReset}>Reset Password</button>
      </div>
    </div>
  );
}
