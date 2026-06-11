import { ChevronDown } from "lucide-react";

const FilterSelect = ({ label, value, options = [] }) => {
  const displayOptions = options.length > 0 ? options : [value];

  return (
    <div className="flex flex-col font-sans">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>

      <div className="relative">
        <select className="w-full bg-[#f8faf8] border border-gray-200/80 rounded-xl px-4 py-3 text-xs font-semibold text-gray-700 appearance-none focus:outline-none focus:border-[#004D40] transition cursor-pointer">
          {displayOptions.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default FilterSelect;