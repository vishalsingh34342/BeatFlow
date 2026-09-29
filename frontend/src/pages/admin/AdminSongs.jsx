import { useEffect, useState } from "react";
import {
  Music2,
  RefreshCw,
  Play,
  Trash2,
} from "lucide-react";
import api from "../../services/api";

const AdminSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSongs = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/admin/songs");

      setSongs(response.data.songs || []);
    } catch (error) {
      console.log("FETCH SONGS ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to fetch songs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleDelete = async (songId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this song?"
    );

    if (!confirmed) return;

    try {
      setErrorMessage("");

      await api.delete(`/admin/songs/${songId}`);

      setSongs((prev) =>
        prev.filter((song) => song._id !== songId)
      );
    } catch (error) {
      console.log("DELETE SONG ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to delete song"
      );
    }
  };

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600/15 text-purple-400">
              <Music2 size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Songs
              </h1>

              <p className="text-sm text-zinc-500">
                Manage all uploaded songs
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={fetchSongs}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errorMessage}
        </div>
      )}


      {/* Stats */}
      {!loading && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

          <p className="text-sm text-zinc-500">
            Total Songs
          </p>

          <p className="mt-1 text-3xl font-bold">
            {songs.length}
          </p>

        </div>
      )}


      {/* Loading */}
      {loading ? (
        <div className="flex min-h-60 items-center justify-center">

          <RefreshCw
            size={28}
            className="animate-spin text-purple-500"
          />

        </div>
      ) : songs.length === 0 ? (

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

          <Music2
            size={35}
            className="mx-auto mb-3 text-zinc-600"
          />

          <p className="text-zinc-400">
            No songs found
          </p>

        </div>

      ) : (

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead className="border-b border-white/10 bg-white/[0.02]">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Song
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Artist ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Created
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {songs.map((song) => (

                  <tr
                    key={song._id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                  >

                    {/* Song */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-900">

                          {song.coverUrl ? (
                            <img
                              src={song.coverUrl}
                              alt={song.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-600">
                              <Music2 size={20} />
                            </div>
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="max-w-56 truncate font-medium text-white">
                            {song.title || "Untitled"}
                          </p>

                          <p className="max-w-56 truncate text-xs text-zinc-600">
                            {song._id}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Artist */}
                    <td className="px-5 py-4">

                      <p className="max-w-48 truncate text-xs text-zinc-500">
                        {song.artist || "Unknown"}
                      </p>

                    </td>


                    {/* Created */}
                    <td className="px-5 py-4 text-sm text-zinc-500">

                      {song.createdAt
                        ? new Date(
                            song.createdAt
                          ).toLocaleDateString()
                        : "—"}

                    </td>


                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        {song.audioUrl && (
                          <a
                            href={song.audioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white transition hover:bg-purple-500"
                            title="Play song"
                          >
                            <Play
                              size={16}
                              fill="currentColor"
                            />
                          </a>
                        )}

                        <button
                          onClick={() =>
                            handleDelete(song._id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                          title="Delete song"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* Mobile */}
          <div className="space-y-3 p-3 md:hidden">

            {songs.map((song) => (

              <div
                key={song._id}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >

                <div className="flex gap-3">

                  {/* Cover */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-900">

                    {song.coverUrl ? (
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        <Music2 size={20} />
                      </div>
                    )}

                  </div>


                  {/* Info */}
                  <div className="min-w-0 flex-1">

                    <p className="truncate font-medium">
                      {song.title || "Untitled"}
                    </p>

                    <p className="mt-1 truncate text-xs text-zinc-600">
                      Artist: {song.artist || "Unknown"}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      {song.createdAt
                        ? new Date(
                            song.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </p>

                  </div>

                </div>


                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">

                  {song.audioUrl && (
                    <a
                      href={song.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 items-center gap-2 rounded-lg bg-purple-600 px-3 text-sm text-white transition hover:bg-purple-500"
                    >
                      <Play
                        size={15}
                        fill="currentColor"
                      />

                      Play
                    </a>
                  )}

                  <button
                    onClick={() =>
                      handleDelete(song._id)
                    }
                    className="flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={15} />

                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminSongs;