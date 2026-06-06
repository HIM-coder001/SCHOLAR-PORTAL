import { useState } from "react";
import Sidebar from  '../components/shared/Sidebar'
import TopBar from '../components/pastPapers/TopBar'
import PaperCard from "../components/pastpapers/PaperCard";
import FeaturedCard from "../components/pastpapers/FeaturedCard";
import FilterSelect from "../components/pastpapers/FilterSelect";
import Pagination from "../components/pastpapers/Pagination";
import Footer from "../components/shared/Footer";

const papers = [
  {
    icon: ">_",
    iconBg: "bg-green-100",
    color: "text-green-800 font-mono text-sm",
    title: "Data Structures & Algorithms",
    module: "CS-202",
    instructor: "Dr. Sarah Jenkins",
    semester: "2023 Fall",
  },
  {
    icon: "Σ",
    iconBg: "bg-pink-100",
    color: "text-pink-500",
    title: "Advanced Engineering Mathematics",
    module: "MA-305",
    instructor: "Prof. David Thorne",
    semester: "2022 Spring",
  },
  {
    icon: "⚗",
    iconBg: "bg-gray-100",
    color: "text-gray-500",
    title: "Molecular Biology Fundamentals",
    module: "BIO-112",
    instructor: "Dr. Marcus Aurelius",
    semester: "2023 Fall",
  },
];

const PastPapers = () => {
  const [activeNav, setActiveNav] = useState("Past Papers");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTags, setActiveTags] = useState(["2023", "Computer Science"]);

  const removeTag = (tag) => setActiveTags(activeTags.filter((t) => t !== tag));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={activeNav} setActive={setActiveNav} />

      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 px-8 py-6">
          {/* Breadcrumb */}
          <div className="mb-4">
            <span className="text-xs font-semibold bg-green-800 text-white px-3 py-1 rounded-full">
              Library Portal
            </span>
          </div>

          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Past Papers Archive
              </h1>
              <p className="text-sm text-gray-500">
                Access a comprehensive collection of examinations from 2018-2024
                across all departments.
              </p>
            </div>

            {/* Active filter tags */}
            <div className="flex items-center gap-2 mt-1">
              {activeTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full bg-white"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-gray-400 hover:text-gray-600 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <FilterSelect label="Department" value="Engineering & Tech" />
            <FilterSelect label="Course" value="CS-301 Algorithms" />
            <FilterSelect label="Year" value="2024" />
            <FilterSelect label="Semester" value="Fall Semester" />
          </div>

          {/* Row 1 — 3 standard cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {papers.map((p, i) => (
              <PaperCard key={i} {...p} />
            ))}
          </div>

          {/* Row 2 — featured wide card + standard card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FeaturedCard />
            <PaperCard
              icon="Λ"
              iconBg="bg-green-100"
              color="text-green-800 font-bold"
              title="Digital Design Principles"
              module="DD-201"
              instructor="Prof. Elena Rossi"
              semester="2023 Summer"
            />
          </div>

          {/* Pagination */}
          <Pagination current={currentPage} setCurrent={setCurrentPage} />
        </main>

        <Footer />
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-green-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-900 transition-colors z-50">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default PastPapers;