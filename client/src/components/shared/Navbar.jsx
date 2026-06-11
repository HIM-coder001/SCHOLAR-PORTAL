import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "Resources", path: "/resources" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "About",     path: "/about" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
          <rect width="32" height="32" rx="6" fill="#1a4731" />
          <path d="M8 22L16 10L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 19h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-[#1a4731] font-semibold text-lg tracking-tight">ScholarHub</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm font-medium transition-colors relative pb-0.5 ${
                isActive
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 w-44">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search library..."
            className="bg-transparent text-sm text-gray-500 placeholder-gray-400 outline-none w-full"
          />
        </div>

        {/* Bell */}
        <button className="relative p-1.5 text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <Link to="/login" className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-green-700 transition-colors block">
          <img
            src="https://i.pravatar.cc/40?img=47"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;