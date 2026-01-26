// Login modal component

import React, { useState } from "react";
import { setCSRFToken } from "../../../../hooks";
import { buttonStyles } from "../../../../styles";
import { styles } from "./style";

interface LoginModalProps {
  onLogin: () => void;
}

export function LoginModal({ onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const csrfToken = res.headers.get("X-CSRF-Token");
        if (csrfToken) setCSRFToken(csrfToken);
        onLogin();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div style={styles.modal}>
        <h2 id="login-title" style={styles.title}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
              autoComplete="username"
              aria-required="true"
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              autoComplete="current-password"
              aria-required="true"
            />
          </div>
          {error && (
            <div style={styles.error} role="alert">
              Invalid username or password
            </div>
          )}
          <button type="submit" style={{ ...buttonStyles.btn, width: "100%" }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
