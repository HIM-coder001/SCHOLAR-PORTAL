import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "Resources", path: "/resources" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "About",     path: "/about" },
];

// Graduation Cap SVG icon
const GraduationCapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path
      d="M12 3L2 8l10 5 10-5-10-5z"
      fill="white"
      stroke="white"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
    <path
      d="M6 10.5v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 8v5.5"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="20" cy="14.5" r="1" fill="white" />
  </svg>
);

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#004D40] flex items-center justify-center shadow-md shadow-[#004D40]/20">
          <GraduationCapIcon />
        </div>
        <span className="text-[#004D40] font-bold text-lg tracking-tight">ScholarHub</span>
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
                  ? "text-[#004D40] font-semibold"
                  : "text-gray-500 hover:text-[#004D40]"
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#004D40] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 w-44 focus-within:border-[#004D40] transition-colors">
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
        <button className="relative p-1.5 text-gray-500 hover:text-[#004D40] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* Login CTA */}
        <Link
          to="/login"
          className="bg-[#004D40] hover:bg-[#00382e] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;