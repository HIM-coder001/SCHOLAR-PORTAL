import { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import { Link } from "react-router-dom";
import { 
  Search, 
  Mic, 
  Bell, 
  Plus, 
  Brain, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Play, 
  Download, 
  BookOpen, 
  FileText, 
  Bookmark,
  CheckCircle2,
  Trash2,
  FolderKanban
} from "lucide-react";

const Dashboard = () => {
  const [toast, setToast] = useState({ show: false, message: "" });
  const [papers, setPapers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  // Dynamic profile metadata
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName = user.fullName || "Alex Rivers";
  const userCourse = user.course || "Undergraduate";

  const triggerToast = (message) => {
    setToast({ show: true, message });
    const timer = setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3500);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    fetchPapers();
    fetchNotes();
  }, []);

  const fetchPapers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/papers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPapers(data);
      }
    } catch (err) {
      console.error("Fetch papers error:", err);
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error("Fetch notes error:", err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleDeleteNote = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete note "${title}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
        triggerToast(`Deleted note: "${title}"`);
      } else {
        triggerToast("Failed to delete note.");
      }
    } catch (err) {
      console.error("Delete note error:", err);
      triggerToast("Error connecting to server.");
    }
  };

  // Static list for recommended cover section
  const recommendedItems = [
    {
      category: "RESEARCH JOURNAL",
      title: "Cognitive Behavioral Trends 2024",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
      info: "JC • AK",
      isNew: true,
      iconType: "avatars",
    },
    {
      category: "VIDEO LECTURE",
      title: "Foundations of Molecular Biology",
      image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=400&auto=format&fit=crop&q=80",
      info: "45 mins • Prof. Smith",
      iconType: "play",
    },
    {
      category: "DATASET",
      title: "Global Climate Patterns (2010-2023)",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
      info: "CSV • 154 MB",
      iconType: "download",
    },
    {
      category: "E-BOOK",
      title: "The Silk Road: A Historical Map",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&auto=format&fit=crop&q=80",
      info: "PDF • 12 MB",
      iconType: "book",
    },
  ];

  // Static downloads tracking
  const downloads = [
    {
      title: "Quantum Physics II.pdf",
      details: "2.4 MB • 2 hours ago",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      ext: "PDF",
    },
    {
      title: "Macroeconomics Notes.docx",
      details: "856 KB • 5 hours ago",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      ext: "DOC",
    },
    {
      title: "Lab_Data_Set_04.xlsx",
      details: "12 MB • Yesterday",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      ext: "XLS",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex font-sans text-gray-800">
      <Sidebar />

      {/* Main Layout — lg: sidebar offset; mobile: full width */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
          {/* Search bar with ml-12 for mobile hamburger menu clearance */}
          <div className="flex-1 max-w-lg flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 ml-12 lg:ml-0 transition-shadow focus-within:shadow-md focus-within:border-[#004D40]/30">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search resources, papers, or notes..."
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full font-medium"
            />
            <Mic size={18} className="text-gray-400 shrink-0 cursor-pointer hover:text-[#004D40] transition" />
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => triggerToast("You have no new notifications.")}
              className="relative p-2.5 text-gray-500 hover:text-[#004D40] bg-gray-50 hover:bg-emerald-50 rounded-full transition cursor-pointer"
            >
              <Bell size={20} className="stroke-[2]" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>

            {/* User Meta Card */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <h4 className="text-sm font-extrabold text-gray-900 font-outfit leading-none">
                  {fullName}
                </h4>
                <span className="text-xs font-bold text-[#004D40] tracking-wide mt-1 block">
                  {userCourse}
                </span>
              </div>
              <Link to="/profile" className="w-11 h-11 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#004D40] shadow-sm transition cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 px-6 md:px-10 py-8">
          
          {/* Dashboard Greeting Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight font-outfit mb-3">
                Academic Hub
              </h1>
              <p className="text-base text-gray-600 font-medium max-w-2xl">
                Welcome back, {fullName.split(" ")[0]}. You have <span className="text-[#004D40] font-bold">3 pending assignments</span> and <span className="text-[#004D40] font-bold">{papers.length} resource papers</span> logged in the library. Let's keep the momentum going.
              </p>
            </div>
            
            <Link 
              to="/projects"
              className="bg-[#004D40] hover:bg-[#00382e] text-white text-sm font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#004D40]/20 transition shrink-0 self-start md:self-auto hover:-translate-y-0.5"
            >
              <FolderKanban size={18} />
              <span>Go to Projects</span>
            </Link>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left 2 Columns */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* AI Study Insights widget */}
              <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-100/80 rounded-[2rem] p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-white shadow-sm rounded-xl text-[#004D40]">
                    <Brain size={22} className="stroke-[2.2]" />
                  </div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#004D40]">
                    AI Study Insights
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Focus Areas */}
                  <div className="bg-white/80 backdrop-blur-sm border border-white rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition min-h-[150px]">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Focus Areas
                      </h4>
                      <p className="text-sm text-gray-800 leading-relaxed font-semibold">
                        Your performance in <span className="text-amber-600">Cognitive Models</span> has dipped. Consider reviewing the 2023 Past Papers.
                      </p>
                    </div>
                  </div>

                  {/* Schedule Optimization */}
                  <div className="bg-white/80 backdrop-blur-sm border border-white rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition min-h-[150px]">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Optimal Time
                      </h4>
                      <p className="text-sm text-gray-800 leading-relaxed font-semibold">
                        You're most productive between <span className="text-[#004D40]">10 AM and 1 PM</span>. Schedule your deep reading then.
                      </p>
                    </div>
                  </div>

                  {/* Live Recommendation */}
                  <div className="bg-[#004D40] text-white rounded-3xl p-6 flex flex-col justify-between shadow-lg shadow-[#004D40]/20 min-h-[150px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                          Live Match
                        </h4>
                      </div>
                      <h5 className="text-base font-bold font-outfit mb-2 leading-tight">
                        Neuroplasticity: Deep Dive
                      </h5>
                      <p className="text-xs text-emerald-100/90 leading-relaxed font-medium line-clamp-2">
                        A newly added thesis paper aligns perfectly with your draft.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => triggerToast('Opening Analysis...')}
                      className="relative z-10 flex items-center gap-2 text-sm font-bold text-emerald-300 hover:text-white transition mt-4 self-start"
                    >
                      <span>Analyze now</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Recommended For You Section */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-extrabold text-gray-900 font-outfit tracking-wide">
                    Recommended for You
                  </h3>
                  <Link to="/past-papers" className="text-sm font-bold text-[#004D40] hover:underline">View Library</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                  {recommendedItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-gray-200/60 rounded-[24px] overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-36 object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {item.isNew && (
                          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#004D40] text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                            New
                          </span>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                        <div>
                          <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block mb-2">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                          <span className="text-xs font-bold text-gray-500">
                            {item.info}
                          </span>
                          
                          <button 
                            onClick={() => triggerToast(`Saved "${item.title}" to library.`)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-[#004D40] text-gray-500 hover:text-white rounded-full transition cursor-pointer"
                          >
                            {item.iconType === "avatars" && <Bookmark size={14} className="stroke-[2.5]" />}
                            {item.iconType === "play" && <Play size={14} className="stroke-[2.5] ml-0.5" />}
                            {item.iconType === "download" && <Download size={14} className="stroke-[2.5]" />}
                            {item.iconType === "book" && <BookOpen size={14} className="stroke-[2.5]" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Past Papers */}
              <div className="bg-white border border-gray-200/60 rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-extrabold text-gray-900 font-outfit tracking-wide">
                    Trending Past Papers
                  </h3>
                  <Link to="/past-papers" className="text-sm font-bold text-[#004D40] hover:underline">Explore All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {papers.filter(p => !p.isFeatured).slice(0, 4).map((paper, i) => (
                    <div 
                      key={paper._id} 
                      onClick={() => triggerToast(`Viewing syllabus module for "${paper.title}" (${paper.module})...`)}
                      className="group flex items-center justify-between p-5 rounded-3xl bg-gray-50 hover:bg-[#004D40]/5 border border-transparent hover:border-[#004D40]/20 transition duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-black text-gray-400 group-hover:text-[#004D40] group-hover:shadow-md transition">
                          0{i + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#004D40] transition">
                            {paper.title}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium mt-1">
                            {paper.module} • {paper.semester}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-gray-300 group-hover:text-[#004D40] transition p-2 bg-white rounded-full shadow-sm">
                        <TrendingUp size={16} className="stroke-[2.5]" />
                      </div>
                    </div>
                  ))}

                  {papers.length === 0 && (
                    <div className="col-span-2 text-center p-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-sm text-gray-500 font-bold">
                      No papers loaded from server database yet.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Panel - Downloads & Notes */}
            <div className="space-y-8">
              
              {/* Recent Downloads widget */}
              <div className="bg-white border border-gray-200/60 rounded-[2rem] p-7 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-extrabold text-gray-900 font-outfit tracking-wide">
                    Recent Downloads
                  </h3>
                  <Link to="/downloads" className="text-xs font-bold text-[#004D40] uppercase tracking-wider hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {downloads.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => triggerToast(`Opening local file "${item.title}"...`)}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-gray-100 transition duration-200 cursor-pointer group"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor} font-black text-sm shadow-sm group-hover:scale-105 transition-transform`}>
                        {item.ext}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-[#004D40] transition">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                          {item.details}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Active downloading indicator */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-[#004D40]/30 bg-emerald-50/30">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-white text-[#004D40] shadow-sm">
                      <div className="w-5 h-5 border-2 border-[#004D40] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        Downloading...
                      </h4>
                      <p className="text-xs text-[#004D40] font-bold mt-1">
                        Sociology_Module_5.zip
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recently Added Notes widget */}
              <div className="bg-white border border-gray-200/60 rounded-[2rem] p-7 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-extrabold text-gray-900 font-outfit tracking-wide">
                    Recent Notes
                  </h3>
                  <Link to="/notes" className="text-xs font-bold text-[#004D40] uppercase tracking-wider hover:underline">
                    Manage Notes
                  </Link>
                </div>

                <div className="space-y-4">
                  {loadingNotes ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-2xl"></div>
                      ))}
                    </div>
                  ) : notes.length > 0 ? (
                    notes.slice(0, 3).map((note) => (
                      <div 
                        key={note._id}
                        className="p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-md transition duration-300 group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#004D40] transition">
                            {note.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note._id, note.title);
                            }}
                            className="p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-3">
                          {note.content || "No content summary available."}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <Clock size={12} />
                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 mb-3">
                        <FileText size={20} />
                      </div>
                      <p className="text-sm text-gray-500 font-bold mb-3">No notes created yet.</p>
                      <Link to="/notes" className="text-xs font-extrabold text-[#004D40] bg-emerald-50 px-4 py-2 rounded-lg hover:bg-[#004D40] hover:text-white transition">
                        Create your first note
                      </Link>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Global Toast */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ${
        toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}>
        <div className="bg-gray-900 text-white text-sm font-bold px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-400" />
          {toast.message}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
