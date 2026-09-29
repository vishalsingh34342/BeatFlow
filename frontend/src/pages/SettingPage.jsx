import { useEffect, useState } from "react";

import {
  Bell,
  LogOut,
  Moon,
  Shield,
  Volume2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

const Settings = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState(true);

  const [sound, setSound] = useState(true);

  // ================= LOAD SETTINGS =================

  useEffect(() => {
    const savedNotifications =
      localStorage.getItem(
        "beatflow_notifications"
      );

    const savedSound =
      localStorage.getItem(
        "beatflow_sound"
      );

    if (savedNotifications !== null) {
      setNotifications(
        savedNotifications === "true"
      );
    }

    if (savedSound !== null) {
      setSound(savedSound === "true");
    }
  }, []);

  // ================= NOTIFICATIONS =================

  const handleNotifications = () => {
    const newValue = !notifications;

    setNotifications(newValue);

    localStorage.setItem(
      "beatflow_notifications",
      newValue
    );
  };

  // ================= SOUND =================

  const handleSound = () => {
    const newValue = !sound;

    setSound(newValue);

    localStorage.setItem(
      "beatflow_sound",
      newValue
    );
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

  return (
    <div className="mx-auto max-w-3xl text-white">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm text-purple-400">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Manage your BeatFlow preferences.
        </p>
      </div>

      {/* Preferences */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">

        <div className="border-b border-white/10 p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Bell size={20} />
            </div>

            <div>
              <h2 className="font-semibold">
                Preferences
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Customize your listening experience.
              </p>
            </div>

          </div>

        </div>

        {/* Notifications */}

        <div className="flex items-center justify-between gap-4 border-b border-white/5 p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Bell size={19} />
            </div>

            <div>
              <p className="font-medium">
                Notifications
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Receive updates and notifications.
              </p>
            </div>

          </div>

          <button
            onClick={handleNotifications}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              notifications
                ? "bg-purple-600"
                : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                notifications
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>

        </div>

        {/* Sound */}

        <div className="flex items-center justify-between gap-4 border-b border-white/5 p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Volume2 size={19} />
            </div>

            <div>
              <p className="font-medium">
                Player Sound
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Enable sound for the music player.
              </p>
            </div>

          </div>

          <button
            onClick={handleSound}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              sound
                ? "bg-purple-600"
                : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                sound
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>

        </div>

        {/* Appearance */}

        <div className="flex items-center justify-between gap-4 border-b border-white/5 p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Moon size={19} />
            </div>

            <div>
              <p className="font-medium">
                Appearance
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                BeatFlow currently uses dark mode.
              </p>
            </div>

          </div>

          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
            Dark
          </span>

        </div>

        {/* Security */}

        <div className="border-b border-white/5 p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Shield size={19} />
            </div>

            <div>
              <p className="font-medium">
                Security
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Your account is protected by authentication.
              </p>
            </div>

          </div>

        </div>

        {/* Logout */}

        <div className="p-5">

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-red-300"
          >
            <LogOut size={18} />
            Logout from BeatFlow
          </button>

        </div>

      </div>

    </div>
  );
};

export default Settings;