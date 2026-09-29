import { useEffect, useState } from "react";
import {
  Users,
  Mic2,
  Music2,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const AdminHome = () => {
    console.log("🔥 ADMIN HOME RENDERED");
  const [stats, setStats] = useState({
    users: 0,
    artists: 0,
    songs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [usersResponse, artistsResponse, songsResponse] =
        await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/artists"),
          api.get("/admin/songs"),
        ]);

      setStats({
        users:
          usersResponse.data.users?.length || 0,

        artists:
          artistsResponse.data.artists?.length || 0,

        songs:
          songsResponse.data.songs?.length || 0,
      });
    } catch (error) {
      console.log("ADMIN DASHBOARD ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Total Artists",
      value: stats.artists,
      icon: Mic2,
      description: "Artists on BeatFlow",
    },
    {
      title: "Total Songs",
      value: stats.songs,
      icon: Music2,
      description: "Uploaded songs",
    },
  ];

  return (
    <div className="text-white">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-purple-400">
            Admin Panel
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Manage your BeatFlow platform
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-purple-500/30 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={18} />

          <span>{errorMessage}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-5 transition hover:border-purple-500/20"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-zinc-500">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {loading ? "—" : card.value}
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    {card.description}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Icon size={21} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Admin Status */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900 p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h2 className="font-semibold">
              Admin Access
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              You have administrator access to manage
              users, artists and songs on BeatFlow.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminHome;