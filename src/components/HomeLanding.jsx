"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Menu, Search, X } from "lucide-react";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";

const fallbackPosts = [
  { id: "focus", title: "Hidup yang Lebih Jernih di Tengah Dunia yang Bising", topic: "Refleksi", excerpt: "Refleksi tentang menjaga fokus, merawat hal-hal yang penting, dan menjalani hidup dengan lebih bermakna di tengah banyaknya distraksi.", published_at: "2025-04-12T00:00:00.000Z" },
  { id: "less", title: "Seni Melakukan Lebih Sedikit, tapi Lebih Bermakna", topic: "Produktivitas", excerpt: "Produktivitas bukan tentang melakukan sebanyak mungkin, melainkan memilih dengan sadar apa yang benar-benar penting.", published_at: "2025-04-10T00:00:00.000Z" },
  { id: "tool", title: "Teknologi adalah Alat, Bukan Tujuan", topic: "Teknologi", excerpt: "Tentang memakai teknologi untuk membantu kita berkarya tanpa kehilangan arah dan perhatian.", published_at: "2025-04-03T00:00:00.000Z" },
  { id: "writing", title: "Menulis untuk Memahami Diri Sendiri", topic: "Menulis", excerpt: "Menulis bukan sekadar mencatat, tetapi cara untuk berpikir lebih dalam dan mengenal diri dengan lebih jujur.", published_at: "2025-03-28T00:00:00.000Z" },
];
const fallbackSettings = {
  featured_post_id: "focus",
  quote_text: "Tulisan yang baik tidak hanya selesai dibaca. Ia tinggal lebih lama di dalam cara kita melihat hidup.",
  quote_reference: "Hanifullah Syukri — Catatan Editorial",
};
const formatDate = (value) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

function Brand() {
  return (
    <a className="home-brand" href="#top" aria-label="Hanifullah Syukri, beranda">
      <img
        src="/images/hanifullah-syukri-logo-header.png"
        width="640"
        height="164"
        alt="Hanifullah Syukri"
      />
    </a>
  );
}

export default function HomeLanding() {
  const [posts, setPosts] = useState(fallbackPosts);
  const [settings, setSettings] = useState(fallbackSettings);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    let active = true;
    async function loadHomepage() {
      const supabase = getSupabaseClient();
      const [{ data: postData }, { data: settingData }] = await Promise.all([
        supabase.from("posts").select("id,title,slug,topic,excerpt,published_at,updated_at").eq("status", "published").order("published_at", { ascending: false }).limit(12),
        supabase.from("homepage_settings").select("*").eq("id", "main").maybeSingle(),
      ]);
      if (!active) return;
      if (postData?.length) setPosts(postData);
      if (settingData) setSettings({ ...fallbackSettings, ...settingData });
    }
    loadHomepage();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.body.style.overflow = searchOpen || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, menuOpen]);

  const featured = posts.find((post) => post.id === settings.featured_post_id) || posts[0];
  const latest = posts.filter((post) => post.id !== featured?.id).slice(0, 3);
  const visiblePosts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("id");
    return term ? posts.filter((post) => `${post.title} ${post.topic || ""} ${post.excerpt || ""}`.toLocaleLowerCase("id").includes(term)) : posts;
  }, [posts, query]);

  return (
    <div className="home-site" id="top">
      <a className="home-skip" href="#main-content">Langsung ke konten</a>
      <header className="home-header home-container">
        <Brand />
        <nav className="home-nav" aria-label="Navigasi utama">
          <a className="is-active" href="#top">Beranda</a><a href="#latest">Tulisan</a><a href="#categories">Kategori</a><a href="#footer">Tentang</a>
        </nav>
        <div className="home-actions">
          <button className="home-icon-button" onClick={() => setSearchOpen(true)} aria-label="Cari tulisan"><Search size={20} /></button>
          <a className="home-subscribe" href="mailto:hello@hanifullahsyukri.com">Berlangganan</a>
          <button className="home-menu-button" onClick={() => setMenuOpen(true)} aria-label="Buka menu"><Menu size={24} /></button>
        </div>
      </header>

      <main id="main-content" className="home-layout home-container">
        <div className="home-main-column">
          <section className="home-hero">
            <p className="home-eyebrow">Tulisan pilihan</p>
            <h1>{featured?.title}</h1>
            <p className="home-dek">{featured?.excerpt}</p>
            <div className="home-hero-footer">
              <a className="home-primary" href="#latest">Baca selengkapnya <ArrowRight size={17} /></a>
              <p className="home-meta"><span>Oleh Hanifullah Syukri</span><span>{formatDate(featured?.published_at || featured?.updated_at)}</span><span>8 menit baca</span></p>
            </div>
          </section>

          <section className="home-latest" id="latest">
            <div className="home-section-heading"><h2>Tulisan terbaru</h2><button onClick={() => setSearchOpen(true)}>Lihat semua tulisan <ArrowRight size={15} /></button></div>
            <div className="home-article-list">
              {latest.map((post, index) => (
                <article className="home-article-row" key={post.id}>
                  <div><span>{post.topic || "Catatan"}</span><h3>{post.title}</h3><p>{post.excerpt}</p></div>
                  <p className="home-meta"><span>{formatDate(post.published_at || post.updated_at)}</span><span>{5 + index} menit baca</span></p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="home-sidebar" aria-label="Jelajahi tulisan">
          <button className="home-search-trigger" onClick={() => setSearchOpen(true)}><Search size={19} /><span>Cari tulisan...</span></button>
          <section id="categories">
            <div className="home-side-heading"><h2>Kategori</h2><button onClick={() => setSearchOpen(true)}>Lihat semua <ArrowRight size={14} /></button></div>
            <ul className="home-category-list">
              {["Refleksi", "Produktivitas", "Teknologi", "Menulis", "Pengembangan diri", "Kehidupan"].map((item, index) => <li key={item}><span>{item}</span><span>{[28, 24, 19, 16, 12, 9][index]}</span></li>)}
            </ul>
          </section>
          <section className="home-popular">
            <h2>Tulisan populer</h2>
            <ul>{posts.slice(0, 5).map((post) => <li key={post.id}><span>{post.title}</span><time>{formatDate(post.published_at || post.updated_at)}</time></li>)}</ul>
          </section>
        </aside>
      </main>

      <section className="home-quote-section home-container" aria-label="Quote pilihan">
        <figure className="home-quote-card">
          <span className="home-quote-mark" aria-hidden="true">“</span>
          <blockquote>{settings.quote_text}</blockquote>
          <figcaption>— {settings.quote_reference}</figcaption>
        </figure>
      </section>

      <footer className="home-footer home-container" id="footer">
        <div><Brand /><p>Catatan, karya, dan pembelajaran.</p></div>
        <nav aria-label="Navigasi footer"><a href="#latest">Tulisan</a><a href="#categories">Kategori</a><a href="/login">Admin</a></nav>
        <p>© {new Date().getFullYear()} Hanifullah Syukri</p>
      </footer>

      {menuOpen && <div className="home-mobile-menu" role="dialog" aria-modal="true" aria-label="Menu navigasi"><button onClick={() => setMenuOpen(false)} aria-label="Tutup menu"><X size={25} /></button><nav><a href="#top" onClick={() => setMenuOpen(false)}>Beranda</a><a href="#latest" onClick={() => setMenuOpen(false)}>Tulisan</a><a href="#categories" onClick={() => setMenuOpen(false)}>Kategori</a><a href="#footer" onClick={() => setMenuOpen(false)}>Tentang</a></nav></div>}
      {searchOpen && <div className="home-search-overlay" role="dialog" aria-modal="true" aria-label="Pencarian tulisan" id="search"><button onClick={() => setSearchOpen(false)} aria-label="Tutup pencarian"><X size={25} /></button><div><label htmlFor="home-search-input">Cari dalam jurnal</label><input id="home-search-input" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ketik kata kunci…" /><ul>{visiblePosts.slice(0, 6).map((post) => <li key={post.id}><span>{post.title}</span><small>{post.topic}</small></li>)}</ul></div></div>}
    </div>
  );
}
