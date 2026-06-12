import { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import TopBar from "../components/pastPapers/TopBar";
import PaperCard from "../components/pastPapers/PaperCard";
import FeaturedCard from "../components/pastPapers/FeaturedCard";
import FilterSelect from "../components/pastPapers/FilterSelect";
import Pagination from "../components/pastPapers/Pagination";
import Footer from "../components/shared/Footer";
import { Plus, CheckCircle2, BookOpen, TrendingUp, Download } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const PastPapers = () => {
  const [papers, setPapers] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [selectedDept, setSelectedDept] = useState("Engineering & Tech");
  const [selectedCourse, setSelectedCourse] = useState("CS-301 Algorithms");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedSemester, setSelectedSemester] = useState("Fall Semester");

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTags, setActiveTags] = useState(["2023", "Computer Science"]);
  const [toast, setToast] = useState({ show: false, message: "" });

  const [headerRef, headerVisible] = useScrollAnimation(0.1);

  const removeTag = (tag) => {
    setActiveTags(activeTags.filter((t) => t !== tag));
    triggerToast(`Removed "${tag}" filter.`);
  };

  const triggerToast = (message) => {
    setToast({ show: true, message });
    const timer = setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3500);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    fetchPapers();
  }, [searchVal, selectedDept, selectedCourse, selectedYear, selectedSemester]);

  const fetchPapers = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (searchVal) params.append("search", searchVal);
      if (selectedDept && selectedDept !== "All") params.append("department", selectedDept);
      if (selectedCourse && selectedCourse !== "All") params.append("course", selectedCourse);
      if (selectedYear && selectedYear !== "All") params.append("year", selectedYear);
      if (selectedSemester && selectedSemester !== "All") params.append("semester", selectedSemester);

      const res = await fetch(`/api/papers?${params.toString()}`, {
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

  const handleDownload = async (id, title) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/papers/${id}/download`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        triggerToast(`Authorized download. Fetching PDF for "${title}"...`);
        fetchPapers();
      } else {
        triggerToast("Download authorization failed.");
      }
    } catch (err) {
      console.error("Download error:", err);
      triggerToast("Error connecting to server.");
    }
  };

  const standardPapers = papers.filter((p) => !p.isFeatured);
  const featuredPaper = papers.find((p) => p.isFeatured) || { title: "Macroeconomics: Global Markets Analysis", _id: "mock-id" };

  return (
    <div className="min-h-screen bg-[#f8faf8] flex font-sans text-gray-800">
      <Sidebar />

      {/* Main Content Area — responsive sidebar offset */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen relative">
        <TopBar searchVal={searchVal} setSearchVal={setSearchVal} />

        <main className="flex-1 px-8 py-8">

          {/* Hero Header */}
          <div
            ref={headerRef}
            className={`mb-8 transition-all duration-700 ease-out ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div className="bg-gradient-to-br from-[#004D40] to-[#00695c] rounded-3xl p-8 text-white relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="inline-block text-[10px] font-bold bg-white/20 text-white px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-3 backdrop-blur-sm">
                    Library Portal
                  </span>
                  <h1 className="text-3xl font-extrabold tracking-tight font-outfit mb-2">
                    Past Papers Archive
                  </h1>
                  <p className="text-emerald-100 text-sm font-medium max-w-md">
                    Access a comprehensive collection of examinations from 2018–2024 across all departments.
                  </p>
                </div>

                {/* Quick stats row */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-2xl font-black">25K+</p>
                    <p className="text-emerald-200 text-xs font-semibold mt-0.5">Papers</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center">
                    <p className="text-2xl font-black">150K+</p>
                    <p className="text-emerald-200 text-xs font-semibold mt-0.5">Downloads</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center">
                    <p className="text-2xl font-black">All</p>
                    <p className="text-emerald-200 text-xs font-semibold mt-0.5">Depts.</p>
                  </div>
                </div>
              </div>

              {/* Active filter tags */}
              {activeTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-5 relative z-10">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">Active filters:</span>
                  {activeTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-white/70 hover:text-white leading-none cursor-pointer font-black text-sm"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Filter Resources</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FilterSelect
                label="Department"
                value={selectedDept}
                onChange={setSelectedDept}
                options={["Engineering & Tech", "Science & Mathematics", "Business Administration", "Humanities & Arts"]}
              />
              <FilterSelect
                label="Course"
                value={selectedCourse}
                onChange={setSelectedCourse}
                options={["CS-301 Algorithms", "CS-202 Data Structures", "MA-305 Calculus", "BIO-112 Biology"]}
              />
              <FilterSelect
                label="Year"
                value={selectedYear}
                onChange={setSelectedYear}
                options={["2024", "2023", "2022", "2021", "2020"]}
              />
              <FilterSelect
                label="Semester"
                value={selectedSemester}
                onChange={setSelectedSemester}
                options={["Fall Semester", "Spring Semester", "Summer Semester"]}
              />
            </div>
          </div>

          {/* Section label */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#004D40]" />
              <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider">Available Papers</h2>
            </div>
            <span className="text-xs text-gray-400 font-semibold">{papers.length} result{papers.length !== 1 ? "s" : ""} found</span>
          </div>

          {/* Row 1 — Standard paper cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {standardPapers.slice(0, 3).map((p, i) => (
              <PaperCard
                key={p._id}
                {...p}
                index={i}
                onDownload={(title) => handleDownload(p._id, title)}
                onBookmark={(title) => triggerToast(`Saved "${title}" to your Bookmarks.`)}
              />
            ))}

            {standardPapers.length === 0 && (
              <div className="col-span-3 text-center py-16 bg-white border border-dashed border-gray-200 rounded-3xl">
                <BookOpen size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-400">No past papers found matching your filters.</p>
                <p className="text-xs text-gray-300 mt-1">Try adjusting the department or year filters.</p>
              </div>
            )}
          </div>

          {/* Row 2 — Featured wide card + 4th standard card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            <FeaturedCard
              onDownload={(title) => handleDownload(featuredPaper._id, title)}
            />

            {standardPapers.slice(3, 4).map((p) => (
              <PaperCard
                key={p._id}
                {...p}
                index={3}
                onDownload={(title) => handleDownload(p._id, title)}
                onBookmark={(title) => triggerToast(`Saved "${title}" to your Bookmarks.`)}
              />
            ))}

            {standardPapers.length < 4 && papers.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-center items-center border-dashed text-center">
                <TrendingUp size={24} className="text-gray-300 mb-2" />
                <p className="text-xs font-bold text-gray-400">End of results for this filter.</p>
              </div>
            )}
          </div>

          <Pagination current={currentPage} setCurrent={setCurrentPage} />
        </main>

        <Footer />

        {/* Toast */}
        {toast.show && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#004D40] text-white text-xs font-bold px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => triggerToast("New paper submission feature coming soon!")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#004D40] hover:bg-[#00382e] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 z-50 cursor-pointer shadow-[#004D40]/40"
      >
        <Plus size={24} className="stroke-[2.5]" />
      </button>
    </div>
  );
};

export default PastPapers;