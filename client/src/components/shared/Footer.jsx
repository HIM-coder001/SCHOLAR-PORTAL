import { Link } from "react-router-dom";

// Graduation Cap SVG icon for footer branding
const GraduationCapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={14} height={14}>
    <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
    <path d="M6 10.5v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 8v5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="20" cy="14.5" r="1" fill="white" />
  </svg>
);

const Footer = () => {
  const footerLinks = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "#contact" },
    { label: "Privacy Policy", path: "#privacy-policy" },
    { label: "Terms of Service", path: "#terms" }
  ];
 
  return (
    <footer className="w-full bg-[#f4f6f4] dark:bg-slate-900 border-t border-gray-200/50 dark:border-slate-800 px-8 py-5 font-sans transition-colors duration-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#004D40] flex items-center justify-center shrink-0">
            <GraduationCapIcon />
          </div>
          <span className="text-[#004D40] dark:text-emerald-400 font-extrabold text-sm tracking-tight font-outfit">ScholarHub</span>
        </div>
 
        {/* Copyright */}
        <p className="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider text-center md:text-left">
          © 2024 ScholarHub Academic Portal
        </p>

        {/* Links */}
        <div className="flex items-center gap-6 flex-wrap justify-center text-[10px] font-bold uppercase tracking-wider">
          {footerLinks.map((link) => {
            const isHash = link.path.startsWith("#");
            return isHash ? (
              <a
                key={link.label}
                href={link.path}
                className="text-gray-500 dark:text-slate-400 hover:text-[#004D40] dark:hover:text-white transition"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.path}
                className="text-gray-500 dark:text-slate-400 hover:text-[#004D40] dark:hover:text-white transition"
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
 
export default Footer;