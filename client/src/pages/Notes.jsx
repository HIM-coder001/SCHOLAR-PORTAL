import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import {
  NotebookTabs, Plus, Search, Bell, Trash2, Pencil,
  X, Save, Clock, FileText, Tag
} from "lucide-react";

const COLORS = [
  { label: "Teal",   bg: "bg-[#004D40]",    text: "text-white",       dot: "bg-[#004D40]" },
  { label: "Indigo", bg: "bg-indigo-600",   text: "text-white",       dot: "bg-indigo-600" },
  { label: "Amber",  bg: "bg-amber-400",    text: "text-amber-900",   dot: "bg-amber-400" },
  { label: "Rose",   bg: "bg-rose-500",     text: "text-white",       dot: "bg-rose-500" },
  { label: "Sky",    bg: "bg-sky-500",      text: "text-white",       dot: "bg-sky-500" },
];

const TAGS = ["Revision", "Research", "Assignment", "Lecture", "Project", "Other"];

const Modal = ({ note, onClose, onSave }) => {
  const [title, setTitle]     = useState(note?.title   || "");
  const [content, setContent] = useState(note?.content || "");
  const [tag, setTag]         = useState(note?.tag     || TAGS[0]);
  const [color, setColor]     = useState(note?.color   || 0);
  const textRef = useRef(null);

  useEffect(() => { textRef.current?.focus(); }, []);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), content, tag, color });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Color bar */}
        <div className={`h-2 ${COLORS[color].bg}`} />

        <div className="p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-gray-800 font-outfit">
              {note?._id ? "Edit Note" : "New Note"}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
              <X size={18} />
            </button>
          </div>

          {/* Title */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title…"
            className="w-full text-xl font-bold text-gray-900 placeholder-gray-300 bg-transparent border-b-2 border-gray-100 focus:border-[#004D40] outline-none pb-2 mb-4 transition"
          />

          {/* Content */}
          <textarea
            ref={textRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing your note…"
            rows={6}
            className="w-full text-sm text-gray-700 bg-gray-50 rounded-2xl p-4 outline-none resize-none focus:ring-2 focus:ring-[#004D40]/20 transition font-medium"
          />

          {/* Tag + Color row */}
          <div className="flex flex-wrap items-center gap-4 mt-5">
            {/* Tag picker */}
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-gray-400" />
              <select
                value={tag}
                onChange={e => setTag(e.target.value)}
                className="text-xs font-bold text-gray-600 bg-gray-100 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
              >
                {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Color swatches */}
            <div className="flex items-center gap-1.5 ml-auto">
              {COLORS.map((c, i) => (
                <button
                  key={c.label}
                  onClick={() => setColor(i)}
                  className={`w-5 h-5 rounded-full ${c.dot} ring-offset-1 transition ${color === i ? "ring-2 ring-gray-600" : ""}`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-2.5 rounded-2xl bg-[#004D40] hover:bg-[#00382e] text-white text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-40"
            >
              <Save size={15} /> Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoteCard = ({ note, onEdit, onDelete }) => {
  const c = COLORS[note.color ?? 0];
  const date = new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 relative overflow-hidden">
      {/* Color accent bar */}
      <div className={`absolute top-0 left-0 w-1 h-full ${c.bg} rounded-l-3xl`} />

      {/* Tag */}
      <div className="flex items-center justify-between pl-3">
        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
          {note.tag || "Note"}
        </span>
        {/* Card actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-[#004D40] hover:bg-emerald-50 transition"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(note._id, note.title)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="pl-3 flex-1">
        <h3 className="text-sm font-extrabold text-gray-800 mb-1 leading-snug line-clamp-2">{note.title}</h3>
        {note.content && (
          <p className="text-xs text-gray-400 font-medium line-clamp-3 leading-relaxed">{note.content}</p>
        )}
      </div>

      <div className="pl-3 flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold">
        <Clock size={11} />
        <span>{date}</span>
      </div>
    </div>
  );
};

const Notes = () => {
  const [notes, setNotes]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [modal, setModal]         = useState(null); // null | { mode: "create"|"edit", note }
  const [toast, setToast]         = useState({ show: false, message: "" });

  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const token = localStorage.getItem("token");
  const authHeader = { Authorization: `Bearer ${token}` };

  /* ── Fetch notes ── */
  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes", { headers: authHeader });
      if (res.ok) setNotes(await res.json());
    } catch (e) {
      console.error("Fetch notes error:", e);
    } finally {
      setLoading(false);
    }
  };

  /* ── Create / Update ── */
  const handleSave = async ({ title, content, tag, color }) => {
    const isEdit = !!modal?.note?._id;
    const url    = isEdit ? `/api/notes/${modal.note._id}` : "/api/notes";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ title, content, tag, color }),
      });

      if (res.ok) {
        const saved = await res.json();
        if (isEdit) {
          setNotes(prev => prev.map(n => n._id === saved._id ? saved : n));
          triggerToast("Note updated ✓");
        } else {
          setNotes(prev => [saved, ...prev]);
          triggerToast("Note created ✓");
        }
        setModal(null);
      } else {
        triggerToast("Failed to save note.");
      }
    } catch (e) {
      console.error("Save note error:", e);
      triggerToast("Server error.");
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE", headers: authHeader });
      if (res.ok) {
        setNotes(prev => prev.filter(n => n._id !== id));
        triggerToast(`Deleted "${title}"`);
      }
    } catch (e) {
      console.error("Delete note error:", e);
    }
  };

  /* ── Filtering ── */
  const filtered = notes.filter(n => {
    const matchTag    = activeTag === "All" || n.tag === activeTag;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                        (n.content || "").toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const allTags = ["All", ...TAGS];

  return (
    <div className="min-h-screen bg-[#f8faf8] flex font-sans text-gray-800">
      <Sidebar />

      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">

        {/* ── Header ── */}
        <header className="flex items-center justify-between px-6 md:px-8 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex-1 max-w-md flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 ml-12 lg:ml-0">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder="Search notes…"
              className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full font-medium"
            />
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition ml-3">
            <Bell size={20} />
          </button>
        </header>

        {/* ── Main ── */}
        <main className="flex-1 px-5 md:px-8 py-7">

          {/* Page title + create button */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">My Notes</h1>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {notes.length} note{notes.length !== 1 ? "s" : ""} · organised by tag
              </p>
            </div>
            <button
              onClick={() => setModal({ mode: "create", note: null })}
              className="bg-[#004D40] hover:bg-[#00382e] text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-[#004D40]/20 transition"
            >
              <Plus size={15} /> New Note
            </button>
          </div>

          {/* Tag filter pills */}
          <div className="flex items-center gap-2 flex-wrap mb-7">
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition ${
                  activeTag === t
                    ? "bg-[#004D40] text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-[#004D40] hover:text-[#004D40]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-5 h-40 animate-pulse border border-gray-100">
                  <div className="h-3 bg-gray-100 rounded-full w-1/3 mb-3" />
                  <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded-full w-full mb-1" />
                  <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-14 text-center max-w-sm mx-auto mt-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#004D40] flex items-center justify-center mb-4">
                <NotebookTabs size={24} />
              </div>
              <h3 className="text-sm font-extrabold text-gray-700 mb-1">
                {search || activeTag !== "All" ? "No matching notes" : "No notes yet"}
              </h3>
              <p className="text-xs text-gray-400 font-medium mb-5">
                {search || activeTag !== "All" ? "Try a different filter or search term." : "Start writing your first note."}
              </p>
              {!search && activeTag === "All" && (
                <button
                  onClick={() => setModal({ mode: "create", note: null })}
                  className="bg-[#004D40] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#00382e] transition"
                >
                  <Plus size={14} /> Create Note
                </button>
              )}
            </div>
          )}

          {/* Notes grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Create-new card */}
              <button
                onClick={() => setModal({ mode: "create", note: null })}
                className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-5 h-full min-h-[160px] flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#004D40] hover:text-[#004D40] transition group"
              >
                <div className="w-10 h-10 rounded-2xl bg-gray-50 group-hover:bg-emerald-50 flex items-center justify-center transition">
                  <Plus size={20} />
                </div>
                <span className="text-xs font-bold">New Note</span>
              </button>

              {filtered.map(note => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={(n) => setModal({ mode: "edit", note: n })}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* ── Modal ── */}
      {modal && (
        <Modal
          note={modal.note}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* ── Toast ── */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}>
        <div className="bg-gray-900 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <FileText size={14} className="text-emerald-400" />
          {toast.message}
        </div>
      </div>
    </div>
  );
};

export default Notes;
