import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import { Download, Search, Bell } from "lucide-react";

const Downloads = () => {
  return (
    <div className="min-h-screen bg-[#fcfdfc] flex font-sans">
      <Sidebar />
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex-1 max-w-lg flex items-center gap-2 bg-gray-50 border border-gray-200/80 rounded-full px-4 py-2 ml-12 lg:ml-0">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search downloads..."
              className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full font-medium"
            />
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition">
            <Bell size={20} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">Downloads</h1>
            <p className="text-xs text-gray-500">Track and manage your downloaded syllabus documents and studies.</p>
          </div>

          <div className="border border-dashed border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-12 bg-white flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
              <Download size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">No downloads found</h3>
            <p className="text-xs text-gray-400 mt-1 mb-4">You have not downloaded any documents yet.</p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Downloads;

