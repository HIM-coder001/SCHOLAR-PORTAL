import { Download, Eye, Bookmark, BookOpen, Star } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const PaperCard = ({
  icon,
  iconBg,
  color,
  title,
  module,
  instructor,
  semester,
  downloads,
  views,
  onDownload,
  onBookmark,
  index = 0,
}) => {
  const [ref, visible] = useScrollAnimation(0.1, index * 80);

  return (
    <div
      ref={ref}
      className={`group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-sans relative overflow-hidden ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } transition-all duration-500 ease-out`}
    >
      {/* Hover top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#004D40] to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon and Semester Tag */}
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg} shadow-sm border border-black/5`}>
          <span className={`text-lg font-black ${color}`}>{icon}</span>
        </div>
        <span className="text-[10px] font-bold bg-[#e6f0ed] text-[#004D40] px-3 py-1.5 rounded-full uppercase tracking-wider">
          {semester}
        </span>
      </div>

      {/* Course Info */}
      <div className="flex-1">
        <h3 className="text-base font-extrabold text-gray-900 mb-1.5 font-outfit line-clamp-2 group-hover:text-[#004D40] transition-colors duration-200">
          {title}
        </h3>
        <p className="text-xs text-gray-400 font-semibold">
          {module} · {instructor}
        </p>
      </div>

      {/* Stats row */}
      {(downloads !== undefined || views !== undefined) && (
        <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold">
          {views !== undefined && (
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {views?.toLocaleString() ?? 0}
            </span>
          )}
          {downloads !== undefined && (
            <span className="flex items-center gap-1">
              <Download size={12} />
              {downloads?.toLocaleString() ?? 0}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 pt-4 mt-auto border-t border-gray-50">
        <button
          onClick={() => onDownload && onDownload(title)}
          className="flex-1 flex items-center justify-center gap-2 bg-[#004D40] hover:bg-[#00382e] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-[#004D40]/20 hover:shadow-md"
        >
          <Download size={13} className="stroke-[2.5]" />
          <span>Download PDF</span>
        </button>

        <button
          onClick={() => onDownload && onDownload(title)}
          className="p-2.5 text-gray-400 hover:text-[#004D40] hover:bg-[#e6f0ed] rounded-xl transition-all duration-200 cursor-pointer"
          title="Preview"
        >
          <Eye size={16} className="stroke-[2]" />
        </button>

        <button
          onClick={() => onBookmark && onBookmark(title)}
          className="p-2.5 text-gray-400 hover:text-[#004D40] hover:bg-[#e6f0ed] rounded-xl transition-all duration-200 cursor-pointer"
          title="Bookmark"
        >
          <Bookmark size={16} className="stroke-[2]" />
        </button>
      </div>
    </div>
  );
};

export default PaperCard;