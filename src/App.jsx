import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";

const featuredPosts = [
  {
    title: "Menata Niat dalam Menuntut Ilmu",
    category: "Refleksi",
    excerpt:
      "Catatan singkat tentang menjaga keikhlasan, adab, dan arah perjalanan saat belajar.",
    readTime: "6 menit",
  },
  {
    title: "Teknologi sebagai Sarana Dakwah",
    category: "Teknologi",
    excerpt:
      "Bagaimana website, tulisan, dan media digital bisa dipakai dengan lebih bertanggung jawab.",
    readTime: "8 menit",
  },
  {
    title: "Membangun Ritme Menulis yang Konsisten",
    category: "Produktivitas",
    excerpt:
      "Sistem sederhana untuk menyimpan ide, merawat fokus, dan menerbitkan tulisan secara teratur.",
    readTime: "5 menit",
  },
];

const latestNotes = [
  "Tadabbur dan pelajaran ringkas dari bacaan harian.",
  "Esai pendek tentang pendidikan, karya, dan kehidupan muslim.",
  "Dokumentasi proyek digital yang sedang dibangun.",
];

function navigateTo(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleRoute = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handleRoute);
    return () => window.removeEventListener("popstate", handleRoute);
  }, []);

  return pathname;
}

function Header() {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigateTo("/")}>
        <span className="brand-mark">HS</span>
        <span>
          <strong>Hanifullah Syukri</strong>
          <small>Catatan, karya, dan pembelajaran</small>
        </span>
      </button>
      <nav className="site-nav">
        <a href="#tentang">Tentang</a>
        <a href="#tulisan">Tulisan</a>
        <a href="#kontak">Kontak</a>
        <button className="admin-link" onClick={() => navigateTo("/admin")}>
          Buka Admin
        </button>
      </nav>
    </header>
  );
}

function BlogHome() {
  return (
    <div className="site-shell">
      <Header />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">BLOG PRIBADI</p>
            <h1>Ruang digital untuk menulis hal-hal yang layak dijaga.</h1>
            <p className="hero-text">
              Blog ini disiapkan sebagai rumah untuk refleksi, pembelajaran Islam,
              eksperimen teknologi, dan catatan proses berkarya.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#tulisan">
                Baca Tulisan
              </a>
              <button className="secondary-button" onClick={() => navigateTo("/admin")}>
                Kelola Blog
              </button>
            </div>
          </div>

          <aside className="hero-panel">
            <p className="panel-label">Fokus Saat Ini</p>
            <ul>
              <li>Menulis lebih rutin dan lebih jernih.</li>
              <li>Menggabungkan dakwah, desain, dan web modern.</li>
              <li>Membangun arsip ide yang mudah diakses kembali.</li>
            </ul>
          </aside>
        </section>

        <section id="tentang" className="section-grid">
          <article className="story-card">
            <p className="section-label">Tentang</p>
            <h2>Hanifullah Syukri</h2>
            <p>
              Sebuah identitas blog yang hangat, tenang, dan terarah. Halaman ini
              bisa dikembangkan lagi menjadi profil pribadi, portofolio karya, dan
              pusat publikasi tulisan.
            </p>
          </article>

          <article className="quote-card">
            <p className="section-label">Prinsip</p>
            <blockquote>
              Menulis bukan hanya menyimpan pikiran, tetapi juga melatih kejernihan
              hati dan tanggung jawab atas kata-kata.
            </blockquote>
          </article>
        </section>

        <section id="tulisan" className="posts-section">
          <div className="section-heading">
            <div>
              <p className="section-label">Tulisan Unggulan</p>
              <h2>Artikel yang siap dikembangkan</h2>
            </div>
            <span className="pill">3 draft awal</span>
          </div>

          <div className="post-grid">
            {featuredPosts.map((post) => (
              <article key={post.title} className="post-card">
                <span className="pill">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <footer>
                  <span>{post.readTime}</span>
                  <a href="/">Baca nanti</a>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="notes-section">
          <div className="section-heading">
            <div>
              <p className="section-label">Format Konten</p>
              <h2>Jenis isi yang bisa langsung diisi</h2>
            </div>
          </div>
          <div className="notes-list">
            {latestNotes.map((note) => (
              <div key={note} className="note-item">
                <span className="note-index">0{latestNotes.indexOf(note) + 1}</span>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="kontak" className="site-footer">
        <div>
          <strong>Hanifullah Syukri</strong>
          <p>Blog lokal siap dikembangkan menjadi situs pribadi penuh.</p>
        </div>
        <button className="admin-link" onClick={() => navigateTo("/admin")}>
          Masuk Dashboard
        </button>
      </footer>
    </div>
  );
}

export default function App() {
  const pathname = usePathname();

  if (pathname === "/admin") {
    return <AdminDashboard />;
  }

  return <BlogHome />;
}
