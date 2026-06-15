import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

import libraryMockup from "../assets/images/academic_library_mockup.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userJson = params.get("user");
    const error = params.get("error");

    if (error) {
      setAuthError(decodeURIComponent(error));
    } else if (token && userJson) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userJson));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(decodedUser));
        setAuthError("");
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate(redirectOrigin, { replace: true });
      } catch (err) {
        console.error("Failed to parse OAuth user data:", err);
        setAuthError("Failed to parse social login credentials.");
      }
    }
  }, [navigate, redirectOrigin]);

  const handleOAuthSignIn = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-[#f1f3f0] flex flex-col justify-between font-sans text-gray-800">
      
      {/* Centered Main Wrapper */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2 min-h-[620px] border border-gray-150">
          
          {/* Left Panel - Hero Graphic (Unlock Your Potential) */}
          <div className="hidden md:flex bg-[#f4f7f4] p-12 flex-col justify-between items-center text-center border-r border-gray-100">
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
                  onClick={() => handleOAuthSignIn("google")}
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-2xl text-xs font-bold text-gray-600 transition cursor-pointer bg-white shadow-sm"
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
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-2xl text-xs font-bold text-gray-600 transition cursor-pointer bg-white shadow-sm"
                >
                  <svg className="w-5 h-5 shrink-0 fill-current text-gray-950" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
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
