import { Link } from "react-router-dom";
import { Search, Mic, Bell } from "lucide-react";

const TopBar = () => {
  return (
    <div className="flex items-center gap-4 px-8 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-10 font-sans">
      
      {/* Search Input Box */}
      <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200/80 rounded-full px-4 py-2">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search course codes, paper titles..."
          className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full font-medium"
        />
        <Mic size={15} className="text-gray-400 shrink-0 cursor-pointer hover:text-gray-600" />
      </div>

      {/* Bell Notification */}
      <button className="relative p-2 text-gray-500 hover:text-gray-700 transition cursor-pointer">
        <Bell size={20} className="stroke-[1.8]" />
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>

      {/* Profile Avatar */}
      <Link 
        to="/profile" 
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#004D40] transition block shrink-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
          alt="User avatar" 
          className="w-full h-full object-cover" 
        />
      </Link>

    </div>
  );
};

export default TopBar;