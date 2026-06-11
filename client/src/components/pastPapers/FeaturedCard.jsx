import { DownloadCloud } from "lucide-react";

const FeaturedCard = ({ onDownload }) => {
  const cardTitle = "Macroeconomics: Global Markets Analysis";

  return (
    <div className="bg-white border border-gray-150 rounded-[28px] overflow-hidden shadow-sm flex flex-col sm:flex-row hover:shadow-lg transition duration-300 font-sans">
      
      {/* Left side cover image */}
      <div className="sm:w-56 shrink-0 relative min-h-[180px]">
        <img
          src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&auto=format&fit=crop&q=80"
          alt="Macroeconomics: Global Markets Analysis study guide"
          className="w-full h-full object-cover absolute inset-0"
        />
      </div>

      {/* Right side contents */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2 mb-3.5">
            <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg uppercase tracking-wider">
              Trending Resource
            </span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg uppercase tracking-wider">
              2024 Predicted
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-black text-gray-900 mb-2.5 font-outfit">
            {cardTitle}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
            This resource includes a mock paper set by the faculty for the upcoming finals based on current economic trends. Recommended for third-year honors students.
          </p>
        </div>

        {/* Access Study Guide / Downloads */}
        <div className="flex items-center gap-5 pt-2 mt-auto border-t border-gray-50">
          <button 
            onClick={() => onDownload && onDownload(cardTitle)}
            className="bg-[#004D40] hover:bg-[#00382e] text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center transition cursor-pointer"
          >
            Access Study Guide
          </button>
          
          <div className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm font-semibold transition cursor-pointer">
            <DownloadCloud size={16} className="stroke-[2.2]" />
            <span>2.4k downloads</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FeaturedCard;