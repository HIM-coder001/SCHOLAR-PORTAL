import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import { NotebookTabs, Plus, Search, Bell } from "lucide-react";

const Notes = () => {
  return (
    <div className="min-h-screen bg-[#fcfdfc] flex font-sans">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex-1 max-w-lg flex items-center gap-2 bg-gray-50 border border-gray-200/80 rounded-full px-4 py-2">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search your notes..."
              className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full font-medium"
            />
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition">
            <Bell size={20} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">My Notes</h1>
              <p className="text-xs text-gray-500">Organize your classes, revision guidelines, and study briefs.</p>
            </div>
            <button className="bg-[#004D40] hover:bg-[#00382e] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer">
              <Plus size={16} />
              <span>Create Note</span>
            </button>
          </div>

          <div className="border border-dashed border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-12 bg-white flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
              <NotebookTabs size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">No notes found</h3>
            <p className="text-xs text-gray-400 mt-1 mb-4">Get started by creating your first academic note.</p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Notes;
