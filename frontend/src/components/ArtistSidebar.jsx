import {
  Home,
  Upload,
  Music,
  User,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const ArtistSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const links = [
    {
      name: "Home",
      path: "/artist",
      icon: Home,
    },
    {
      name: "Upload Song",
      path: "/artist/upload",
      icon: Upload,
    },
    {
      name: "My Songs",
      path: "/artist/songs",
      icon: Music,
    },
    {
      name: "Profile",
      path: "/artist/profile",
      icon: User,
    },
  ];

  return (
    <>
      {/* Overlay - Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/10 bg-zinc-950 transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <h1 className="text-xl font-bold text-white">
            Beat<span className="text-purple-500">Flow</span>
          </h1>

          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Artist Label */}
        <div className="px-5 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Artist Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-purple-500/10 text-purple-400"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default ArtistSidebar;