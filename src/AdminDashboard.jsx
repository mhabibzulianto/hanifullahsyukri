"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  ImageIcon,
  Info,
  LogOut,
  Mail,
  MessageSquareText,
  MonitorSmartphone,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { getSupabaseClient } from "./lib/supabase";
import "./components/dashboard/dashboard.css";

const groups = [
  {
    items: [
      { id: "dasbor", label: "Beranda", icon: Home },
      { id: "artikel", label: "Artikel", icon: FileText },
      { id: "media", label: "Media", icon: ImageIcon },
    ],
  },
  {
    label: "Pembaca",
    items: [{ id: "komentar", label: "Komentar", icon: MessageSquareText }],
  },
  {
    label: "Setting",
    items: [
      { id: "halaman-utama", label: "Halaman utama", icon: MonitorSmartphone },
      { id: "tentang", label: "Tentang", icon: Info },
      { id: "kontak", label: "Kontak", icon: Mail },
    ],
  },
];
const labels = { draft: "Draft", published: "Terbit" };
const date = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Jakarta",
      }).format(new Date(value))
    : "—";

function RichContent({ value }) {
  if (value?.type === "doc") return <RichContent value={value.content || []} />;
  if (!Array.isArray(value))
    return <p>Isi artikel belum tersedia dalam format preview.</p>;
  return value.map((node, index) => {
    if (!node || typeof node !== "object") return null;
    if (typeof node.text === "string") {
      let text = node.text;
      if (node.bold) text = <strong>{text}</strong>;
      if (node.italic) text = <em>{text}</em>;
      if (node.underline) text = <u>{text}</u>;
      if (node.strikethrough) text = <s>{text}</s>;
      if (node.code) text = <code>{text}</code>;
      for (const mark of node.marks || []) {
        if (mark.type === "bold") text = <strong>{text}</strong>;
        if (mark.type === "italic") text = <em>{text}</em>;
        if (mark.type === "underline") text = <u>{text}</u>;
        if (mark.type === "strike") text = <s>{text}</s>;
      }
      return <span key={index}>{text}</span>;
    }
    const tiptapTags = { paragraph: "p", heading: `h${Math.min(6, Math.max(2, node.attrs?.level || 2))}`, bulletList: "ul", orderedList: "ol", listItem: "li", pullQuote: "blockquote", marginalia: "aside", arabicBlock: "div", quranBlock: "blockquote" };
    if (node.type === "footnote") return <sup key={index} title={node.attrs?.text}>*</sup>;
    if (node.type === "hardBreak") return <br key={index} />;
    if (node.type === "horizontalRule") return <hr key={index} />;
    if (["image", "video", "audio", "document", "youtube"].includes(node.type)) return <p key={index}>[{node.type}: {node.attrs?.alt || node.attrs?.filename || node.attrs?.src}]</p>;
    const Tag = tiptapTags[node.type] || ([
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "ul",
      "ol",
      "li",
    ].includes(node.type)
      ? node.type
      : "p");
    return (
      <Tag key={index} dir={["arabicBlock", "quranBlock"].includes(node.type) ? "rtl" : undefined}>
        <RichContent value={node.content || node.children || []} />
      </Tag>
    );
  });
}
function Heading({ title, description, onCreate }) {
  return (
    <header className="hs-heading">
      <div>
        <p className="hs-kicker">RUANG REDAKSI</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {onCreate && (
        <button className="hs-primary" onClick={onCreate}>
          <Plus size={17} />
          Artikel baru
        </button>
      )}
    </header>
  );
}

export default function AdminDashboard({
  currentUser,
  onLogout,
  isLoggingOut = false,
  onCreateArticle,
}) {
  const [active, setActive] = useState("dasbor");
  const [articles, setArticles] = useState([]);
  const [localDraft, setLocalDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState(null);
  const [homepageSettings, setHomepageSettings] = useState({
    featured_post_id: "",
    quote_text:
      "Tulisan yang baik tidak hanya selesai dibaca. Ia tinggal lebih lama di dalam cara kita melihat hidup.",
    quote_reference: "Hanifullah Syukri — Catatan Editorial",
  });
  const [homepageSaving, setHomepageSaving] = useState(false);
  const [homepageMessage, setHomepageMessage] = useState("");
  const menuRef = useRef(null);
  const previewRef = useRef(null);
  const previewTriggerRef = useRef(null);
  const displayName =
    currentUser?.user_metadata?.full_name || "Hanifullah Syukri";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const saved = window.localStorage.getItem("hs-admin-active-tab");
    if (
      [
        ...groups.flatMap((group) => group.items.map((item) => item.id)),
        "profil",
      ].includes(saved)
    )
      setActive(saved);
    try {
      const draft = JSON.parse(
        window.sessionStorage.getItem("hs-editor-draft") || "null",
      );
      if (draft?.title || draft?.body?.replace(/<[^>]*>/g, "").trim())
        setLocalDraft(draft);
    } catch {
      /* A malformed browser draft must not prevent loading the dashboard. */
    }
  }, []);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data, error: loadError } = await getSupabaseClient()
          .from("posts")
          .select(
            "id,title,slug,topic,excerpt,status,updated_at,created_at,content,tags,main_image_url",
          )
          .eq("author_id", currentUser.id)
          .order("updated_at", { ascending: false });
        if (loadError) throw loadError;
        if (!cancelled) setArticles(data || []);
      } catch {
        if (!cancelled)
          setError(
            "Artikel belum dapat dimuat. Periksa koneksi, lalu coba lagi.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser?.id]);
  useEffect(() => {
    let cancelled = false;
    async function loadHomepageSettings() {
      const { data } = await getSupabaseClient()
        .from("homepage_settings")
        .select("featured_post_id,quote_text,quote_reference")
        .eq("id", "main")
        .maybeSingle();
      if (!cancelled && data) {
        setHomepageSettings((current) => ({ ...current, ...data }));
      }
    }
    loadHomepageSettings();
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (preview) previewRef.current?.showModal();
  }, [preview]);

  function navigate(id) {
    setActive(id);
    window.localStorage.setItem("hs-admin-active-tab", id);
    menuRef.current?.close();
  }
  async function saveHomepageSettings(event) {
    event.preventDefault();
    setHomepageSaving(true);
    setHomepageMessage("");
    const { error: saveError } = await getSupabaseClient()
      .from("homepage_settings")
      .upsert(
        {
          id: "main",
          featured_post_id: homepageSettings.featured_post_id || null,
          quote_text: homepageSettings.quote_text.trim(),
          quote_reference: homepageSettings.quote_reference.trim(),
          updated_by: currentUser.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
    setHomepageMessage(
      saveError
        ? "Pengaturan belum dapat disimpan. Pastikan migrasi homepage_settings sudah dijalankan."
        : "Pengaturan halaman utama tersimpan.",
    );
    setHomepageSaving(false);
  }
  function openPreview(article, event) {
    previewTriggerRef.current = event.currentTarget;
    setPreview(article);
  }
  const filtered = useMemo(
    () =>
      articles.filter(
        (article) =>
          (!status || article.status === status) &&
          (!topic || article.topic === topic) &&
          (!query ||
            `${article.title} ${article.excerpt}`
              .toLocaleLowerCase("id")
              .includes(query.toLocaleLowerCase("id"))),
      ),
    [articles, query, status, topic],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, pages);
  const rows = filtered.slice((currentPage - 1) * 10, currentPage * 10);
  const topics = [
    ...new Set(articles.map((article) => article.topic).filter(Boolean)),
  ].sort();
  const published = articles.filter(
    (article) => article.status === "published",
  ).length;
  function navItems(items) {
    return items.map((item) => (
      <button
        key={item.id}
        className={`hs-nav-link${active === item.id ? " is-active" : ""}`}
        aria-current={active === item.id ? "page" : undefined}
        onClick={() => navigate(item.id)}
      >
        <item.icon size={17} />
        <span>{item.label}</span>
      </button>
    ));
  }
  function articleRows(list) {
    return list.map((article) => (
      <tr key={article.id}>
        <td>
          <button
            className="hs-title-link"
            onClick={(event) => openPreview(article, event)}
          >
            {article.title || "Tanpa judul"}
          </button>
          <p className="hs-excerpt">{article.excerpt || `/${article.slug}`}</p>
        </td>
        <td>
          <span className={`hs-status hs-status-${article.status}`}>
            {labels[article.status] || article.status}
          </span>
        </td>
        <td>{article.topic || "Belum ditentukan"}</td>
        <td>
          <time dateTime={article.updated_at}>{date(article.updated_at)}</time>
        </td>
        <td>
          <button
            className="hs-icon-button"
            aria-label={`Preview ${article.title || "artikel"}`}
            onClick={(event) => openPreview(article, event)}
          >
            <ArrowUpRight size={18} />
          </button>
        </td>
      </tr>
    ));
  }
  function emptyState() {
    if (loading)
      return (
        <div className="hs-empty" role="status">
          <div className="hs-skeleton" />
          <div className="hs-skeleton" />
          <div className="hs-skeleton" />
          <span>Memuat artikel…</span>
        </div>
      );
    if (error)
      return (
        <div className="hs-empty" role="alert">
          <FileText size={30} />
          <h2>Daftar artikel belum tersedia</h2>
          <p>{error}</p>
          <button
            className="hs-secondary"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} />
            Coba lagi
          </button>
        </div>
      );
    return (
      <div className="hs-empty">
        <FileText size={32} />
        <h2>
          {query || status || topic
            ? "Tidak ada artikel yang cocok"
            : "Tulisan pertama dimulai di sini"}
        </h2>
        <p>
          {query || status || topic
            ? "Coba kata kunci atau filter lain."
            : "Buat draft untuk mulai menyusun tulisan baru."}
        </p>
        {query || status || topic ? (
          <button
            className="hs-secondary"
            onClick={() => {
              setQuery("");
              setStatus("");
              setTopic("");
            }}
          >
            Hapus filter
          </button>
        ) : (
          <button className="hs-primary" onClick={onCreateArticle}>
            Buat artikel pertama
          </button>
        )}
      </div>
    );
  }
  function table(list) {
    return (
      <div
        className="hs-table-scroll"
        role="region"
        aria-label="Daftar artikel, gulir untuk melihat semua kolom"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Judul artikel</th>
              <th scope="col">Status</th>
              <th scope="col">Topik</th>
              <th scope="col">Diperbarui</th>
              <th scope="col">
                <span className="sr-only">Preview</span>
              </th>
            </tr>
          </thead>
          <tbody>{articleRows(list)}</tbody>
        </table>
      </div>
    );
  }
  const metadata = {
    media: ["Media", "Gambar dan dokumen untuk tulisan Anda."],
    komentar: ["Komentar", "Percakapan dengan pembaca."],
    tentang: ["Tentang", "Profil dan cerita singkat penulis."],
    kontak: ["Kontak", "Informasi kontak untuk pembaca."],
  };

  return (
    <div className="hs-dashboard">
      <a className="hs-skip-link" href="#hs-content">
        Langsung ke konten
      </a>
      <aside className="hs-sidebar">
        <a className="hs-brand" href="/">
          <span className="hs-monogram">H</span>
          <span>
            <strong>Editorial</strong>
            <small>Hanifullah Syukri</small>
          </span>
        </a>
        <nav aria-label="Navigasi dashboard">
          {groups.map((group, index) =>
            group.label ? (
              <details className="hs-nav-group" key={group.label} open>
                <summary>
                  {group.label}
                  <ChevronDown size={16} />
                </summary>
                <div>{navItems(group.items)}</div>
              </details>
            ) : (
              <div className="hs-nav-group" key={index}>
                {navItems(group.items)}
              </div>
            ),
          )}
        </nav>
        <details className="hs-profile">
          <summary>
            <span className="hs-avatar">{initials}</span>
            <span>
              <strong>{displayName}</strong>
              <small>Penulis</small>
            </span>
            <ChevronDown size={16} />
          </summary>
          <div>
            {navItems([
              { id: "profil", label: "Pengaturan akun", icon: UserRound },
            ])}
            <button
              className="hs-nav-link"
              onClick={onLogout}
              disabled={isLoggingOut}
            >
              <LogOut size={17} />
              {isLoggingOut ? "Keluar…" : "Logout"}
            </button>
          </div>
        </details>
      </aside>
      <main id="hs-content" className="hs-main">
        {active === "dasbor" && (
          <>
            <Heading
              title="Beranda"
              description={`Selamat datang, ${displayName}. Ruang untuk merawat ide dan menyusun tulisan.`}
              onCreate={onCreateArticle}
            />
            <section className="hs-stats" aria-label="Ringkasan artikel">
              {[
                ["Semua artikel", articles.length],
                ["Sudah terbit", published],
                ["Draft", articles.length - published],
              ].map(([label, count]) => (
                <div key={label}>
                  <p>{label}</p>
                  <strong>
                    {loading || error ? "—" : count.toLocaleString("id-ID")}
                  </strong>
                </div>
              ))}
            </section>
            {localDraft && (
              <section className="hs-draft-banner">
                <div>
                  <p className="hs-kicker">LANJUTKAN MENULIS</p>
                  <h2>{localDraft.title || "Draft tanpa judul"}</h2>
                  <p>Draft tersimpan di sesi browser ini.</p>
                </div>
                <a className="hs-secondary" href="/admin/editor">
                  Buka draft
                  <ArrowUpRight size={16} />
                </a>
              </section>
            )}
            <section className="hs-panel">
              <div className="hs-panel-heading">
                <h2>Artikel terbaru</h2>
                <button
                  className="hs-text-button"
                  onClick={() => navigate("artikel")}
                >
                  Lihat semua
                  <ArrowUpRight size={16} />
                </button>
              </div>
              {!loading && !error && articles.length
                ? table(articles.slice(0, 5))
                : emptyState()}
            </section>
          </>
        )}
        {active === "artikel" && (
          <>
            <Heading
              title="Artikel"
              description="Ruang untuk draft dan tulisan Anda yang sudah terbit."
              onCreate={onCreateArticle}
            />
            {localDraft && (
              <div className="hs-local-notice">
                <span>
                  Draft browser:{" "}
                  <strong>{localDraft.title || "Tanpa judul"}</strong>
                </span>
                <a href="/admin/editor">
                  Lanjutkan menulis
                  <ArrowUpRight size={15} />
                </a>
              </div>
            )}
            <section className="hs-panel" aria-label="Daftar artikel">
              <nav className="hs-tabs" aria-label="Filter status artikel">
                {[
                  ["", "Semua artikel"],
                  ["draft", "Draft"],
                  ["published", "Terbit"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    aria-current={status === value ? "page" : undefined}
                    onClick={() => {
                      setStatus(value);
                      setPage(1);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </nav>
              <div className="hs-filters">
                <label className="hs-search">
                  <span>Cari judul</span>
                  <div>
                    <Search size={17} />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Cari artikel…"
                      maxLength={120}
                    />
                  </div>
                </label>
                <label>
                  <span>Topik</span>
                  <select
                    value={topic}
                    onChange={(event) => {
                      setTopic(event.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">Semua topik</option>
                    {topics.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
                {(query || topic) && (
                  <button
                    className="hs-text-button"
                    onClick={() => {
                      setQuery("");
                      setTopic("");
                      setPage(1);
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
              {!loading && !error && rows.length ? (
                <>
                  <div className="hs-result-count">
                    <strong>
                      {filtered.length.toLocaleString("id-ID")} artikel
                    </strong>
                    <span>Terakhir diperbarui</span>
                  </div>
                  {table(rows)}
                  <footer className="hs-pagination">
                    <p>
                      Menampilkan {(currentPage - 1) * 10 + 1}–
                      {Math.min(currentPage * 10, filtered.length)} dari{" "}
                      {filtered.length} artikel
                    </p>
                    <nav aria-label="Halaman artikel">
                      <button
                        className="hs-icon-button"
                        aria-label="Halaman sebelumnya"
                        disabled={currentPage <= 1}
                        onClick={() => setPage(currentPage - 1)}
                      >
                        <ChevronLeft size={17} />
                      </button>
                      <span>
                        {currentPage} / {pages}
                      </span>
                      <button
                        className="hs-icon-button"
                        aria-label="Halaman berikutnya"
                        disabled={currentPage >= pages}
                        onClick={() => setPage(currentPage + 1)}
                      >
                        <ChevronRight size={17} />
                      </button>
                    </nav>
                  </footer>
                </>
              ) : (
                emptyState()
              )}
            </section>
            <p className="hs-scope-note">
              Hanya artikel milik Anda yang ditampilkan. Tanggal mengikuti zona
              waktu Jakarta (UTC+7).
            </p>
          </>
        )}
        {active === "halaman-utama" && (
          <>
            <Heading
              title="Halaman utama"
              description="Pilih satu artikel utama dan satu quote yang tampil di landing page."
            />
            <form className="hs-panel hs-home-settings" onSubmit={saveHomepageSettings}>
              <div className="hs-settings-section">
                <div>
                  <p className="hs-kicker">ARTIKEL PILIHAN</p>
                  <h2>Sorotan utama</h2>
                  <p>Artikel ini menjadi headline pertama yang dilihat pembaca.</p>
                </div>
                <label>
                  <span>Pilih artikel terbit</span>
                  <select
                    value={homepageSettings.featured_post_id || ""}
                    onChange={(event) =>
                      setHomepageSettings((current) => ({
                        ...current,
                        featured_post_id: event.target.value,
                      }))
                    }
                  >
                    <option value="">Artikel terbit terbaru</option>
                    {articles
                      .filter((article) => article.status === "published")
                      .map((article) => (
                        <option key={article.id} value={article.id}>
                          {article.title}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
              <div className="hs-settings-section">
                <div>
                  <p className="hs-kicker">QUOTE PILIHAN</p>
                  <h2>Kutipan editorial</h2>
                  <p>Quote tampil setelah daftar artikel terbaru.</p>
                </div>
                <div className="hs-settings-fields">
                  <label>
                    <span>Isi quote</span>
                    <textarea
                      rows="5"
                      required
                      maxLength="360"
                      value={homepageSettings.quote_text}
                      onChange={(event) =>
                        setHomepageSettings((current) => ({
                          ...current,
                          quote_text: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Referensi</span>
                    <input
                      required
                      maxLength="140"
                      value={homepageSettings.quote_reference}
                      onChange={(event) =>
                        setHomepageSettings((current) => ({
                          ...current,
                          quote_reference: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
              </div>
              <footer className="hs-settings-footer">
                {homepageMessage && <p role="status">{homepageMessage}</p>}
                <button className="hs-primary" disabled={homepageSaving}>
                  {homepageSaving ? "Menyimpan…" : "Simpan pengaturan"}
                </button>
              </footer>
            </form>
          </>
        )}
        {metadata[active] && (
          <>
            <Heading
              title={metadata[active][0]}
              description={metadata[active][1]}
            />
            <section className="hs-panel hs-empty">
              <FileText size={30} />
              <h2>Belum tersedia</h2>
              <p>
                Pengelolaan {metadata[active][0].toLowerCase()} belum diaktifkan
                di situs ini.
              </p>
              <button
                className="hs-secondary"
                onClick={() => navigate("dasbor")}
              >
                Kembali ke beranda
              </button>
            </section>
          </>
        )}
        {active === "profil" && (
          <>
            <Heading
              title="Pengaturan akun"
              description="Informasi akun penulis Anda."
            />
            <section className="hs-panel hs-account">
              <span className="hs-avatar">{initials}</span>
              <h2>{displayName}</h2>
              <p>{currentUser?.email}</p>
              <button
                className="hs-secondary"
                onClick={onLogout}
                disabled={isLoggingOut}
              >
                <LogOut size={17} />
                {isLoggingOut ? "Keluar…" : "Logout"}
              </button>
            </section>
          </>
        )}
      </main>
      <nav className="hs-mobile-nav" aria-label="Navigasi utama mobile">
        {navItems([
          groups[0].items[0],
          groups[0].items[1],
          groups[0].items[2],
          groups[1].items[0],
        ])}
        <button
          className="hs-nav-link"
          aria-label="Buka menu akun"
          aria-haspopup="dialog"
          onClick={() => menuRef.current?.showModal()}
        >
          <span className="hs-avatar">{initials}</span>
          <span>Akun</span>
        </button>
      </nav>
      <dialog
        className="hs-menu-dialog"
        ref={menuRef}
        aria-labelledby="hs-menu-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) menuRef.current?.close();
        }}
      >
        <div className="hs-dialog-header">
          <div>
            <h2 id="hs-menu-title">{displayName}</h2>
            <p>Penulis</p>
          </div>
          <button
            className="hs-icon-button"
            aria-label="Tutup menu"
            onClick={() => menuRef.current?.close()}
          >
            <X size={21} />
          </button>
        </div>
        <nav aria-label="Menu akun">
          {navItems([
            ...groups[2].items,
            { id: "profil", label: "Pengaturan akun", icon: UserRound },
          ])}
          <button
            className="hs-nav-link"
            onClick={onLogout}
            disabled={isLoggingOut}
          >
            <LogOut size={18} />
            {isLoggingOut ? "Keluar…" : "Logout"}
          </button>
        </nav>
      </dialog>
      <dialog
        ref={previewRef}
        className="hs-preview"
        aria-labelledby="hs-preview-title"
        onClose={() => {
          setPreview(null);
          previewTriggerRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) previewRef.current?.close();
        }}
      >
        <div className="hs-dialog-header">
          <span>Preview artikel</span>
          <button
            className="hs-icon-button"
            aria-label="Tutup preview"
            onClick={() => previewRef.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        {preview && (
          <article className="hs-preview-body">
            <p className="hs-kicker">
              {preview.topic || "ARTIKEL"} ·{" "}
              {labels[preview.status] || preview.status}
            </p>
            <h1 id="hs-preview-title">{preview.title || "Tanpa judul"}</h1>
            <p className="hs-preview-meta">
              {displayName} · {date(preview.updated_at)}
            </p>
            {preview.excerpt && (
              <p className="hs-preview-lead">{preview.excerpt}</p>
            )}
            {preview.main_image_url &&
              /^https?:\/\//i.test(preview.main_image_url) && (
                <img
                  src={preview.main_image_url}
                  alt={preview.title || "Gambar artikel"}
                />
              )}
            <div className="hs-rich-content">
              <RichContent value={preview.content} />
            </div>
          </article>
        )}
      </dialog>
    </div>
  );
}
