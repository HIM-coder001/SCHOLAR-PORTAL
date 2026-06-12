import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

import libraryMockup from "../assets/images/academic_library_mockup.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("scholar@university.edu");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState("");

  // Check if they came from a protected page redirect
  const redirectOrigin = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setAuthError("Please enter a valid university email address.");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthError("");
      navigate(redirectOrigin, { replace: true });
    } catch (error) {
      console.error("Login Error:", error);
      setAuthError("Network connection error connecting to server.");
    }
  };

  const handleSocialSignIn = async () => {
    setAuthError("");
    const demoUser = {
      fullName: "Alex Rivers",
      email: "alex.rivers@university.edu",
      password: "demo123456",
      institution: "Stanford University",
      course: "Computer Science",
    };

    try {
      // Try login first
      let response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoUser.email, password: demoUser.password }),
      });

      // If user doesn't exist yet, register them
      if (!response.ok) {
        response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(demoUser),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.message || "Social sign-in failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(redirectOrigin, { replace: true });
    } catch (error) {
      console.error("Social Sign-In Error:", error);
      setAuthError("Network error. Make sure the server is running.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f0] flex flex-col justify-between font-sans text-gray-800">
      
      {/* Centered Main Wrapper */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2 min-h-[620px] border border-gray-150">
          
          {/* Left Panel - Hero Graphic (Unlock Your Potential) */}
          <div className="bg-[#f4f7f4] p-12 flex flex-col justify-between items-center text-center border-r border-gray-100">
            <div className="max-w-md mx-auto mt-6">
              <h2 className="text-4xl font-extrabold text-[#004D40] tracking-tight font-outfit mb-4">
                Unlock Your Potential
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                The premier collaborative environment for modern scholarship and research discovery.
              </p>
            </div>

            {/* Simulated Carousel Image Display */}
            <div className="my-10 w-full max-w-sm bg-white p-5 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center">
              <div className="w-full rounded-2xl overflow-hidden relative group">
                <img
                  src={libraryMockup}
                  alt="Academic Library Platform"
                  className="w-full h-56 object-cover transform hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#004D40]/90 text-white text-xs uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm shadow-sm">
                  <span>📚</span> Academic Library
                </div>
              </div>
              <div className="w-full text-left mt-4 px-1">
                <h4 className="text-sm font-extrabold text-[#004D40] uppercase tracking-wider">
                  Academic Library Platform
                </h4>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-3.5 h-3.5 rounded-full bg-[#004D40]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
            </div>
          </div>

          {/* Right Panel - Form Submission */}
          <div className="p-10 md:p-16 flex flex-col justify-center bg-[#fdfdfd]">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-10">
              <div className="w-10 h-10 rounded-xl bg-[#004D40] flex items-center justify-center shadow-lg shadow-emerald-950/20">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
                  <path d="M6 10.5v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 8v5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="20" cy="14.5" r="1" fill="white" />
                </svg>
              </div>
              <span className="text-2xl font-black text-[#004D40] tracking-tight font-outfit">ScholarHub</span>
            </div>

            {/* Title */}
            <div className="mb-8">
              <h3 className="text-3xl font-extrabold text-gray-900 mb-2 font-outfit">
                Welcome back
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Access your academic dashboard and resources.
              </p>
            </div>

            {/* Error messaging */}
            {authError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                {authError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  University Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scholar@university.edu"
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#004D40] focus:ring-1 focus:ring-[#004D40] shadow-sm transition font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-12 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#004D40] focus:ring-1 focus:ring-[#004D40] shadow-sm transition font-medium"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none text-gray-500 font-semibold">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#004D40] border-gray-300 focus:ring-[#004D40] cursor-pointer"
                  />
                  Remember Me
                </label>
                <a href="#forgot" className="text-[#004D40] font-bold hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-[#004D40] hover:bg-[#00382e] text-white text-base font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition cursor-pointer mt-4"
              >
                <span>Login</span>
                <LogIn size={18} className="stroke-[2.2]" />
              </button>
            </form>

            {/* Separators */}
            <div className="mt-10">
              <div className="relative flex items-center justify-center mb-6">
                <hr className="w-full border-gray-200" />
                <span className="absolute bg-[#fdfdfd] px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleSocialSignIn}
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-2xl text-xs font-bold text-gray-600 transition cursor-pointer bg-white shadow-sm"
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
                  onClick={handleSocialSignIn}
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-2xl text-xs font-bold text-gray-600 transition cursor-pointer bg-white shadow-sm"
                >
                  <svg className="w-4.5 h-4.5 fill-currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>

            {/* Create Account switch */}
            <div className="mt-10 text-center text-sm text-gray-500 font-medium">
              Don't have an academic account yet?{" "}
              <Link to="/register" className="text-[#004D40] font-extrabold hover:underline">
                Create Account
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-5 text-center border-t border-gray-200/50 bg-white">
        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
          © 2024 ScholarHub Academic Portal • Secure SSL Encrypted
        </p>
      </footer>
    </div>
  );
};

export default Login;
