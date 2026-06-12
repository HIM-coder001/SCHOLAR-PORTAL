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
  const footerLinks = ["About", "Contact", "Privacy Policy", "Terms of Service"];
 
  return (
    <footer className="w-full bg-[#f4f6f4] border-t border-gray-200/50 px-8 py-5 font-sans">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#004D40] flex items-center justify-center shrink-0">
            <GraduationCapIcon />
          </div>
          <span className="text-[#004D40] font-extrabold text-sm tracking-tight font-outfit">ScholarHub</span>
        </div>
 
        {/* Copyright */}
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center md:text-left">
          © 2024 ScholarHub Academic Portal
        </p>

        {/* Links */}
        <div className="flex items-center gap-6 flex-wrap justify-center text-[10px] font-bold uppercase tracking-wider">
          {footerLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="text-gray-500 hover:text-[#004D40] transition"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
 
export default Footer;