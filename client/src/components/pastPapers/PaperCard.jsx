import { Download, Eye, Bookmark } from "lucide-react";

const PaperCard = ({ 
  icon, 
  iconBg, 
  color, 
  title, 
  module, 
  instructor, 
  semester, 
  onDownload, 
  onBookmark 
}) => {
  return (
    <div className="bg-white border border-gray-150 rounded-[24px] p-6 flex flex-col gap-5 hover:shadow-lg transition duration-300 font-sans">
      
      {/* Icon and Semester Tag */}
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg} shadow-sm border border-black/5`}>
          <span className={`text-lg font-black ${color}`}>{icon}</span>
        </div>
        <span className="text-xs font-bold bg-[#e5eee9] text-[#004d40] px-3.5 py-1 rounded-full uppercase tracking-wider">
          {semester}
        </span>
      </div>

      {/* Course Info */}
      <div className="flex-1">
        <h3 className="text-base font-extrabold text-gray-900 mb-2 font-outfit line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-gray-400 font-bold">
          Module Code: {module} • {instructor}
        </p>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-3 pt-3 mt-auto border-t border-gray-100">
        <button 
          onClick={() => onDownload && onDownload(title)}
          className="flex items-center gap-2 border border-[#004D40] text-[#004D40] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#004D40] hover:text-white transition cursor-pointer"
        >
          <Download size={14} className="stroke-[2.2]" />
          <span>Download PDF</span>
        </button>

        <button 
          onClick={() => onDownload && onDownload(title)}
          className="p-2.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
        >
          <Eye size={16} className="stroke-[2]" />
        </button>

        <button 
          onClick={() => onBookmark && onBookmark(title)}
          className="p-2.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
        >
          <Bookmark size={16} className="stroke-[2]" />
        </button>
      </div>

    </div>
  );
};

export default PaperCard;