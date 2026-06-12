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

  const handleSocialRegister = async () => {
    setRegError("");
    const demoUser = {
      fullName: "Alex Rivers",
      email: "alex.rivers@university.edu",
      password: "demo123456",
      institution: "Stanford University",
      course: "Computer Science",
    };

    try {
      // Try register first
      let response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoUser),
      });

      // If user already exists, login instead
      if (!response.ok) {
        response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: demoUser.email, password: demoUser.password }),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        setRegError(data.message || "Social sign-up failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Social Register Error:", error);
      setRegError("Network error. Make sure the server is running.");
    }
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
                onClick={handleSocialRegister}
                className="flex items-center justify-center gap-2.5 border border-gray-200 hover:bg-gray-50 py-3 rounded-2xl text-xs font-bold text-gray-600 bg-white transition cursor-pointer shadow-sm"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.138 4.114-3.417 0-6.19-2.77-6.19-6.186 0-3.417 2.773-6.187 6.19-6.187 1.565 0 2.99.593 4.095 1.564l3.08-3.08C19.333 2.224 16.037 1 12.24 1 5.922 1 1 5.923 1 12.215S5.922 23.43 12.24 23.43c5.688 0 10.603-3.834 10.603-11.215 0-.648-.052-1.3-.156-1.93H12.24Z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleSocialRegister}
                className="flex items-center justify-center gap-2.5 border border-gray-200 hover:bg-gray-50 py-3 rounded-2xl text-xs font-bold text-gray-600 bg-white transition cursor-pointer shadow-sm"
              >
                <svg className="w-4.5 h-4.5 fill-currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
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
