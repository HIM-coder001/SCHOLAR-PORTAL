import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileSpreadsheet,
  NotebookTabs,
  FolderKanban,
  Bot,
  Bookmark,
  Download,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

// Graduation Cap SVG icon — matching Navbar
const GraduationCapIcon = ({ size = 18, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
    <path d="M12 3L2 8l10 5 10-5-10-5z" fill={color} stroke={color} strokeWidth="0.5" strokeLinejoin="round" />
    <path d="M6 10.5v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 8v5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="20" cy="14.5" r="1" fill={color} />
  </svg>
);

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Toggle document theme class when state updates
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // Close drawer when route changes on mobile
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = [
    { label: "Dashboard",   path: "/dashboard",   icon: LayoutDashboard },
    { label: "Past Papers", path: "/past-papers", icon: FileSpreadsheet },
    { label: "Notes",       path: "/notes",        icon: NotebookTabs },
    { label: "Projects",    path: "/projects",    icon: FolderKanban },
    { label: "AI Assistant",path: "/ai-assistant", icon: Bot },
    { label: "Bookmarks",   path: "/bookmarks",   icon: Bookmark },
    { label: "Downloads",   path: "/downloads",   icon: Download },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <Link to="/" className="mb-10 px-2.5 flex items-center gap-3 cursor-pointer group">
        <div className="w-9 h-9 rounded-xl bg-[#004D40] flex items-center justify-center shadow-md shadow-[#004D40]/20 shrink-0 group-hover:bg-[#00382e] transition">
          <GraduationCapIcon size={18} color="white" />
        </div>
        <div>
          <h1 className="text-[#004D40] font-black text-xl tracking-tight font-outfit leading-none">
            ScholarHub
          </h1>
          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mt-0.5">
            Academic Portal
          </p>
        </div>
      </Link>

      {/* Segmented Theme Switcher */}
      <div className="bg-gray-100 dark:bg-slate-800/60 p-3 rounded-2xl mb-8 border border-gray-200/30 dark:border-slate-850">
        <p className="text-[9px] font-extrabold text-gray-450 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">
          Interface Theme
        </p>
        <div className="flex gap-1.5 bg-gray-50 dark:bg-slate-900/60 p-1 rounded-xl border border-gray-200/50 dark:border-slate-800">
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${
              theme === "light"
                ? "bg-white text-[#004D40] shadow-sm"
                : "text-gray-400 hover:text-gray-650 dark:hover:text-slate-350"
            }`}
          >
            <Sun size={14} className={theme === "light" ? "text-amber-500" : ""} />
            <span>Light</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${
              theme === "dark"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-650 dark:hover:text-slate-350"
            }`}
          >
            <Moon size={14} className={theme === "dark" ? "text-indigo-400" : ""} />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.path;
          return (
            <Link
              key={link.label}
              to={link.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#004D40] text-white shadow-md shadow-emerald-950/10"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Links */}
      <div className="border-t border-gray-200/80 dark:border-slate-800 pt-5 space-y-1">
        {[
          { label: "Profile",  path: "/profile",  Icon: User },
          { label: "Settings", path: "/settings", Icon: Settings },
        ].map(({ label, path, Icon }) => (
          <Link
            key={label}
            to={path}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition duration-200 cursor-pointer ${
              currentPath === path
                ? "bg-[#004D40] text-white"
                : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Icon size={20} className="text-gray-400" />
            <span>{label}</span>
          </Link>
        ))}



        <Link
          to="/login"
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition duration-200 cursor-pointer"
        >
          <LogOut size={20} className="text-rose-400" />
          <span>Logout</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* ── Hamburger button — visible only on small screens ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[#004D40] text-white flex items-center justify-center shadow-lg shadow-[#004D40]/30 transition hover:bg-[#00382e]"
      >
        <Menu size={20} />
      </button>

      {/* ── Backdrop overlay (mobile) ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300"
        />
      )}

      {/* ── Slide-in drawer (mobile) ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-[#f7faf7] dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col py-8 px-5 z-40 font-sans transition-transform duration-300 ease-in-out shadow-2xl ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 flex items-center justify-center transition"
        >
          <X size={18} />
        </button>

        <SidebarContent />
      </aside>

      {/* ── Permanent sidebar (desktop lg+) ── */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-[#f7faf7] dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex-col py-8 px-5 fixed left-0 top-0 z-20 font-sans">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;