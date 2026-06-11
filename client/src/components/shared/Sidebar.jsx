import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileSpreadsheet,
  NotebookTabs,
  Bot,
  Bookmark,
  Download,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Past Papers", path: "/past-papers", icon: FileSpreadsheet },
    { label: "Notes", path: "/notes", icon: NotebookTabs },
    { label: "AI Assistant", path: "/ai-assistant", icon: Bot },
    { label: "Bookmarks", path: "/bookmarks", icon: Bookmark },
    { label: "Downloads", path: "/downloads", icon: Download },
  ];

  const handleLogout = () => {
    // Clear interactive auth states
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#f7faf7] border-r border-gray-200 flex flex-col py-8 px-5 fixed left-0 top-0 z-20 font-sans">
      
      {/* Brand Title */}
      <div className="mb-10 px-2.5">
        <h1 className="text-[#004D40] font-black text-2xl tracking-tight font-outfit">
          ScholarHub
        </h1>
        <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest mt-0.5">
          Academic Portal
        </p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.path;
          return (
            <Link
              key={link.label}
              to={link.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-base font-bold transition duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#004D40] text-white shadow-md shadow-emerald-950/10"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile, Settings & Logout Footer */}
      <div className="border-t border-gray-200/80 pt-6 space-y-2">
        <Link
          to="/profile"
          className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-base font-bold transition duration-200 cursor-pointer ${
            currentPath === "/profile"
              ? "bg-[#004D40] text-white font-bold"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <User size={20} className="text-gray-400" />
          <span>Profile</span>
        </Link>

        <Link
          to="/settings"
          className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-base font-bold transition duration-200 cursor-pointer ${
            currentPath === "/settings"
              ? "bg-[#004D40] text-white font-bold"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Settings size={20} className="text-gray-400" />
          <span>Settings</span>
        </Link>

        <Link
          to="/login"
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-base font-bold text-rose-600 hover:bg-rose-50 transition duration-200 cursor-pointer"
        >
          <LogOut size={20} className="text-rose-400" />
          <span>Logout</span>
        </Link>
      </div>

    </aside>
  );
};

export default Sidebar;