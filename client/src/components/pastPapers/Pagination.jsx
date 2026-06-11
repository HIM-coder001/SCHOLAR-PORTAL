import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ current = 1, setCurrent }) => {
  return (
    <div className="flex items-center justify-between mt-10 font-sans">
      
      {/* Left Text */}
      <p className="text-xs text-gray-500 font-medium">
        Showing 1-6 of 142 resources found
      </p>

      {/* Page Buttons */}
      <div className="flex items-center gap-1.5">
        
        {/* Previous Button */}
        <button 
          className="w-8 h-8 rounded-lg border border-gray-200/80 hover:bg-gray-50 text-gray-400 flex items-center justify-center transition cursor-pointer"
          onClick={() => setCurrent(Math.max(1, current - 1))}
        >
          <ChevronLeft size={14} className="stroke-[2.2]" />
        </button>

        {/* Numbers */}
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            onClick={() => setCurrent(n)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer border ${
              current === n
                ? "bg-[#004D40] text-white border-[#004D40] shadow-md shadow-emerald-950/10"
                : "bg-white text-gray-600 border-gray-200/80 hover:bg-gray-50"
            }`}
          >
            {n}
          </button>
        ))}

        {/* Next Button */}
        <button 
          className="w-8 h-8 rounded-lg border border-gray-200/80 hover:bg-gray-50 text-gray-400 flex items-center justify-center transition cursor-pointer"
          onClick={() => setCurrent(Math.min(3, current + 1))}
        >
          <ChevronRight size={14} className="stroke-[2.2]" />
        </button>

      </div>

    </div>
  );
};

export default Pagination;