import { useState } from "react";

const Sidebar = ({ active, setActive }) => {
  const links = ["Dashboard", "Past Papers", "Notes", "AI Assistant", "Bookmarks", "Downloads"];

  return (
    <aside className="w-56 min-h-screen bg-white border-r flex flex-col py-6 px-4 fixed left-0 top-0">

      <div className="mb-8">
        <h1 className="text-green-800 font-bold text-lg">ScholarHub</h1>
        <p className="text-xs text-gray-400">Academic Portal</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((l) => (
          <button
            key={l}
            onClick={() => setActive(l)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
              active === l ? "bg-green-800 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {l}
          </button>
        ))}
      </nav>

      <div className="border-t pt-4 space-y-1">
        <button className="text-gray-500 text-sm w-full text-left">Profile</button>
        <button className="text-gray-500 text-sm w-full text-left">Settings</button>
      </div>

    </aside>
  );
};

export default Sidebar;