export default function LoadingScreen({ message }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background:
          "radial-gradient(circle at top left, rgba(184, 212, 255, 0.7), transparent 32%), radial-gradient(circle at bottom right, rgba(255, 231, 196, 0.75), transparent 28%), linear-gradient(180deg, #f7f4ec 0%, #fcfbf7 100%)",
      }}
    >
      <div
        style={{
          width: "min(460px, 100%)",
          padding: 28,
          borderRadius: 24,
          border: "1px solid rgba(16, 24, 40, 0.08)",
          background: "rgba(255, 252, 247, 0.9)",
          boxShadow: "0 24px 60px rgba(103, 74, 31, 0.08)",
          textAlign: "center",
          fontFamily: "'Trebuchet MS', sans-serif",
        }}
      >
        <p style={{ margin: 0, color: "#9a6b2f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Supabase Auth
        </p>
        <h1 style={{ margin: "10px 0 8px", fontSize: 28, color: "#111827", fontFamily: "Georgia, 'Times New Roman', serif" }}>
          Menyiapkan sesi Anda
        </h1>
        <p style={{ margin: 0, color: "#475467", lineHeight: 1.7 }}>{message}</p>
      </div>
    </div>
  );
}
