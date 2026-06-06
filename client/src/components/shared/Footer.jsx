
const Footer = () => {
  const footerLinks = ["About", "Contact", "Privacy Policy", "Terms of Service"];
 
  return (
    <footer className="w-full bg-white border-t border-gray-100 px-6 py-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <rect width="32" height="32" rx="6" fill="#1a4731" />
              <path d="M8 22L16 10L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 19h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[#1a4731] font-semibold text-base tracking-tight">ScholarHub</span>
        </div>
 
        {/* Links */}
        <div className="flex items-center gap-6 flex-wrap justify-center">
          {footerLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
 
        {/* Copyright */}
        <p className="text-xs text-gray-400 whitespace-nowrap">
          © 2024 ScholarHub Academic Portal
        </p>
      </div>
    </footer>
  );
};
 
export default Footer;