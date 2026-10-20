import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then((res) => {
        return res.json().then((data) => {
          if (!res.ok) throw new Error(data.message || "Login failed");
          return data;
        });
      })
      .then((data) => {
        onLogin(data.token, data.user);
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/menu");
        }
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div className="form-page">
      <h1>Account Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        {error && <p className="alert">{error}</p>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </label>

        <button type="submit" className="btn">
          Login
        </button>

        <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--muted)" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
