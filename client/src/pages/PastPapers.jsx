import { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import TopBar from "../components/pastpapers/TopBar";
import PaperCard from "../components/pastpapers/PaperCard";
import FeaturedCard from "../components/pastpapers/FeaturedCard";
import FilterSelect from "../components/pastpapers/FilterSelect";
import Pagination from "../components/pastpapers/Pagination";
import Footer from "../components/shared/Footer";
import { Plus, CheckCircle2 } from "lucide-react";

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
        // Refresh counts
        fetchPapers();
      } else {
        triggerToast("Download authorization failed.");
      }
    } catch (err) {
      console.error("Download error:", err);
      triggerToast("Error connecting to server.");
    }
  };

  // Divide papers into layout rows
  const standardPapers = papers.filter((p) => !p.isFeatured);
  const featuredPaper = papers.find((p) => p.isFeatured) || { title: "Macroeconomics: Global Markets Analysis", _id: "mock-id" };

  return (
    <div className="min-h-screen bg-[#fcfdfc] flex font-sans text-gray-800">
      <Sidebar />

      {/* Main Content Area (ml-64) */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen relative">
        <TopBar searchVal={searchVal} setSearchVal={setSearchVal} />

        <main className="flex-1 px-8 py-8">
          
          {/* Page Header and Filter Tags */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="mb-2">
                <span className="text-[10px] font-bold bg-[#004D40] text-white px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  Library Portal
                </span>
              </div>
              
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-outfit mb-2">
                Past Papers Archive
              </h1>
              
              <p className="text-sm text-gray-500 font-bold">
                Access a comprehensive collection of examinations from 2018-2024 across all departments.
              </p>
            </div>

            {/* Active filter tags */}
            <div className="flex flex-wrap items-center gap-2.5 mt-2 md:mt-0">
              {activeTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-full bg-white shadow-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-gray-400 hover:text-gray-700 leading-none cursor-pointer font-black text-sm"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Filters Select boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
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

          {/* Row 1 — 3 standard cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {standardPapers.slice(0, 3).map((p) => (
              <PaperCard 
                key={p._id} 
                {...p} 
                onDownload={(title) => handleDownload(p._id, title)}
                onBookmark={(title) => triggerToast(`Saved "${title}" to your Bookmarks.`)}
              />
            ))}

            {standardPapers.length === 0 && (
              <div className="col-span-3 text-center py-10 bg-gray-50/50 border border-dashed rounded-3xl text-sm font-bold text-gray-400">
                No past papers found matching the search/filter criteria.
              </div>
            )}
          </div>

          {/* Row 2 — featured wide card + standard card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FeaturedCard 
              onDownload={(title) => handleDownload(featuredPaper._id, title)}
            />
            
            {standardPapers.slice(3, 4).map((p) => (
              <PaperCard
                key={p._id}
                {...p}
                onDownload={(title) => handleDownload(p._id, title)}
                onBookmark={(title) => triggerToast(`Saved "${title}" to your Bookmarks.`)}
              />
            ))}

            {standardPapers.length < 4 && papers.length > 0 && (
              <div className="bg-white border border-gray-150 rounded-[24px] p-6 flex flex-col justify-center items-center border-dashed text-center text-xs font-bold text-gray-400">
                End of matches for this archive section.
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination current={currentPage} setCurrent={setCurrentPage} />
        </main>

        <Footer />
        
        {/* Floating Action Toast Alert */}
        {toast.show && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#004D40] text-white text-xs font-bold px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}
      </div>

      {/* FAB Floating Plus Button */}
      <button 
        onClick={() => triggerToast("New paper submission feature coming soon!")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#004D40] hover:bg-[#00382e] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 z-50 cursor-pointer"
      >
        <Plus size={24} className="stroke-[2.5]" />
      </button>
    </div>
  );
};

export default PastPapers;