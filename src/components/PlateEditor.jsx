"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlignLeft,
  ArrowLeft,
  Bell,
  Bold,
  ChevronDown,
  Code,
  Highlighter,
  Italic,
  Link,
  List,
  ListOrdered,
  MoreHorizontal,
  Quote,
  Redo,
  Save,
  Strikethrough,
  SendHorizontal,
  Underline,
  Undo,
} from "lucide-react";

const DRAFT_KEY = "hs-editor-draft";

function Separator() {
  return <div className="plate-toolbar-separator" />;
}

function ToolButton({ active = false, children, icon: Icon, label, onClick }) {
  return (
    <button
      aria-label={label}
      className={`plate-tool-button${active ? " active" : ""}`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {Icon ? <Icon size={15} strokeWidth={1.8} /> : null}
      {children}
    </button>
  );
}

function DropdownButton({ children, label }) {
  return (
    <button
      aria-label={label}
      className="plate-tool-button plate-tool-dropdown"
      title={label}
      type="button"
    >
      {children}
      <ChevronDown size={11} strokeWidth={2} style={{ marginLeft: 2, opacity: 0.55 }} />
    </button>
  );
}

function getPlainTextLength(html) {
  if (!html) {
    return 0;
  }

  const temp = document.createElement("div");
  temp.innerHTML = html;
  return (temp.textContent || "").trim().length;
}

export default function PlateEditor({ currentUser, onBack, onChange }) {
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const profileMenuRef = useRef(null);
  const [marks, setMarks] = useState({});
  const [activeEditor, setActiveEditor] = useState("body");
  const [saveState, setSaveState] = useState("saved");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [notice, setNotice] = useState("");
  const [titleEmpty, setTitleEmpty] = useState(true);
  const [bodyEmpty, setBodyEmpty] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(DRAFT_KEY);

    if (titleRef.current) {
      titleRef.current.textContent = "";
    }

    if (bodyRef.current) {
      bodyRef.current.innerHTML = "<p><br></p>";
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const title = typeof parsed.title === "string" ? parsed.title : "";
        const body = typeof parsed.body === "string" ? parsed.body : "";

        if (titleRef.current) {
          titleRef.current.textContent = title;
        }

        if (bodyRef.current) {
          bodyRef.current.innerHTML = body || "<p><br></p>";
        }
      } catch {
        window.sessionStorage.removeItem(DRAFT_KEY);
      }
    }

    syncEmptyState();
  }, []);

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const userInitials = useMemo(() => {
    const email = currentUser?.email || "hanifullahsyukri";
    const [name] = email.split("@");
    return name.slice(0, 2).toUpperCase();
  }, [currentUser]);

  function syncEmptyState() {
    setTitleEmpty(!(titleRef.current?.textContent || "").trim());
    setBodyEmpty(!getPlainTextLength(bodyRef.current?.innerHTML || ""));
  }

  function getDraft() {
    return {
      title: titleRef.current?.textContent?.trim() || "",
      body: bodyRef.current?.innerHTML || "<p><br></p>",
    };
  }

  function emitChange(nextDraft) {
    if (onChange) {
      onChange(nextDraft);
    }
  }

  function stampSaved() {
    setLastSavedAt(
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date())
    );
  }

  function saveDraft(nextDraft, source = "autosave") {
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
      setSaveState("saved");
      stampSaved();
      if (source === "manual") {
        setNotice("Draft berhasil disimpan.");
      }
    } catch {
      setSaveState("error");
      if (source === "manual") {
        setNotice("Autosave gagal. Coba simpan lagi.");
      }
    }
  }

  function scheduleAutosave() {
    const nextDraft = getDraft();
    syncEmptyState();
    emitChange(nextDraft);
    setSaveState("saving");
    setNotice("");

    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = window.setTimeout(() => {
      saveDraft(nextDraft, "autosave");
    }, 600);
  }

  function focusEditor(target = activeEditor) {
    if (target === "title") {
      titleRef.current?.focus();
      return;
    }

    bodyRef.current?.focus();
  }

  function exec(command, value = null) {
    focusEditor();
    document.execCommand(command, false, value);
    scheduleAutosave();
  }

  function toggleMark(command) {
    exec(command);
    setMarks((current) => ({
      ...current,
      [command]: !current[command],
    }));
  }

  function wrapSelectionWithCode() {
    focusEditor();
    const selection = window.getSelection();

    if (!selection || !selection.rangeCount) {
      return;
    }

    const range = selection.getRangeAt(0);

    if (range.collapsed) {
      return;
    }

    const code = document.createElement("code");
    code.className = "plate-inline-code";
    range.surroundContents(code);
    scheduleAutosave();
  }

  function normalizeBody() {
    if (!bodyRef.current) {
      return;
    }

    if (!getPlainTextLength(bodyRef.current.innerHTML)) {
      bodyRef.current.innerHTML = "<p><br></p>";
      syncEmptyState();
    }
  }

  function handleManualSave() {
    saveDraft(getDraft(), "manual");
  }

  function handlePublish() {
    const draft = getDraft();
    saveDraft(draft, "manual");

    if (!draft.title && !getPlainTextLength(draft.body)) {
      setNotice("Tulis judul atau isi artikel dulu sebelum publikasi.");
      return;
    }

    setNotice("Editor siap. Alur publikasi backend bisa disambungkan setelah desain final.");
  }

  return (
    <>
      <style>{`
        .plate-playground-shell,
        .plate-playground-shell * {
          box-sizing: border-box;
        }

        .plate-playground-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          color: #111827;
          font-family: inherit;
        }

        .plate-topbar {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 0 20px;
          border-bottom: 1px solid #eceff3;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .plate-topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .plate-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .plate-brand-mark {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 700;
        }

        .plate-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
          text-align: left;
        }

        .plate-brand-text strong {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
        }

        .plate-brand-text span {
          font-size: 11px;
          color: #9ca3af;
        }

        .plate-save-button,
        .plate-publish-button,
        .plate-notification-button,
        .plate-avatar-button {
          border: 0;
          font: inherit;
        }

        .plate-save-button,
        .plate-publish-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 0 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
        }

        .plate-save-button {
          background: #ffffff;
          color: #9ca3af;
          border: 1px solid #e5e7eb;
        }

        .plate-save-button.is-active {
          color: #92400e;
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .plate-save-button:disabled {
          cursor: default;
        }

        .plate-publish-button {
          background: #111827;
          color: white;
          box-shadow: 0 10px 24px rgba(17, 24, 39, 0.14);
        }

        .plate-publish-button:hover {
          transform: translateY(-1px);
          background: #0f172a;
        }

        .plate-notification-button {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          color: #6b7280;
          background: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }

        .plate-notification-button:hover {
          background: #f3f4f6;
        }

        .plate-notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid #ffffff;
        }

        .plate-avatar-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        .plate-profile-menu {
          position: relative;
        }

        .plate-profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 210px;
          padding: 8px;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12);
        }

        .plate-profile-heading {
          padding: 10px 12px 8px;
          border-bottom: 1px solid #f3f4f6;
          margin-bottom: 8px;
        }

        .plate-profile-heading strong {
          display: block;
          font-size: 13px;
          color: #111827;
        }

        .plate-profile-heading span {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: #9ca3af;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .plate-profile-link {
          width: 100%;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 12px;
          color: #374151;
          background: transparent;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .plate-profile-link:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .plate-button-label {
          display: inline;
        }

        .plate-toolbar {
          position: sticky;
          top: 56px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 1px;
          flex-wrap: wrap;
          min-height: 46px;
          padding: 0 12px;
          background: #ffffff;
          border-bottom: 1px solid #eceff3;
        }

        .plate-tool-button {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          height: 30px;
          padding: 0 8px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #374151;
          cursor: pointer;
          font-size: 13px;
          line-height: 1;
          transition: background 0.12s ease, color 0.12s ease;
          white-space: nowrap;
        }

        .plate-tool-button:hover {
          background: #f3f4f6;
        }

        .plate-tool-button.active {
          background: #111827;
          color: #ffffff;
        }

        .plate-tool-dropdown {
          font-weight: 500;
        }

        .plate-toolbar-separator {
          width: 1px;
          height: 22px;
          background: #e5e7eb;
          margin: 0 4px;
        }

        .plate-canvas {
          flex: 1;
          padding: 32px 24px 72px;
          overflow-y: auto;
        }

        .plate-editor-frame {
          width: min(860px, 100%);
          margin: 0 auto;
        }

        .plate-status-row {
          min-height: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          color: #9ca3af;
          font-size: 12px;
        }

        .plate-editor-title,
        .plate-editor-body {
          outline: none;
          border: 0;
          background: transparent;
        }

        .plate-editor-title {
          margin: 0;
          min-height: 80px;
          font-size: clamp(2.6rem, 5vw, 4rem);
          line-height: 1.06;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #111827;
          padding: 12px 0 0;
        }

        .plate-editor-body {
          min-height: calc(100vh - 280px);
          padding-top: 14px;
          font-size: 1.125rem;
          line-height: 1.85;
          color: #1f2937;
        }

        .plate-editor-body p {
          margin: 0 0 0.95em;
        }

        .plate-editor-body h2,
        .plate-editor-body h3,
        .plate-editor-body blockquote,
        .plate-editor-body ul,
        .plate-editor-body ol {
          margin: 0 0 1em;
        }

        .plate-editor-title[data-empty="true"]::before,
        .plate-editor-body[data-empty="true"]::before {
          content: attr(data-placeholder);
          color: #c9ced6;
          pointer-events: none;
        }

        .plate-editor-body blockquote {
          margin-left: 0;
          padding-left: 18px;
          border-left: 3px solid #e5e7eb;
          color: #4b5563;
        }

        .plate-editor-body ul,
        .plate-editor-body ol {
          padding-left: 1.4em;
        }

        .plate-inline-code {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          padding: 2px 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.9em;
        }

        @media (max-width: 960px) {
          .plate-topbar {
            padding: 0 16px;
          }

          .plate-toolbar {
            top: 56px;
          }

          .plate-canvas {
            padding-left: 18px;
            padding-right: 18px;
          }
        }

        @media (max-width: 640px) {
          .plate-brand-text span {
            display: none;
          }

          .plate-save-button,
          .plate-publish-button {
            width: 38px;
            min-width: 38px;
            padding: 0;
            justify-content: center;
          }

          .plate-button-label {
            display: none;
          }

          .plate-topbar-right {
            gap: 8px;
          }
        }
      `}</style>

      <div className="plate-playground-shell">
        <div className="plate-topbar">
          <div className="plate-brand" aria-label="Brand Hanifullah Syukri">
            <span className="plate-brand-mark">HS</span>
            <span className="plate-brand-text">
              <strong>Hanifullah Syukri</strong>
              <span>Editorial</span>
            </span>
          </div>

          <div className="plate-topbar-right">
            <button
              className={`plate-save-button${saveState === "error" ? " is-active" : ""}`}
              disabled={saveState !== "error"}
              onClick={handleManualSave}
              type="button"
            >
              <Save size={16} />
              <span className="plate-button-label">
                {saveState === "saving" ? "Menyimpan..." : "Simpan"}
              </span>
            </button>
            <button className="plate-publish-button" onClick={handlePublish} type="button">
              <SendHorizontal size={16} />
              <span className="plate-button-label">Publikasi</span>
            </button>
            <button aria-label="Notifikasi" className="plate-notification-button" type="button">
              <Bell size={18} />
              <span className="plate-notification-dot" />
            </button>
            <div className="plate-profile-menu" ref={profileMenuRef}>
              <button
                aria-label={currentUser?.email || "Profil pengguna"}
                className="plate-avatar-button"
                onClick={() => setProfileOpen((open) => !open)}
                title={currentUser?.email || "Profil pengguna"}
                type="button"
              >
                {userInitials}
              </button>

              {profileOpen ? (
                <div className="plate-profile-dropdown">
                  <div className="plate-profile-heading">
                    <strong>Hanifullah Syukri</strong>
                    <span>{currentUser?.email || "admin@hanifullahsyukri.id"}</span>
                  </div>
                  <button className="plate-profile-link" onClick={onBack} type="button">
                    <ArrowLeft size={15} />
                    <span>Kembali ke artikel</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="plate-toolbar">
          <ToolButton icon={Undo} label="Undo" onClick={() => exec("undo")} />
          <ToolButton icon={Redo} label="Redo" onClick={() => exec("redo")} />
          <Separator />
          <DropdownButton label="Text style">Text</DropdownButton>
          <Separator />
          <ToolButton active={marks.bold} icon={Bold} label="Bold" onClick={() => toggleMark("bold")} />
          <ToolButton active={marks.italic} icon={Italic} label="Italic" onClick={() => toggleMark("italic")} />
          <ToolButton active={marks.underline} icon={Underline} label="Underline" onClick={() => toggleMark("underline")} />
          <ToolButton
            active={marks.strikeThrough}
            icon={Strikethrough}
            label="Strikethrough"
            onClick={() => toggleMark("strikeThrough")}
          />
          <ToolButton icon={Code} label="Inline Code" onClick={wrapSelectionWithCode} />
          <ToolButton icon={Highlighter} label="Highlight" onClick={() => exec("hiliteColor", "#fef08a")} />
          <Separator />
          <ToolButton icon={AlignLeft} label="Align Left" onClick={() => exec("justifyLeft")} />
          <ToolButton icon={List} label="Bullet List" onClick={() => exec("insertUnorderedList")} />
          <ToolButton icon={ListOrdered} label="Numbered List" onClick={() => exec("insertOrderedList")} />
          <ToolButton icon={Quote} label="Quote" onClick={() => exec("formatBlock", "blockquote")} />
          <ToolButton
            icon={Link}
            label="Insert Link"
            onClick={() => {
              const url = window.prompt("Masukkan URL", "https://");
              if (url) {
                exec("createLink", url);
              }
            }}
          />
          <Separator />
          <ToolButton icon={MoreHorizontal} label="More" onClick={() => focusEditor()} />
        </div>

        <div className="plate-canvas">
          <div className="plate-editor-frame">
            <div className="plate-status-row">
              <span>
                {saveState === "saved" && lastSavedAt ? `Tersimpan ${lastSavedAt}` : "\u00A0"}
              </span>
              <span>{notice || "\u00A0"}</span>
            </div>

            <h1
              ref={titleRef}
              aria-label="Article title"
              className="plate-editor-title"
              contentEditable
              data-empty={titleEmpty}
              data-placeholder="Judul"
              onFocus={() => setActiveEditor("title")}
              onInput={scheduleAutosave}
              role="textbox"
              suppressContentEditableWarning
            />

            <div
              ref={bodyRef}
              aria-label="Article content"
              className="plate-editor-body"
              contentEditable
              data-empty={bodyEmpty}
              data-placeholder="Mulai menulis sesuatu yang akan bermanfaat"
              onBlur={normalizeBody}
              onFocus={() => setActiveEditor("body")}
              onInput={scheduleAutosave}
              role="textbox"
              suppressContentEditableWarning
            />
          </div>
        </div>
      </div>
    </>
  );
}
