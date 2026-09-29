import {
  Search,
  Bell,
  User,
  Menu,
  LogOut,
  UserCircle,
  Settings,
  Check,
} from "lucide-react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../services/api";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const [profile, setProfile] = useState(null);

  // ================= PROFILE =================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");

        setProfile(response.data.user);
      } catch (error) {
        console.log("PROFILE ERROR:", error);
      }
    };

    fetchProfile();
  }, []);

  // ================= SEARCH =================

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value.trim()) {
      navigate(
        `/songs?search=${encodeURIComponent(
          value.trim()
        )}`,
        { replace: true }
      );
    } else {
      navigate("/songs", { replace: true });
    }
  };

  // ================= LOGOUT =================

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      navigate("/login");
    } catch (error) {
      console.log("LOGOUT ERROR:", error);

      navigate("/login");
    }
  };

  // ================= PROFILE CLICK =================

  const handleProfileClick = () => {
    setShowProfile((prev) => !prev);
    setShowNotifications(false);
  };

  // ================= NOTIFICATION CLICK =================

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    setShowProfile(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/10 bg-black/95 px-3 backdrop-blur-md sm:px-6">

      {/* ================= LEFT ================= */}

      <div className="flex min-w-0 flex-1 items-center gap-3">

        {/* Mobile Menu */}

        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white lg:hidden"
        >
          <Menu size={22} />
        </button>

        {/* Search */}

        <div className="relative w-full max-w-md">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search songs..."
            className="w-full rounded-full bg-zinc-900 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-purple-500 sm:pr-4"
          />

        </div>
      </div>

      {/* ================= RIGHT ================= */}

      <div className="ml-2 flex shrink-0 items-center gap-2 sm:ml-4 sm:gap-3">

        {/* ================= NOTIFICATION ================= */}

        <div className="relative">

          <button
            onClick={handleNotificationClick}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <Bell size={19} />

            {/* Notification Dot */}

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-purple-500" />
          </button>

          {/* Notification Dropdown */}

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">

              {/* Header */}

              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

                <div>
                  <h3 className="font-semibold text-white">
                    Notifications
                  </h3>

                  <p className="text-xs text-zinc-500">
                    Your latest updates
                  </p>
                </div>

                <button
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Mark all read
                </button>

              </div>

              {/* Notification */}

              <div className="border-b border-white/5 px-4 py-4 transition hover:bg-zinc-800">

                <div className="flex gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                    <Check size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Welcome to BeatFlow
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Start discovering and listening to music.
                    </p>

                    <p className="mt-2 text-[11px] text-zinc-600">
                      Just now
                    </p>
                  </div>

                </div>

              </div>

              {/* Empty / Footer */}

              <button
                onClick={() => setShowNotifications(false)}
                className="w-full px-4 py-3 text-center text-sm text-purple-400 transition hover:bg-zinc-800"
              >
                Close
              </button>

            </div>
          )}

        </div>

        {/* ================= USER ================= */}

        <div className="relative">

          <button
            onClick={handleProfileClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white transition hover:bg-purple-500"
          >
            <User size={18} />
          </button>

          {/* Profile Dropdown */}

          {showProfile && (
            <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">

              {/* Profile Info */}

              <div className="border-b border-white/10 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 text-white">
                    <User size={20} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate font-semibold text-white">
                      {profile?.name || "User"}
                    </p>

                    <p className="truncate text-xs text-zinc-500">
                      {profile?.email || "Loading..."}
                    </p>

                  </div>

                </div>

                {profile?.role && (
                  <div className="mt-3 inline-flex rounded-full bg-purple-500/10 px-2.5 py-1 text-xs capitalize text-purple-400">
                    {profile.role}
                  </div>
                )}

              </div>

              {/* Profile */}

              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <UserCircle size={18} />

                Profile
              </button>

              {/* Settings */}

              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <Settings size={18} />

                Settings
              </button>

              {/* Logout */}

              <div className="border-t border-white/10 p-2">

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut size={17} />

                  Logout
                </button>

              </div>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;