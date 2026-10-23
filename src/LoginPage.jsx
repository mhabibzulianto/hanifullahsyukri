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

export default function LoginPage({ authError = "", isSubmitting = false, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!onLogin) {
      navigateTo("/admin");
      return;
    }

    await onLogin({
      email,
      password,
      remember,
    });
  }

  return (
    <div
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        minHeight: "100vh",
        display: "flex",
        background: "#f8fafc",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .login-page * { box-sizing: border-box; }
        .login-page input { font-family: inherit; }
        .login-page button { font-family: inherit; cursor: pointer; }
        .login-input {
          width: 100%;
          padding: 12px 14px;
          font-size: 14px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
          background: #fff;
          color: #111827;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .login-input:focus {
          border-color: #16213e;
          box-shadow: 0 0 0 3px rgba(22, 33, 62, 0.08);
        }
        .login-input::placeholder { color: #9ca3af; }
        .login-primary {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          letter-spacing: 0.01em;
          transition: transform 0.1s, opacity 0.15s;
        }
        .login-primary:hover { opacity: 0.92; }
        .login-primary:active { transform: scale(0.99); }
        .login-link {
          color: #16213e;
          font-weight: 700;
          text-decoration: none;
        }
        .login-link:hover { text-decoration: underline; }
        @media (max-width: 900px) {
          .login-split {
            flex-direction: column;
          }
          .login-panel {
            width: 100% !important;
          }
          .login-brand-panel {
            min-height: 42vh;
            padding: 32px 24px !important;
          }
          .login-form-panel {
            padding: 32px 20px !important;
          }
        }
      `}</style>

      <div className="login-page login-split" style={{ display: "flex", width: "100%" }}>
        <div
          className="login-panel login-brand-panel"
          style={{
            width: "50%",
            background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 58%, #0f3460 100%)",
            padding: "40px 48px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.05)",
              left: -120,
              bottom: -120,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 260,
              height: 260,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.04)",
              left: 72,
              bottom: 56,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>HS</span>
            </div>
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 17 }}>
              Hanifullah Syukri
            </span>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.52)",
                  fontSize: 13,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Admin Login
              </p>
              <h1
                style={{
                  color: "#fff",
                  fontSize: "clamp(2.3rem, 4vw, 3.2rem)",
                  fontWeight: 700,
                  lineHeight: 1.12,
                  letterSpacing: "-0.03em",
                  margin: "14px 0 16px",
                  maxWidth: 420,
                }}
              >
                Kelola blog Anda dengan tenang dan terarah.
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.62)",
                  fontSize: 15,
                  lineHeight: 1.75,
                  maxWidth: 360,
                }}
              >
                Masuk untuk mengakses dasbor, mengatur artikel, mengelola media, dan
                menjaga percakapan dengan pembaca tetap rapi.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 12 }}>
              Copyright 2026 Hanifullah Syukri
            </span>
            <button
              onClick={() => navigateTo("/")}
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.78)",
                borderRadius: 999,
                padding: "10px 14px",
                fontSize: 12.5,
              }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>

        <div
          className="login-panel login-form-panel"
          style={{
            width: "50%",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 32px",
          }}
        >
          <div style={{ width: "100%", maxWidth: 390 }}>
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "-0.03em",
                }}
              >
                Selamat Datang
              </h2>
              <p style={{ margin: "10px 0 0", fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>
                Masukkan email dan kata sandi Anda untuk membuka panel admin.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
              <div>
                <label
                  htmlFor="login-email"
                  style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 6 }}
                >
                  Email
                </label>
                <input
                  id="login-email"
                  className="login-input"
                  type="email"
                  placeholder="admin@hanifullahsyukri.id"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 6 }}
                >
                  Kata Sandi
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    className="login-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      color: "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                      padding: 2,
                    }}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    fontSize: 13.5,
                    color: "#374151",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    style={{ width: 15, height: 15, accentColor: "#16213e" }}
                  />
                  Ingat Saya
                </label>
                <a href="/" className="login-link" onClick={(event) => event.preventDefault()}>
                  Lupa Kata Sandi?
                </a>
              </div>

              {authError ? (
                <div
                  style={{
                    borderRadius: 10,
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                    color: "#b42318",
                    padding: "12px 14px",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                  }}
                >
                  {authError}
                </div>
              ) : null}

              <button
                type="submit"
                className="login-primary"
                style={{ marginTop: 4, opacity: isSubmitting ? 0.8 : 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Masuk"}
              </button>

              <p style={{ margin: 0, textAlign: "center", fontSize: 13.5, color: "#6b7280" }}>
                Belum punya akun?{" "}
                <a href="/" className="login-link" onClick={(event) => event.preventDefault()}>
                  Hubungi administrator
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
