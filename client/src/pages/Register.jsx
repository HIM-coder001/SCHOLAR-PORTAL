import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, BookOpen, Sparkles, ChevronDown } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    institution: "",
    course: "",
    agreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regError, setRegError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) return;
    if (!formData.email.includes("@")) {
      setRegError("Please enter a valid university email address.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setRegError(data.message || "Registration failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setRegError("");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Register Error:", error);
      setRegError("Network connection error connecting to server.");
    }
  };

  const handleOAuthSignIn = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-[#f1f3f0] flex flex-col justify-between font-sans text-gray-800">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-10 min-h-[660px] border border-gray-150">
          
          {/* Left Panel (40% width / 4 cols) - Green Grid & Glassmorphism */}
          <div 
            className="hidden md:flex md:col-span-4 bg-[#004D40] p-10 flex-col justify-between relative overflow-hidden text-white"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "36px 36px"
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
                  <path d="M6 10.5v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 8v5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="20" cy="14.5" r="1" fill="white" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight font-outfit">ScholarHub</span>
            </div>

            {/* Description & Features */}
            <div className="space-y-10 my-auto pr-2">
              <div>
                <p className="text-base text-emerald-100/90 leading-relaxed font-outfit font-medium">
                  Your digital sanctuary for deep work and scholarly discovery.
                </p>
              </div>

              {/* Glass Card 1 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <BookOpen size={20} className="text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1.5">
                    Extensive Repository
                  </h4>
                  <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
                    Access over 10,000+ past papers, research notes, and academic resources.
                  </p>
                </div>
              </div>

              {/* Glass Card 2 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Sparkles size={20} className="text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1.5">
                    AI-Powered Assistant
                  </h4>
                  <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
                    Personalized study guidance and instant query resolution for complex topics.
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-label at bottom */}
            <div className="text-[10px] text-emerald-200/50 uppercase tracking-widest font-extrabold">
              Digital Sanctuary
            </div>
          </div>

          {/* Right Panel (60% width / 6 cols) - Register Form */}
          <div className="md:col-span-6 p-10 md:p-14 flex flex-col justify-center bg-[#fafbfa]">
            <div className="mb-8">
              <h3 className="text-3xl font-extrabold text-gray-900 mb-2 font-outfit">
                Create Account
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Join the community of scholars today.
              </p>
            </div>

            {/* Error Message */}
            {regError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                {regError}
              </div>
            )}

            {/* Social Actions */}
             <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                className="flex items-center justify-center gap-2.5 border border-gray-200 hover:bg-gray-50 py-3 rounded-2xl text-xs font-bold text-gray-600 bg-white transition cursor-pointer shadow-sm"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn("github")}
                className="flex items-center justify-center gap-2.5 border border-gray-200 hover:bg-gray-50 py-3 rounded-2xl text-xs font-bold text-gray-600 bg-white transition cursor-pointer shadow-sm"
              >
                <svg className="w-5 h-5 shrink-0 fill-current text-gray-950" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <hr className="w-full border-gray-200" />
              <span className="absolute bg-[#fafbfa] px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Or register with email
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#f4f6f4] border border-gray-200/60 focus:bg-white rounded-2xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#004D40] shadow-sm transition font-medium"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#f4f6f4] border border-gray-200/60 focus:bg-white rounded-2xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#004D40] shadow-sm transition font-medium"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Password */}
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#f4f6f4] border border-gray-200/60 focus:bg-white rounded-2xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#004D40] shadow-sm transition font-medium"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-10 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-[#f4f6f4] border border-gray-200/60 focus:bg-white rounded-2xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#004D40] shadow-sm transition font-medium"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-10 flex items-center text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Institution select */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Institution
                  </label>
                  <div className="relative">
                    <select
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full bg-[#f4f6f4] border border-gray-200/60 rounded-2xl px-4 py-3.5 text-sm appearance-none focus:outline-none focus:border-[#004D40] text-gray-600 focus:bg-white transition cursor-pointer font-semibold"
                    >
                      <option value="">Select Institution</option>
                      <option value="MIT">Massachusetts Institute of Technology</option>
                      <option value="Stanford">Stanford University</option>
                      <option value="Harvard">Harvard University</option>
                      <option value="Oxford">Oxford University</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Course */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Course
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full bg-[#f4f6f4] border border-gray-200/60 focus:bg-white rounded-2xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#004D40] shadow-sm transition font-medium"
                  />
                </div>
              </div>

              {/* Agreement */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-gray-500 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={formData.agreed}
                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    className="mt-0.5 w-4.5 h-4.5 rounded text-[#004D40] border-gray-300 focus:ring-[#004D40] cursor-pointer"
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#terms" className="text-[#004D40] font-bold hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#privacy" className="text-[#004D40] font-bold hover:underline">Privacy Policy</a>.
                  </span>
                </label>
              </div>

              {/* Register button */}
              <button
                type="submit"
                disabled={!formData.agreed}
                className={`w-full text-base font-bold py-3.5 rounded-2xl shadow-lg transition mt-4 cursor-pointer flex items-center justify-center ${
                  formData.agreed
                    ? "bg-[#004D40] hover:bg-[#00382e] text-white shadow-emerald-950/20"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                Register
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-8 text-center text-sm text-gray-500 font-semibold">
              Already have an account?{" "}
              <Link to="/login" className="text-[#004D40] font-extrabold hover:underline">
                Login
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-5 text-center border-t border-gray-200/50 bg-white">
        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
          © 2024 ScholarHub Academic Portal
        </p>
      </footer>
    </div>
  );
};

export default Register;
