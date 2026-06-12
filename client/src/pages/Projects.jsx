import { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import {
  FolderKanban, Plus, Search, Bell, Trash2, Pencil,
  X, Save, Clock, Calendar, CheckCircle2, Circle,
  Timer, RotateCcw
} from "lucide-react";

/* ─── Constants ─────────────────────────────────────── */
const COLORS = [
  { bg: "bg-[#004D40]", text: "text-white",       light: "bg-emerald-50 text-emerald-800" },
  { bg: "bg-indigo-600", text: "text-white",      light: "bg-indigo-50  text-indigo-800"  },
  { bg: "bg-amber-400",  text: "text-amber-900",  light: "bg-amber-50   text-amber-800"   },
  { bg: "bg-rose-500",   text: "text-white",      light: "bg-rose-50    text-rose-800"    },
  { bg: "bg-sky-500",    text: "text-white",      light: "bg-sky-50     text-sky-800"     },
];

const STATUSES = ["Planning", "In Progress", "Review", "Completed"];

const STATUS_STYLES = {
  "Planning":    { icon: Circle,       cls: "text-gray-400",   badge: "bg-gray-100 text-gray-600"   },
  "In Progress": { icon: Timer,        cls: "text-amber-500",  badge: "bg-amber-50 text-amber-700"  },
  "Review":      { icon: RotateCcw,    cls: "text-indigo-500", badge: "bg-indigo-50 text-indigo-700"},
  "Completed":   { icon: CheckCircle2, cls: "text-emerald-500",badge: "bg-emerald-50 text-emerald-700"},
};

/* ─── Modal ──────────────────────────────────────────── */
const Modal = ({ project, onClose, onSave }) => {
  const [title, setTitle]         = useState(project?.title       || "");
  const [description, setDesc]    = useState(project?.description || "");
  const [status, setStatus]       = useState(project?.status      || STATUSES[0]);
  const [dueDate, setDueDate]     = useState(project?.dueDate     || "");
  const [color, setColor]         = useState(project?.color       ?? 0);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description, status, dueDate, color });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className={`h-2 ${COLORS[color].bg}`} />
        <div className="p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-gray-800 font-outfit">
              {project?._id ? "Edit Project" : "New Project"}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
              <X size={18} />
            </button>
          </div>

          {/* Title */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Project title…"
            className="w-full text-xl font-bold text-gray-900 placeholder-gray-300 bg-transparent border-b-2 border-gray-100 focus:border-[#004D40] outline-none pb-2 mb-4 transition"
          />

          {/* Description */}
          <textarea
            value={description}
            onChange={e => setDesc(e.target.value)}
            placeholder="Describe this project…"
            rows={4}
            className="w-full text-sm text-gray-700 bg-gray-50 rounded-2xl p-4 outline-none resize-none focus:ring-2 focus:ring-[#004D40]/20 transition font-medium mb-4"
          />

          {/* Status + Due Date */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full text-xs font-bold text-gray-700 bg-gray-100 rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full text-xs font-bold text-gray-700 bg-gray-100 rounded-xl px-3 py-2 outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Color</span>
            <div className="flex gap-1.5 ml-2">
              {COLORS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setColor(i)}
                  className={`w-5 h-5 rounded-full ${c.bg} ring-offset-1 transition ${color === i ? "ring-2 ring-gray-500" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-2.5 rounded-2xl bg-[#004D40] hover:bg-[#00382e] text-white text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-40"
            >
              <Save size={15} /> Save Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Project Card ───────────────────────────────────── */
const ProjectCard = ({ project, onEdit, onDelete }) => {
  const c      = COLORS[project.color ?? 0];
  const s      = STATUS_STYLES[project.status] || STATUS_STYLES["Planning"];
  const Icon   = s.icon;
  const date   = new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const due    = project.dueDate
    ? new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <div className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 relative overflow-hidden">
      {/* Color accent */}
      <div className={`absolute top-0 left-0 w-1 h-full ${c.bg} rounded-l-3xl`} />

      <div className="flex items-start justify-between pl-3">
        {/* Status badge */}
        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 ${s.badge}`}>
          <Icon size={10} /> {project.status}
        </span>
        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(project)} className="p-1.5 rounded-xl text-gray-400 hover:text-[#004D40] hover:bg-emerald-50 transition">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(project._id, project.title)} className="p-1.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="pl-3 flex-1">
        <h3 className="text-sm font-extrabold text-gray-800 mb-1 leading-snug line-clamp-2">{project.title}</h3>
        {project.description && (
          <p className="text-xs text-gray-400 font-medium line-clamp-3 leading-relaxed">{project.description}</p>
        )}
      </div>

      <div className="pl-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
          <Clock size={11} /> <span>{date}</span>
        </div>
        {due && (
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
            <Calendar size={11} /> <span>Due {due}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Projects Page ──────────────────────────────────── */
const Projects = () => {
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [activeStatus, setStatus]   = useState("All");
  const [modal, setModal]           = useState(null);
  const [toast, setToast]           = useState({ show: false, message: "" });

  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const token      = localStorage.getItem("token");
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", { headers: authHeader });
      if (res.ok) setProjects(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async ({ title, description, status, dueDate, color }) => {
    const isEdit = !!modal?.project?._id;
    const url    = isEdit ? `/api/projects/${modal.project._id}` : "/api/projects";
    const method = isEdit ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ title, description, status, dueDate, color }),
      });
      if (res.ok) {
        const saved = await res.json();
        if (isEdit) {
          setProjects(prev => prev.map(p => p._id === saved._id ? saved : p));
          triggerToast("Project updated ✓");
        } else {
          setProjects(prev => [saved, ...prev]);
          triggerToast("Project created ✓");
        }
        setModal(null);
      } else {
        triggerToast("Failed to save project.");
      }
    } catch (e) {
      console.error(e);
      triggerToast("Server error.");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE", headers: authHeader });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p._id !== id));
        triggerToast(`Deleted "${title}"`);
      }
    } catch (e) { console.error(e); }
  };

  const allStatuses = ["All", ...STATUSES];
  const filtered = projects.filter(p => {
    const matchStatus = activeStatus === "All" || p.status === activeStatus;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        (p.description || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Stats counts
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = projects.filter(p => p.status === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f8faf8] flex font-sans text-gray-800">
      <Sidebar />

      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">

        {/* Header */}
        <header className="flex items-center justify-between px-6 md:px-8 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex-1 max-w-md flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 ml-12 lg:ml-0">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder="Search projects…"
              className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full font-medium"
            />
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition ml-3">
            <Bell size={20} />
          </button>
        </header>

        <main className="flex-1 px-5 md:px-8 py-7">

          {/* Page title */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">Projects</h1>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""} · track your academic work</p>
            </div>
            <button
              onClick={() => setModal({ project: null })}
              className="bg-[#004D40] hover:bg-[#00382e] text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-[#004D40]/20 transition"
            >
              <Plus size={15} /> New Project
            </button>
          </div>

          {/* Status summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
            {STATUSES.map(s => {
              const st = STATUS_STYLES[s];
              const Icon = st.icon;
              return (
                <button
                  key={s}
                  onClick={() => setStatus(activeStatus === s ? "All" : s)}
                  className={`text-left p-4 rounded-2xl border transition ${activeStatus === s ? "border-[#004D40] bg-white shadow-md" : "border-gray-100 bg-white hover:shadow-sm"}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${st.badge}`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-lg font-extrabold text-gray-800">{counts[s] || 0}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s}</p>
                </button>
              );
            })}
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-2 flex-wrap mb-7">
            {allStatuses.map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition ${
                  activeStatus === s
                    ? "bg-[#004D40] text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-[#004D40] hover:text-[#004D40]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-5 h-44 animate-pulse border border-gray-100">
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
                <FolderKanban size={24} />
              </div>
              <h3 className="text-sm font-extrabold text-gray-700 mb-1">
                {search || activeStatus !== "All" ? "No matching projects" : "No projects yet"}
              </h3>
              <p className="text-xs text-gray-400 font-medium mb-5">
                {search || activeStatus !== "All" ? "Try clearing the filter." : "Start tracking your academic projects."}
              </p>
              {!search && activeStatus === "All" && (
                <button
                  onClick={() => setModal({ project: null })}
                  className="bg-[#004D40] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#00382e] transition"
                >
                  <Plus size={14} /> Create Project
                </button>
              )}
            </div>
          )}

          {/* Projects grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Quick-add tile */}
              <button
                onClick={() => setModal({ project: null })}
                className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-5 min-h-[160px] flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#004D40] hover:text-[#004D40] transition group"
              >
                <div className="w-10 h-10 rounded-2xl bg-gray-50 group-hover:bg-emerald-50 flex items-center justify-center transition">
                  <Plus size={20} />
                </div>
                <span className="text-xs font-bold">New Project</span>
              </button>

              {filtered.map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={(p) => setModal({ project: p })}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          project={modal.project}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}>
        <div className="bg-gray-900 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <FolderKanban size={14} className="text-emerald-400" />
          {toast.message}
        </div>
      </div>
    </div>
  );
};

export default Projects;
