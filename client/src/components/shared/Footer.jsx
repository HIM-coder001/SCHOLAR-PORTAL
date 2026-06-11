const Footer = () => {
  const footerLinks = ["About", "Contact", "Privacy Policy", "Terms of Service"];
 
  return (
    <footer className="w-full bg-[#f4f6f4] border-t border-gray-200/50 px-8 py-5 font-sans">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <rect width="32" height="32" rx="6" fill="#004D40" />
              <path d="M8 22L16 10L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 19h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
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
              className="text-gray-500 hover:text-gray-800 transition"
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