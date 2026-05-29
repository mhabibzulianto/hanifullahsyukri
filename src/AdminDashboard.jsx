import { useState } from "react";

const NAV_GROUPS = [
  {
    items: [
      { id: "dasbor", label: "Dasbor", icon: LayoutDashboard },
      { id: "artikel", label: "Artikel", icon: FileText },
      { id: "media", label: "Media", icon: Image },
    ],
  },
  {
    label: "Pembaca",
    items: [{ id: "komentar", label: "Komentar", icon: MessageSquare }],
  },
  {
    label: "Setting",
    items: [
      { id: "halaman-utama", label: "Halaman Utama", icon: Home },
      { id: "tentang", label: "Tentang", icon: Info },
      { id: "kontak", label: "Kontak", icon: Mail },
    ],
  },
];

function LayoutDashboard({ size = 16, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function FileText({ size = 16, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function Image({ size = 16, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function MessageSquare({ size = 16, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function Home({ size = 16, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function Info({ size = 16, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function Mail({ size = 16, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function User({ size = 16, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogOut({ size = 16, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function ChevronDown({ size = 14, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Menu({ size = 20, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function Bell({ size = 18, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function Users({ size = 20, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Eye({ size = 20, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DasborPage() {
  const stats = [
    { label: "Total Artikel", value: "12", change: "+3", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Pembaca", value: "8.7K", change: "+18%", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Komentar Baru", value: "21", change: "+7", icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Tampilan Hari Ini", value: "1,284", change: "+11%", icon: Eye, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  const recentArticles = [
    { title: "Menata Niat dalam Menuntut Ilmu", author: "Hanifullah Syukri", views: "1.2K", date: "2 jam lalu", status: "Terbit" },
    { title: "Catatan Tadabbur: Surah Al-Mulk", author: "Hanifullah Syukri", views: "876", date: "5 jam lalu", status: "Terbit" },
    { title: "Membangun Kebiasaan Menulis Harian", author: "Hanifullah Syukri", views: "543", date: "1 hari lalu", status: "Draf" },
    { title: "Teknologi sebagai Sarana Dakwah", author: "Hanifullah Syukri", views: "2.1K", date: "2 hari lalu", status: "Terbit" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dasbor</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ringkasan aktivitas blog Hanifullah Syukri.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className={`${stat.bg} ${stat.color} rounded-lg p-3`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs font-medium text-emerald-600">{stat.change} bulan ini</p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-800">Artikel Terbaru</h2>
          <button className="text-xs font-medium text-blue-600 hover:underline">Lihat semua</button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentArticles.map((article) => (
            <div
              key={article.title}
              className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-gray-50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{article.title}</p>
                <p className="text-xs text-gray-400">{article.author} • {article.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Eye size={13} />
                  {article.views}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    article.status === "Terbit"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {article.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <FileText size={28} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600">Belum ada konten</p>
        <p className="mt-1 text-xs text-gray-400">Halaman ini sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}

const PAGE_CONTENT = {
  dasbor: () => <DasborPage />,
  artikel: () => <PlaceholderPage title="Artikel" description="Kelola seluruh tulisan blog." />,
  media: () => <PlaceholderPage title="Media" description="Kelola gambar, ilustrasi, dan dokumen." />,
  komentar: () => <PlaceholderPage title="Komentar" description="Moderasi komentar dari pembaca." />,
  "halaman-utama": () => (
    <PlaceholderPage
      title="Halaman Utama"
      description="Atur hero, artikel unggulan, dan CTA di beranda."
    />
  ),
  tentang: () => <PlaceholderPage title="Tentang" description="Edit profil dan cerita singkat penulis." />,
  kontak: () => <PlaceholderPage title="Kontak" description="Kelola informasi kontak dan formulir." />,
  profil: () => <PlaceholderPage title="Profil" description="Atur akun admin Hanifullah Syukri." />,
};

export default function AdminDashboard() {
  const [active, setActive] = useState("dasbor");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const ActivePage = PAGE_CONTENT[active] || PAGE_CONTENT.dasbor;

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Geist', system-ui, sans-serif",
        minHeight: "100vh",
        background: "#f8f9fb",
        display: "flex",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e5ea; border-radius: 4px; }
        button { cursor: pointer; border: none; background: none; font-family: inherit; }
      `}</style>

      <aside
        style={{
          width: sidebarOpen ? 240 : 0,
          minWidth: sidebarOpen ? 240 : 0,
          background: "#ffffff",
          borderRight: "1px solid #eaecf0",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease",
          overflow: "hidden",
          height: "100vh",
          position: "sticky",
          top: 0,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "18px 16px 14px",
            borderBottom: "1px solid #f2f4f7",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>H</span>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.2 }}>
              Admin Blog
            </p>
            <p style={{ fontSize: 11, color: "#9ca3af" }}>Hanifullah Syukri</p>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
          {NAV_GROUPS.map((group, groupIndex) => (
            <div key={groupIndex} style={{ marginBottom: 20 }}>
              {group.label ? (
                <p
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "0 8px",
                    marginBottom: 4,
                  }}
                >
                  {group.label}
                </p>
              ) : null}
              {group.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "7px 10px",
                      borderRadius: 7,
                      fontSize: 13.5,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#111827" : "#6b7280",
                      background: isActive ? "#f3f4f6" : "transparent",
                      marginBottom: 1,
                      transition: "all 0.15s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(event) => {
                      if (!isActive) event.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(event) => {
                      if (!isActive) event.currentTarget.style.background = "transparent";
                    }}
                  >
                    <item.icon size={16} />
                    {item.label}
                    {isActive ? (
                      <div
                        style={{
                          marginLeft: "auto",
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: "#111827",
                        }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid #f2f4f7", padding: "10px" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 10px",
                borderRadius: 8,
                background: profileOpen ? "#f3f4f6" : "transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={(event) => {
                if (!profileOpen) event.currentTarget.style.background = "#f9fafb";
              }}
              onMouseLeave={(event) => {
                if (!profileOpen) event.currentTarget.style.background = "transparent";
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>HS</span>
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>
                  Hanifullah Syukri
                </p>
                <p style={{ fontSize: 11, color: "#9ca3af" }}>admin@hanifullahsyukri.id</p>
              </div>
              <ChevronDown
                size={14}
                style={{
                  color: "#9ca3af",
                  transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {profileOpen ? (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  background: "white",
                  border: "1px solid #eaecf0",
                  borderRadius: 10,
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}
              >
                <button
                  onClick={() => {
                    setActive("profil");
                    setProfileOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "9px 12px",
                    fontSize: 13,
                    color: "#374151",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "transparent";
                  }}
                >
                  <User size={15} /> Profil
                </button>
                <div style={{ height: 1, background: "#f2f4f7" }} />
                <button
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "9px 12px",
                    fontSize: 13,
                    color: "#dc2626",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = "#fef2f2";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "transparent";
                  }}
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            height: 56,
            background: "white",
            borderBottom: "1px solid #eaecf0",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ padding: 6, borderRadius: 7, color: "#6b7280", display: "flex" }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "transparent";
            }}
          >
            <Menu size={18} />
          </button>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f9fafb",
                border: "1px solid #eaecf0",
                borderRadius: 8,
                padding: "6px 12px",
                maxWidth: 280,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>Cari sesuatu...</span>
            </div>
          </div>

          <button
            style={{ position: "relative", padding: 7, borderRadius: 8, color: "#6b7280", display: "flex" }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "transparent";
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                background: "#ef4444",
                borderRadius: "50%",
                border: "1.5px solid white",
              }}
            />
          </button>

          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>HS</span>
          </div>
        </header>

        <main
          style={{ flex: 1, padding: "28px", overflowY: "auto" }}
          onClick={() => {
            if (profileOpen) setProfileOpen(false);
          }}
        >
          <ActivePage />
        </main>
      </div>
    </div>
  );
}
