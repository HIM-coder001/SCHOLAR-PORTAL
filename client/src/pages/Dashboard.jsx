import { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
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
  Trash2
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

  const handleCreateNote = async () => {
    const title = prompt("Enter Note Title:");
    if (!title) return;
    const content = prompt("Enter Note Content (optional):");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content: content || "" })
      });

      if (res.ok) {
        const newNote = await res.json();
        setNotes((prev) => [newNote, ...prev]);
        triggerToast(`Created note: "${title}"`);
      } else {
        triggerToast("Failed to create note.");
      }
    } catch (err) {
      console.error("Create note error:", err);
      triggerToast("Error connecting to server.");
    }
  };

  const handleDeleteNote = async (id, title) => {
    if (!confirm(`Are you sure you want to delete note "${title}"?`)) return;

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

  // Static list for recommended cover section (visually matches layout)
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
    <div className="min-h-screen bg-[#fcfdfc] flex font-sans text-gray-800">
      <Sidebar />

      {/* Main Layout (excluding sidebar width 64 => ml-64) */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen relative">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-8 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-10">
          {/* Search bar */}
          <div className="flex-1 max-w-lg flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search resources, papers, or notes..."
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full font-medium"
            />
            <Mic size={16} className="text-gray-400 shrink-0 cursor-pointer hover:text-gray-600" />
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-5">
            {/* Bell notification */}
            <button 
              onClick={() => triggerToast("You have no new notifications.")}
              className="relative p-2 text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              <Bell size={22} className="stroke-[1.8]" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* User Meta Card */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h4 className="text-sm font-extrabold text-gray-900 font-outfit leading-none">
                  {fullName}
                </h4>
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest leading-none block mt-1">
                  {userCourse}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-emerald-600 transition cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 px-8 py-8">
          
          {/* Dashboard Greeting Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-outfit mb-2">
                Academic Hub
              </h1>
              <p className="text-sm text-gray-500 font-bold">
                Welcome back, {fullName.split(" ")[0]}. You have <span className="text-emerald-700 font-black">3 pending assignments</span> and <span className="text-emerald-700 font-black">{papers.length} resource papers</span> logged in the library.
              </p>
            </div>
            
            <button 
              onClick={() => triggerToast("Initializing new workspace project...")}
              className="bg-[#004D40] hover:bg-[#00382e] text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition shrink-0 cursor-pointer self-start md:self-auto"
            >
              <Plus size={18} />
              <span>New Project</span>
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* AI Study Insights widget */}
              <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-[28px] p-6">
                <div className="flex items-center gap-2.5 mb-4.5">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
                    <Brain size={18} className="stroke-[2.2]" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-900">
                    AI Study Insights
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Focus Areas */}
                  <div className="bg-white border border-emerald-100/40 rounded-2xl p-4.5 flex flex-col justify-between min-h-[130px]">
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Focus Areas
                      </h4>
                      <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                        Your performance in 'Cognitive Models' has dipped. Consider reviewing the 2023 Past Papers.
                      </p>
                    </div>
                  </div>

                  {/* Schedule Optimization */}
                  <div className="bg-white border border-emerald-100/40 rounded-2xl p-4.5 flex flex-col justify-between min-h-[130px]">
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Schedule Optimization
                      </h4>
                      <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                        You're most productive between 10 AM and 1 PM. Schedule your deep reading then.
                      </p>
                    </div>
                  </div>

                  {/* Live Recommendation */}
                  <div className="bg-emerald-800 text-white rounded-2xl p-4.5 flex flex-col justify-between min-h-[130px] shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-emerald-300">
                          Live Recommendation
                        </h4>
                      </div>
                      <h5 className="text-xs font-bold font-outfit mb-1 truncate">
                        Neuroplasticity: A Deep Dive
                      </h5>
                      <p className="text-[11px] text-emerald-100/90 leading-relaxed font-medium">
                        A newly added thesis paper aligns perfectly with your current thesis draft.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => triggerToast('Opening "Neuroplasticity: A Deep Dive" analysis...')}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition mt-2 cursor-pointer self-start"
                    >
                      <span>Analyze now</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Recommended For You Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 font-outfit uppercase tracking-wider">
                  Recommended for You
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-gray-150 rounded-2xl overflow-hidden hover:shadow-md hover:border-emerald-100 transition duration-300 flex flex-col justify-between"
                    >
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-32 object-cover"
                        />
                        {item.isNew && (
                          <span className="absolute top-2.5 right-2.5 bg-[#004D40] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                            New
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                            {item.category}
                          </span>
                          <h4 className="text-xs font-extrabold text-gray-800 leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-50">
                          <span className="text-[11px] font-bold text-gray-400">
                            {item.info}
                          </span>
                          
                          {/* Mini icon triggers */}
                          <button 
                            onClick={() => triggerToast(`Saved "${item.title}" to library.`)}
                            className="text-gray-400 hover:text-[#004D40] transition cursor-pointer p-1"
                          >
                            {item.iconType === "avatars" && (
                              <Bookmark size={16} className="stroke-[2]" />
                            )}
                            {item.iconType === "play" && (
                              <Play size={15} className="fill-emerald-850 text-emerald-800 stroke-[2.2]" />
                            )}
                            {item.iconType === "download" && (
                              <Download size={16} className="stroke-[2.2]" />
                            )}
                            {item.iconType === "book" && (
                              <BookOpen size={16} className="stroke-[2]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Past Papers list from DB */}
              <div className="bg-white border border-gray-150 rounded-[28px] p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 font-outfit uppercase tracking-wider">
                  Trending Past Papers
                </h3>

                <div className="space-y-4">
                  {papers.filter(p => !p.isFeatured).slice(0, 3).map((paper, i) => (
                    <div 
                      key={paper._id} 
                      onClick={() => triggerToast(`Viewing syllabus module for "${paper.title}" (${paper.module})...`)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-emerald-50/15 border border-gray-100 hover:border-emerald-100 transition duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-4.5">
                        <span className="text-xl font-black text-emerald-850 font-outfit">
                          {`0${i + 1}`}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">
                            {paper.title} - {paper.semester}
                          </h4>
                          <p className="text-[11px] text-gray-400 font-bold mt-0.5">
                            Instructed by {paper.instructor} • {paper.downloads + 620} downloads
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-emerald-700">
                        <TrendingUp size={18} />
                      </div>
                    </div>
                  ))}

                  {papers.length === 0 && (
                    <div className="text-center p-6 bg-gray-50/50 rounded-2xl border border-dashed text-xs text-gray-400 font-bold">
                      No papers loaded from server database yet.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Panel - Downloads & Notes */}
            <div className="space-y-6">
              
              {/* Recent Downloads widget */}
              <div className="bg-white border border-gray-150 rounded-[28px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-800 font-outfit">
                    Recent Downloads
                  </h3>
                  <a href="#downloads" className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider hover:underline">
                    View All
                  </a>
                </div>

                <div className="space-y-3.5">
                  {downloads.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => triggerToast(`Opening local file "${item.title}"...`)}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-gray-100/60 hover:shadow-sm hover:border-emerald-100 transition duration-200 bg-white cursor-pointer"
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor} font-black text-xs`}>
                        {item.ext}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 truncate">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                          {item.details}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Active downloading indicator */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/20">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-800">
                      <div className="w-5 h-5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-emerald-900 truncate">
                        Downloading...
                      </h4>
                      <p className="text-[10px] text-emerald-700/70 font-bold mt-0.5">
                        Sociology_Module_5.zip
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recently Added Notes widget (database-driven!) */}
              <div className="bg-white border border-gray-150 rounded-[28px] p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-800 font-outfit mb-4">
                  Recently Added Notes
                </h3>

                <div className="space-y-3.5">
                  {loadingNotes ? (
                    <div className="text-center p-4 text-xs text-gray-400 font-bold">Loading your notes...</div>
                  ) : (
                    notes.map((note) => (
                      <div 
                        key={note._id}
                        onClick={() => triggerToast(`Note Content: "${note.content || '(empty note)'}"`)}
                        className="bg-[#FAF8F5] border border-amber-250/30 rounded-2xl p-4.5 relative group hover:shadow-md hover:border-amber-250/70 transition cursor-pointer"
                      >
                        {/* Delete Note button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note._id, note.title);
                          }}
                          className="absolute top-4.5 right-4.5 text-rose-500 opacity-0 group-hover:opacity-100 hover:scale-110 transition p-1 bg-white rounded-lg shadow-sm border border-gray-100"
                        >
                          <Trash2 size={13} />
                        </button>
                        
                        <span className="text-[10px] font-bold text-gray-400 absolute top-4.5 right-4.5 group-hover:hidden flex items-center gap-1.5">
                          <Clock size={11} /> {new Date(note.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                        
                        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-3.5 border border-amber-200/10">
                          <FileText size={16} />
                        </div>
                        
                        <h4 className="text-sm font-extrabold text-gray-900 truncate pr-14">
                          {note.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                          {note.content || "Empty Note content."}
                        </p>
                      </div>
                    ))
                  )}

                  {!loadingNotes && notes.length === 0 && (
                    <div className="text-center p-6 bg-gray-50/50 rounded-2xl border border-dashed text-xs text-gray-400 font-bold">
                      No notes created yet.
                    </div>
                  )}

                  {/* Create Quick Note dotted button */}
                  <button 
                    onClick={handleCreateNote}
                    className="w-full py-4.5 border-2 border-dashed border-gray-200 hover:border-emerald-600 hover:bg-[#004D40]/5 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-bold text-gray-500 hover:text-emerald-800 transition cursor-pointer"
                  >
                    <Plus size={18} />
                    <span>Create Quick Note</span>
                  </button>

                </div>
              </div>

            </div>

          </div>

        </main>

        <Footer />

        {/* Global Toast Alert */}
        {toast.show && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#004D40] text-white text-xs font-bold px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
