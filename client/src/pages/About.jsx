import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import {
  BookOpen, Sparkles, Shield, FolderKanban,
  Award, Heart, ArrowRight, Zap, Target
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-[#f8faf8] flex flex-col font-sans text-gray-800">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden py-20 px-6 bg-gradient-to-b from-[#e8f0eb] via-[#f3f7f5] to-[#f8faf8] text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl -z-10" />
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#004D40] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100/50 shadow-sm">
            Discover ScholarHub
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-outfit mt-6 mb-5 leading-tight">
            Your Digital Sanctuary for <br />
            <span className="bg-gradient-to-r from-[#004D40] to-emerald-600 bg-clip-text text-transparent">
              Deep Academic Work
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ScholarHub is a collaborative educational portal designed to help university students centralize study guides, track coursework, and enhance performance through modern productivity tools.
          </p>
        </div>
      </section>

      {/* Main Core Mission Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-8 py-10">
        
        {/* Mission Statement Glass Card */}
        <div className="relative bg-white border border-gray-150 rounded-[32px] p-8 md:p-12 shadow-sm overflow-hidden mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full -z-10" />
          
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#004D40] flex items-center justify-center border border-emerald-100">
                  <Target size={18} />
                </div>
                <h2 className="text-xs font-extrabold text-[#004D40] uppercase tracking-widest">Our Vision</h2>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit leading-snug mb-4">
                Empowering scholars with the tools to focus, organize, and excel.
              </h3>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed font-medium">
                Modern academic environments are filled with fragmented information, unorganized storage, and distracting tools. ScholarHub is built on the philosophy of simplicity and unification. We consolidate resources, study trackers, and intelligent search into one cohesive dashboard.
              </p>
            </div>
            
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-50/50 to-emerald-50/20 border border-emerald-50/40 p-6 rounded-3xl text-center shadow-sm">
                <p className="text-3xl font-black text-[#004D40] font-outfit">10k+</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Resources</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50/50 to-indigo-50/20 border border-indigo-50/40 p-6 rounded-3xl text-center shadow-sm">
                <p className="text-3xl font-black text-indigo-700 font-outfit">99.9%</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Uptime</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50/50 to-amber-50/20 border border-amber-50/40 p-6 rounded-3xl text-center shadow-sm">
                <p className="text-3xl font-black text-amber-700 font-outfit">24/7</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">AI Assistant</p>
              </div>
              <div className="bg-gradient-to-br from-rose-50/50 to-rose-50/20 border border-rose-50/40 p-6 rounded-3xl text-center shadow-sm">
                <p className="text-3xl font-black text-rose-700 font-outfit">100%</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#004D40]">Platform Features</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit mt-2">What makes ScholarHub special</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#004D40] flex items-center justify-center border border-emerald-100 mb-5 group-hover:scale-110 transition duration-300">
                <BookOpen size={20} />
              </div>
              <h4 className="text-base font-extrabold text-gray-800 mb-2 font-outfit">Academic Resource Index</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Search, filter, and archive previous examination papers and syllabus guides by module codes, instructors, and departments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 mb-5 group-hover:scale-110 transition duration-300">
                <FolderKanban size={20} />
              </div>
              <h4 className="text-base font-extrabold text-gray-800 mb-2 font-outfit">Coursework Tracker</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Plan and visually organize assignment milestones, team reports, and reading lists inside a color-coded project board.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 mb-5 group-hover:scale-110 transition duration-300">
                <Sparkles size={20} />
              </div>
              <h4 className="text-base font-extrabold text-gray-800 mb-2 font-outfit">Scholar AI Assistant</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Interact with a persistent AI study companion built directly into the platform to help synthesize concepts and resolve queries.
              </p>
            </div>
          </div>
        </div>

        {/* Development & Technology Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-[#f4f7f4] border border-emerald-50 rounded-[32px] p-8 md:p-12 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#004D40] flex items-center justify-center border border-emerald-100">
                <Zap size={16} />
              </div>
              <h3 className="text-xs font-extrabold text-[#004D40] uppercase tracking-widest">Modern Stack</h3>
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 font-outfit mb-3">Designed for visual excellence & speed</h4>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-6 font-medium">
              We leverage clean UI paradigms, custom Tailwind variables, and efficient server query patterns. This ensures that the platform remains lightweight, secure, and responsive across all viewports.
            </p>
            <div className="flex gap-4">
              <Link to="/login" className="bg-[#004D40] hover:bg-[#00382e] text-white text-xs font-bold px-5 py-2.5 rounded-2xl transition flex items-center gap-1.5 shadow-md shadow-[#004D40]/20">
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-150 rounded-3xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100 font-bold font-outfit text-xs">R</div>
              <div>
                <h5 className="text-sm font-extrabold text-gray-800 font-outfit">React 19 & Tailwind CSS v4</h5>
                <p className="text-[11px] text-gray-400 font-medium">Declarative components with customized token design systems.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100 font-bold font-outfit text-xs">E</div>
              <div>
                <h5 className="text-sm font-extrabold text-gray-800 font-outfit">Express & Mongoose REST API</h5>
                <p className="text-[11px] text-gray-400 font-medium">MongoDB clusters indexing modules, chat logs, and project tasks.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100 font-bold font-outfit text-xs">O</div>
              <div>
                <h5 className="text-sm font-extrabold text-gray-800 font-outfit">Secure Social & JWT Auth</h5>
                <p className="text-[11px] text-gray-400 font-medium">Bcryptjs credentials and OAuth 2.0 logins with Google & GitHub.</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default About;
