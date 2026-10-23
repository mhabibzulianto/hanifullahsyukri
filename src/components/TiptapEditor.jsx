"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { ArrowLeft, Bold, Italic, Underline, Strikethrough, Undo, Redo, Save } from "lucide-react";
import { articleEditorExtensions } from "@/lib/editor/tiptap-extensions.mjs";
import { safeEditorLink } from "@/lib/editor/editor-links.mjs";
import { editorFootnotes, newFootnoteId } from "@/lib/editor/tiptap-footnotes.mjs";
import { youtubeEmbedUrl } from "@/lib/editor/article-youtube.mjs";
import { HONORIFICS } from "@/lib/editor/tiptap-honorifics.mjs";
import { getSupabaseClient } from "@/lib/supabase";
import "./tiptap-editor.css";

const DRAFT_KEY = "hs-editor-draft";

export default function TiptapEditor({ currentUser, onBack }) {
  const [fields, setFields] = useState({ title: "", excerpt: "", topic: "" });
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [value, setValue] = useState("");
  const [revision, setRevision] = useState(0);
  const postId = useRef(null);
  const snapshot = useRef(null);
  const editor = useEditor({
    extensions: articleEditorExtensions(),
    immediatelyRender: false,
    content: "<p></p>",
    editorProps: { attributes: { class: "writing-prose", role: "textbox", "aria-label": "Isi artikel", "aria-multiline": "true" } },
    onUpdate: () => { setRevision((n) => n + 1); setDirty(true); },
    onSelectionUpdate: () => setRevision((n) => n + 1),
  });

  useEffect(() => {
    if (!editor) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
      if (saved) {
        setFields({ title: saved.title || "", excerpt: saved.excerpt || "", topic: saved.topic || "" });
        postId.current = saved.postId || null;
        editor.commands.setContent(saved.doc?.type === "doc" ? saved.doc : saved.body || "<p></p>", { emitUpdate: false });
      }
    } catch { setNotice("Draft lokal belum dapat dibaca. Salinan aslinya tetap tersimpan di browser."); }
    setReady(true);
  }, [editor]);

  useEffect(() => {
    if (!ready || !editor) return;
    snapshot.current = { ...fields, doc: editor.getJSON(), body: editor.getHTML(), postId: postId.current, editorVersion: "rabbani-tiptap-3.31.4" };
    const timer = setTimeout(() => {
      try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot.current)); }
      catch { setNotice("Penyimpanan lokal penuh. Simpan draft ke server."); }
    }, 500);
    return () => {
      clearTimeout(timer);
      if (snapshot.current) {
        try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot.current)); } catch { /* The visible warning handles storage failure. */ }
      }
    };
  }, [fields, revision, ready, editor]);

  useEffect(() => {
    const warn = (event) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save(status) {
    if (!editor || busy) return;
    if (!fields.title.trim() || editor.isEmpty) { setNotice("Isi judul dan artikel sebelum menyimpan."); return; }
    setBusy(true);
    setNotice("");
    try {
      const id = postId.current || crypto.randomUUID();
      const slug = fields.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "artikel";
      const payload = { id, author_id: currentUser.id, title: fields.title.trim(), excerpt: fields.excerpt.trim(), topic: fields.topic.trim(), slug: `${slug}-${id.slice(0, 8)}`, content: editor.getJSON(), status, published_at: status === "published" ? new Date().toISOString() : null };
      const { error } = await getSupabaseClient().from("posts").upsert(payload, { onConflict: "id" });
      if (error) throw error;
      postId.current = id;
      snapshot.current = { ...fields, postId: id, doc: editor.getJSON(), body: editor.getHTML() };
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot.current));
      setDirty(false);
      setNotice(status === "published" ? "Artikel berhasil diterbitkan." : "Draft tersimpan ke server.");
    } catch { setNotice("Artikel belum dapat disimpan ke server. Draft lokal tetap tersedia; periksa koneksi dan skema posts."); }
    finally { setBusy(false); }
  }

  function tool(label, action, active, Icon) {
    return <button type="button" key={label} title={label} aria-label={label} aria-pressed={Boolean(active)} disabled={!editor || busy} onMouseDown={(event) => event.preventDefault()} onClick={action}>{Icon ? <Icon size={17} /> : label}</button>;
  }
  function ask(kind) { setValue(""); setDialog(kind); }
  function insert(event) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    const chain = editor.chain().focus();
    if (dialog === "Tautan") {
      if (!safeEditorLink(text)) { setNotice("Gunakan tautan http, https, atau mailto yang valid."); return; }
      chain.extendMarkRange("link").setLink({ href: text }).run();
    } else if (dialog === "YouTube") {
      const src = youtubeEmbedUrl(text);
      if (!src) { setNotice("Tautan YouTube tidak valid."); return; }
      chain.insertContent({ type: "youtube", attrs: { src } }).run();
    } else if (dialog === "Catatan kaki") {
      chain.insertContent({ type: "footnote", attrs: { id: newFootnoteId(), text } }).run();
    } else {
      let url;
      try { url = new URL(text); } catch { setNotice("Masukkan URL media yang valid."); return; }
      if (url.protocol !== "https:") { setNotice("Gunakan URL HTTPS untuk media."); return; }
      chain.insertContent({ type: dialog, attrs: { src: url.href, alt: "", filename: url.pathname.split("/").pop() } }).run();
    }
    setDialog(null);
    setNotice("");
  }

  const notes = editor ? editorFootnotes(editor.state.doc) : [];
  return <div className="hs-tiptap">
    <header className="te-header"><button type="button" disabled={busy} onClick={() => { if (snapshot.current) { try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot.current)); } catch { setNotice("Draft lokal belum tersimpan. Simpan ke server sebelum kembali."); return; } } onBack(); }}><ArrowLeft size={18} /> Artikel</button><span>Ruang menulis <small>Tiptap · Rabbani</small></span><div><button type="button" disabled={busy || !ready} onClick={() => save("draft")}><Save size={16} /> Simpan draft</button><button type="button" className="te-publish" disabled={busy || !ready} onClick={() => save("published")}>{busy ? "Menyimpan…" : "Terbitkan"}</button></div></header>
    {notice && <p className="te-notice" role="status">{notice}</p>}
    <div className="te-toolbar" role="toolbar" aria-label="Format artikel">
      <select aria-label="Gaya paragraf" value={editor?.isActive("heading", { level: 2 }) ? "h2" : editor?.isActive("heading", { level: 3 }) ? "h3" : editor?.isActive("heading", { level: 4 }) ? "h4" : "p"} onChange={(event) => event.target.value === "p" ? editor.chain().focus().setParagraph().run() : editor.chain().focus().toggleHeading({ level: Number(event.target.value.slice(1)) }).run()}><option value="p">Paragraf</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="h4">Heading 4</option></select>
      {tool("Tebal", () => editor.chain().focus().toggleBold().run(), editor?.isActive("bold"), Bold)}
      {tool("Miring", () => editor.chain().focus().toggleItalic().run(), editor?.isActive("italic"), Italic)}
      {tool("Garis bawah", () => editor.chain().focus().toggleUnderline().run(), editor?.isActive("underline"), Underline)}
      {tool("Coret", () => editor.chain().focus().toggleStrike().run(), editor?.isActive("strike"), Strikethrough)}
      {tool("Tautan", () => ask("Tautan"), editor?.isActive("link"))}
      {tool("Daftar", () => editor.chain().focus().toggleBulletList().run(), editor?.isActive("bulletList"))}
      {tool("Nomor", () => editor.chain().focus().toggleOrderedList().run(), editor?.isActive("orderedList"))}
      {tool("Kutipan", () => editor.chain().focus().toggleBlockquote().run(), editor?.isActive("blockquote"))}
      {tool("Pull quote", () => editor.chain().focus().setPullQuote().run(), editor?.isActive("pullQuote"))}
      {tool("Marginalia", () => editor.chain().focus().setMarginalia().run(), editor?.isActive("marginalia"))}
      {tool("Arab", () => editor.chain().focus().toggleArabicBlock().run(), editor?.isActive("arabicBlock"))}
      {tool("Catatan kaki", () => ask("Catatan kaki"))}
      <select aria-label="Sisipkan media" value="" onChange={(event) => ask(event.target.value)}><option value="" disabled>Media</option><option value="image">Gambar (URL)</option><option value="video">Video (URL)</option><option value="audio">Audio (URL)</option><option value="document">Dokumen (URL)</option><option value="YouTube">YouTube</option></select>
      <select aria-label="Honorifik" value="" onChange={(event) => editor.chain().focus().insertContent(event.target.value).run()}><option value="" disabled>Honorifik</option>{HONORIFICS.map((item) => <option key={item.shortcut || item.text} value={item.text}>{item.label || item.text}</option>)}</select>
      {tool("Rata kiri", () => editor.chain().focus().setTextAlign("left").run(), editor?.isActive({ textAlign: "left" }))}
      {tool("Rata tengah", () => editor.chain().focus().setTextAlign("center").run(), editor?.isActive({ textAlign: "center" }))}
      {tool("Urungkan", () => editor.chain().focus().undo().run(), false, Undo)}
      {tool("Ulangi", () => editor.chain().focus().redo().run(), false, Redo)}
    </div>
    <main className="te-document">
      <label className="te-title-label"><span className="sr-only">Judul artikel</span><textarea aria-label="Judul artikel" rows={2} placeholder="Judul tulisan" value={fields.title} onChange={(event) => { setFields({ ...fields, title: event.target.value }); setDirty(true); }} /></label>
      <div className="te-metadata"><label>Topik<input value={fields.topic} onChange={(event) => { setFields({ ...fields, topic: event.target.value }); setDirty(true); }} placeholder="Misalnya Refleksi" /></label><label>Ringkasan<textarea rows={2} value={fields.excerpt} onChange={(event) => { setFields({ ...fields, excerpt: event.target.value }); setDirty(true); }} placeholder="Pengantar singkat untuk pembaca" /></label></div>
      {!ready && <p role="status">Menyiapkan editor…</p>}
      <EditorContent editor={editor} />
      {notes.length > 0 && <section className="te-footnotes" aria-label="Catatan kaki"><h2>Catatan kaki</h2><ol>{notes.map((note) => <li key={note.id}>{note.text}</li>)}</ol></section>}
    </main>
    <footer className="te-status"><span>{ready ? "Draft dicadangkan di browser" : "Menyiapkan draft"}</span><span>{editor?.storage.characterCount.words() || 0} kata</span></footer>
    {dialog && <div className="te-modal" role="dialog" aria-modal="true" aria-label={dialog}><form onSubmit={insert}><h2>{dialog}</h2><label>Isi {dialog}<input autoFocus required value={value} onChange={(event) => setValue(event.target.value)} /></label><div><button type="button" onClick={() => setDialog(null)}>Batal</button><button type="submit">Sisipkan</button></div></form></div>}
  </div>;
}
