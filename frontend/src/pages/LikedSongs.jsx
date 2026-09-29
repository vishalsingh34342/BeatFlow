import { useEffect, useState } from "react";
import { Heart, Play, Trash2 } from "lucide-react";

import api from "../services/api";
import { useMusicPlayer } from "../context/MusicPlayerContext";

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    playSong,
    currentSong,
    isPlaying,
  } = useMusicPlayer();

  const fetchLikedSongs = async () => {
    try {
      const response = await api.get(
        "/user/liked-songs"
      );

      setLikedSongs(
        response.data.likedSongs || []
      );
    } catch (error) {
      console.log(
        "LIKED SONGS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  // ================= PLAY SONG =================

  const handlePlaySong = (song) => {
    playSong(song);
  };

  // ================= REMOVE LIKE =================

  const removeLike = async (songId) => {
    try {
      await api.delete(
        `/user/liked-songs/${songId}`
      );

      setLikedSongs((prev) =>
        prev.filter(
          (song) => song._id !== songId
        )
      );
    } catch (error) {
      console.log(
        "UNLIKE ERROR:",
        error
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="text-white">
        <p className="text-zinc-500">
          Loading liked songs...
        </p>
      </div>
    );
  }

  return (
    <div className="text-white">

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
            <Heart
              size={24}
              className="fill-purple-500 text-purple-500"
            />
          </div>

          <div>
            <p className="text-sm text-purple-400">
              Your Collection
            </p>

            <h1 className="text-3xl font-bold">
              Liked Songs
            </h1>
          </div>

        </div>

        <p className="text-sm text-zinc-500">
          {likedSongs.length}{" "}
          {likedSongs.length === 1
            ? "song"
            : "songs"}
        </p>
      </div>

      {/* ================= EMPTY STATE ================= */}

      {likedSongs.length === 0 ? (

        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900">

          <Heart
            size={40}
            className="mb-4 text-zinc-700"
          />

          <h2 className="text-lg font-semibold">
            No liked songs yet
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Songs you like will appear here.
          </p>

        </div>

      ) : (

        /* ================= SONGS ================= */

        <div className="space-y-2">

          {likedSongs.map((song, index) => {

            const isCurrentSong =
              currentSong?._id === song._id;

            return (
              <div
                key={song._id}
                className={`group flex items-center gap-4 rounded-xl border p-3 transition ${
                  isCurrentSong
                    ? "border-purple-500/30 bg-purple-500/5"
                    : "border-transparent bg-zinc-900/70 hover:border-white/10 hover:bg-zinc-800"
                }`}
              >

                {/* Number */}

                <span className="w-6 text-center text-sm text-zinc-600">
                  {index + 1}
                </span>

                {/* Cover */}

                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-800">

                  {song.coverUrl ? (

                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-full w-full items-center justify-center">
                      <Play
                        size={18}
                        className="text-zinc-600"
                      />
                    </div>

                  )}

                </div>

                {/* Song Info */}

                <div className="min-w-0 flex-1">

                  <h3
                    className={`truncate font-medium ${
                      isCurrentSong
                        ? "text-purple-400"
                        : "text-white"
                    }`}
                  >
                    {song.title}
                  </h3>

                  <p className="truncate text-sm text-zinc-500">
                    {song.artist?.name ||
                      "Unknown Artist"}
                  </p>

                </div>

                {/* Play Button */}

                <button
                  onClick={() =>
                    handlePlaySong(song)
                  }
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition ${
                    isCurrentSong
                      ? "bg-purple-500 hover:bg-purple-400"
                      : "bg-purple-600 hover:bg-purple-500"
                  }`}
                  title="Play song"
                >
                  <Play
                    size={17}
                    fill="currentColor"
                  />
                </button>

                {/* Unlike */}

                <button
                  onClick={() =>
                    removeLike(song._id)
                  }
                  className="rounded-lg p-2 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400"
                  title="Remove from liked songs"
                >
                  <Heart
                    size={19}
                    className="fill-purple-500 text-purple-500"
                  />
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default LikedSongs;