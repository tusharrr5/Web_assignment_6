import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    })
      .then((res) => {
        return res.json().then((data) => {
          if (!res.ok) throw new Error(data.message || "Registration failed");
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
      <h1>Register Account</h1>
      <form className="form" onSubmit={handleSubmit}>
        {error && <p className="alert">{error}</p>}

        <label>
          Full Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. rahul@gmail.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password"
            required
          />
        </label>

        <label>
          Select Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="admin">Staff / Admin</option>
          </select>
        </label>

        <button type="submit" className="btn">
          Create Account
        </button>

        <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--muted)" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
