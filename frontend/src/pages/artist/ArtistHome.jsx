import { useEffect, useState } from "react";

import {
  Music,
  Upload,
  ArrowRight,
  Disc3,
  Play,
  Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getMySongs,
  deleteSong,
} from "../../services/music";

const ArtistHome = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMySongs = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getMySongs();

      setSongs(data.songs || []);
    } catch (error) {
      console.log("ARTIST SONGS ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load your songs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySongs();
  }, []);

  const handleDeleteSong = async (songId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this song?"
    );

    if (!confirmed) return;

    try {
      setErrorMessage("");

      await deleteSong(songId);

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

  const recentSongs = [...songs]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  return (
    <div className="text-white">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-purple-400">
          Artist Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Manage your music and share your songs with listeners.
        </p>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Stats / Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Total Songs */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-zinc-500">
                Total Songs
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {loading ? "..." : songs.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Music size={24} />
            </div>

          </div>

          <p className="mt-3 text-xs text-zinc-600">
            Songs uploaded by you
          </p>
        </div>

        {/* Upload */}
        <Link
          to="/artist/upload"
          className="group rounded-2xl border border-white/10 bg-zinc-900 p-5 transition hover:border-purple-500/40 hover:bg-zinc-800"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-zinc-500">
                Music
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Upload New Song
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Upload size={24} />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-purple-400">
            Upload now
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>

        {/* My Songs */}
        <Link
          to="/artist/songs"
          className="group rounded-2xl border border-white/10 bg-zinc-900 p-5 transition hover:border-purple-500/40 hover:bg-zinc-800"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-zinc-500">
                Library
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                My Songs
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Disc3 size={24} />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-purple-400">
            View songs
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>

      </div>

      {/* Recent Uploads */}
      <div className="mt-8">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold">
              Recent Uploads
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Your recently uploaded songs
            </p>
          </div>

          <Link
            to="/artist/songs"
            className="text-sm text-purple-400 transition hover:text-purple-300"
          >
            View all
          </Link>

        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center text-sm text-zinc-500">
            Loading your songs...
          </div>
        )}

        {/* Empty */}
        {!loading && recentSongs.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
              <Music size={26} />
            </div>

            <h3 className="mt-4 font-semibold">
              No songs uploaded yet
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Upload your first song to start building
              your music library.
            </p>

            <Link
              to="/artist/upload"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
            >
              <Upload size={17} />
              Upload Song
            </Link>

          </div>
        )}

        {/* Songs */}
        {!loading && recentSongs.length > 0 && (
          <div className="space-y-3">

            {recentSongs.map((song) => (
              <div
                key={song._id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900 p-4 transition hover:border-purple-500/30 hover:bg-zinc-800"
              >

                {/* Cover */}
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-800">

                  {song.coverUrl ? (
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-600">
                      <Music size={22} />
                    </div>
                  )}

                </div>

                {/* Song Info */}
                <div className="min-w-0 flex-1">

                  <h3 className="truncate font-semibold">
                    {song.title}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Uploaded{" "}
                    {new Date(
                      song.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">

                  {/* Play */}
                  <a
                    href={song.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white transition hover:bg-purple-500"
                    title="Play song"
                  >
                    <Play
                      size={17}
                      fill="currentColor"
                    />
                  </a>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      handleDeleteSong(song._id)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    title="Delete song"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default ArtistHome;