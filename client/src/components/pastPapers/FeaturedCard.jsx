import { DownloadCloud, TrendingUp, Sparkles } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const FeaturedCard = ({ onDownload }) => {
  const cardTitle = "Macroeconomics: Global Markets Analysis";
  const [ref, visible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`relative bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 font-sans group ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } transition-all duration-700 ease-out`}
    >
      {/* Background cover image — full card behind gradient */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&auto=format&fit=crop&q=80"
          alt="Macroeconomics cover"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#004D40]/80 via-[#004D40]/30 to-transparent" />

        {/* Floating badges over image */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold bg-white/95 text-rose-600 px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
            <TrendingUp size={10} />
            Trending
          </span>
          <span className="text-[10px] font-bold bg-[#004D40]/90 text-white px-3 py-1.5 rounded-full uppercase tracking-wide backdrop-blur-sm">
            2024 Predicted
          </span>
        </div>

        {/* Download count chip over image */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          <DownloadCloud size={13} />
          2.4k downloads
        </div>
      </div>

      {/* Content below image */}
      <div className="p-6 flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-[#004D40] uppercase tracking-widest">ECO-301 · Prof. Alan Greenspan</span>
          </div>
          <h3 className="text-xl font-black text-gray-900 font-outfit leading-tight">
            {cardTitle}
          </h3>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed font-medium">
          This resource includes a mock paper set by the faculty for the upcoming finals based on current economic trends. Recommended for third-year honors students.
        </p>

        {/* AI chip */}
        <div className="flex items-center gap-2 bg-[#e6f0ed] rounded-xl px-3.5 py-2.5">
          <Sparkles size={14} className="text-[#004D40] shrink-0" />
          <p className="text-xs text-[#004D40] font-semibold">
            Ask the AI Assistant to summarize this paper for quick revision notes.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onDownload && onDownload(cardTitle)}
            className="flex-1 bg-[#004D40] hover:bg-[#00382e] text-white text-sm font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-[#004D40]/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            <DownloadCloud size={16} />
            Access Study Guide
          </button>
          <button
            onClick={() => onDownload && onDownload(cardTitle)}
            className="px-4 py-3 border-2 border-[#004D40] text-[#004D40] hover:bg-[#004D40] hover:text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer"
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;