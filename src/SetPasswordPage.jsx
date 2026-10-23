"use client";

import React, { useState } from "react";

function navigateTo(path) {
  window.location.assign(path);
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function SetPasswordPage({
  session,
  authError = "",
  authSuccess = "",
  isSubmitting = false,
  onSubmit,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError("");

    if (password.length < 8) {
      setLocalError("Password minimal harus 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Konfirmasi password belum cocok.");
      return;
    }

    await onSubmit?.(password);
  }

  const visibleError = localError || authError;
  const email = session?.user?.email || "akun Anda";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background:
          "radial-gradient(circle at top left, rgba(184, 212, 255, 0.7), transparent 32%), radial-gradient(circle at bottom right, rgba(255, 231, 196, 0.75), transparent 28%), linear-gradient(180deg, #f7f4ec 0%, #fcfbf7 100%)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .set-password-shell * { box-sizing: border-box; }
        .set-password-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          outline: none;
          font: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .set-password-input:focus {
          border-color: #16213e;
          box-shadow: 0 0 0 3px rgba(22, 33, 62, 0.08);
        }
        .set-password-button {
          width: 100%;
          padding: 13px 16px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          color: white;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>

      <div
        className="set-password-shell"
        style={{
          width: "min(560px, 100%)",
          borderRadius: 30,
          border: "1px solid rgba(16, 24, 40, 0.08)",
          background: "rgba(255, 252, 247, 0.92)",
          boxShadow: "0 24px 60px rgba(103, 74, 31, 0.08)",
          padding: 32,
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#9a6b2f",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Undangan Admin
        </p>
        <h1
          style={{
            margin: "10px 0 8px",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            lineHeight: 1.05,
            color: "#111827",
          }}
        >
          Buat password baru untuk masuk.
        </h1>
        <p style={{ margin: 0, color: "#475467", lineHeight: 1.7 }}>
          Link email Anda sudah membuka sesi untuk <strong>{email}</strong>. Sekarang tinggal
          tetapkan password baru agar akun siap dipakai.
        </p>

        {!session ? (
          <div
            style={{
              marginTop: 24,
              borderRadius: 18,
              border: "1px solid #fed7aa",
              background: "#fff7ed",
              padding: 18,
              color: "#9a3412",
            }}
          >
            Sesi undangan tidak ditemukan atau sudah kedaluwarsa. Coba buka ulang link dari email
            terbaru, atau minta undangan baru dari admin.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 26, display: "grid", gap: 18 }}>
            <div>
              <label
                htmlFor="new-password"
                style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600 }}
              >
                Password Baru
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="new-password"
                  className="set-password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimal 8 karakter"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 12,
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#667085",
                    cursor: "pointer",
                  }}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600 }}
              >
                Konfirmasi Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirm-password"
                  className="set-password-input"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Ulangi password baru"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 12,
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#667085",
                    cursor: "pointer",
                  }}
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
            </div>

            {visibleError ? (
              <div
                style={{
                  borderRadius: 14,
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                  color: "#b42318",
                  padding: "14px 16px",
                  lineHeight: 1.6,
                }}
              >
                {visibleError}
              </div>
            ) : null}

            {authSuccess ? (
              <div
                style={{
                  borderRadius: 14,
                  border: "1px solid #bbf7d0",
                  background: "#f0fdf4",
                  color: "#166534",
                  padding: "14px 16px",
                  lineHeight: 1.6,
                }}
              >
                {authSuccess}
              </div>
            ) : null}

            <button type="submit" className="set-password-button" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan password..." : "Simpan Password"}
            </button>
          </form>
        )}

        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => navigateTo("/login")}
            style={{
              border: "1px solid #d0d5dd",
              background: "white",
              borderRadius: 999,
              padding: "10px 14px",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Kembali ke Login
          </button>
          <span style={{ color: "#667085", fontSize: 13, alignSelf: "center" }}>
            Copyright 2026 Hanifullah Syukri
          </span>
        </div>
      </div>
    </div>
  );
}
