import {
  LayoutDashboard,
  Users,
  Mic2,
  Music2,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
    } finally {
      navigate("/login");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Artists",
      path: "/admin/artists",
      icon: Mic2,
    },
    {
      name: "Songs",
      path: "/admin/songs",
      icon: Music2,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-zinc-950 transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/20">
              <Music2
                size={21}
                className="text-white"
              />
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold tracking-tight text-white">
                BeatFlow
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-widest text-purple-400">
                Admin Panel
              </p>
            </div>
          </button>

          {/* Mobile Close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
            Management
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-purple-600/15 text-purple-400"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        className={`transition ${
                          isActive
                            ? "text-purple-400"
                            : "text-zinc-500 group-hover:text-zinc-300"
                        }`}
                      />

                      <span>{item.name}</span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-400" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-4">

          {/* Profile */}
          <button
            onClick={() => {
              setSidebarOpen(false);
              navigate("/admin/profile");
            }}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <UserCircle
              size={20}
              className="text-zinc-500"
            />

            <div>
              <p className="font-medium text-zinc-300">
                Profile
              </p>

              <p className="text-xs text-zinc-600">
                Admin account
              </p>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />

            <span>Logout</span>
          </button>

        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;