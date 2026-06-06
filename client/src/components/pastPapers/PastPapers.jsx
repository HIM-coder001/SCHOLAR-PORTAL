import { useState } from "react";

import Sidebar from "../components/pastpapers/Sidebar";
import TopBar from "../components/pastpapers/TopBar";
import PaperCard from "../components/pastpapers/PaperCard";
import FeaturedCard from "../components/pastpapers/FeaturedCard";
import FilterSelect from "../components/pastpapers/FilterSelect";
import Pagination from "../components/pastpapers/Pagination";

import { papers } from "../components/pastpapers/data";

const PastPapers = () => {
  const [active, setActive] = useState("Past Papers");
  const [page, setPage] = useState(1);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar active={active} setActive={setActive} />

      <div className="ml-56 flex-1">

        <TopBar />

        <main className="p-6">

          <h1 className="text-2xl font-bold mb-4">
            Past Papers Archive
          </h1>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <FilterSelect label="Department" />
            <FilterSelect label="Course" />
            <FilterSelect label="Year" />
            <FilterSelect label="Semester" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {papers.map((p, i) => (
              <PaperCard key={i} paper={p} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <FeaturedCard />
            <PaperCard paper={papers[0]} />
          </div>

          <Pagination current={page} setCurrent={setPage} />

        </main>

      </div>
    </div>
  );
};

export default PastPapers;