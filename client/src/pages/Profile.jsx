import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import { User, Bell, Search } from "lucide-react";

const Profile = () => {
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
              placeholder="Search..."
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
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">My Profile</h1>
            <p className="text-xs text-gray-500">View and manage your academic account settings.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-8 max-w-xl mx-auto my-6 flex flex-col items-center shadow-sm">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-50 mb-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Alex Rivers avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-bold text-gray-800 font-outfit">Alex Rivers</h2>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-1">Undergraduate student</p>
            
            <div className="w-full border-t border-gray-100 mt-6 pt-6 space-y-4 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span>alex.rivers@university.edu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Institution:</span>
                <span>Stanford University</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Major:</span>
                <span>Computer Science & Psych</span>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Profile;
