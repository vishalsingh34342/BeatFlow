import { useEffect, useMemo, useState } from "react";

import {
  Play,
  Plus,
  ListMusic,
  X,
  Check,
  Heart,
} from "lucide-react";

import { useSearchParams } from "react-router-dom";

import { getSongs } from "../services/music";

import {
  getMyPlaylists,
  addSongToPlaylist,
} from "../services/playlist";

import api from "../services/api";

import { useMusicPlayer } from "../context/MusicPlayerContext";

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Search
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  // Global music player
  const { playSong, currentSong, isPlaying } =
    useMusicPlayer();

  // Playlist modal
  const [showPlaylistModal, setShowPlaylistModal] =
    useState(false);

  const [selectedSong, setSelectedSong] =
    useState(null);

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState("");

  const [adding, setAdding] = useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [playlistError, setPlaylistError] =
    useState("");

  // ================= FETCH SONGS =================

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getSongs();

        setSongs(data.songs || []);
      } catch (error) {
        console.log("SONGS ERROR:", error);

        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load songs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // ================= FETCH LIKED SONGS =================

  useEffect(() => {
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
      }
    };

    fetchLikedSongs();
  }, []);

  // ================= SEARCH =================

  const filteredSongs = useMemo(() => {
    const query = searchQuery
      .toLowerCase()
      .trim();

    if (!query) {
      return songs;
    }

    return songs.filter((song) =>
      song.title
        ?.toLowerCase()
        .includes(query)
    );
  }, [songs, searchQuery]);

  // ================= LIKE / UNLIKE =================

  const handleLike = async (songId) => {
    try {
      const isLiked = likedSongs.some(
        (song) => song._id === songId
      );

      if (isLiked) {
        await api.delete(
          `/user/liked-songs/${songId}`
        );

        setLikedSongs((prev) =>
          prev.filter(
            (song) => song._id !== songId
          )
        );
      } else {
        const response = await api.post(
          `/user/liked-songs/${songId}`
        );

        setLikedSongs(
          response.data.likedSongs || []
        );
      }
    } catch (error) {
      console.log(
        "LIKE SONG ERROR:",
        error
      );
    }
  };

  // ================= OPEN PLAYLIST MODAL =================

  const handleOpenPlaylistModal = async (song) => {
    try {
      setSelectedSong(song);
      setSelectedPlaylist("");
      setPlaylistError("");
      setSuccessMessage("");
      setShowPlaylistModal(true);

      const data = await getMyPlaylists();

      setPlaylists(data.playlists || []);
    } catch (error) {
      console.log(
        "PLAYLIST FETCH ERROR:",
        error
      );

      setPlaylistError(
        error.response?.data?.message ||
          "Failed to load playlists"
      );
    }
  };

  // ================= ADD SONG =================

  const handleAddSong = async () => {
    if (!selectedPlaylist) {
      setPlaylistError(
        "Please select a playlist"
      );
      return;
    }

    try {
      setAdding(true);
      setPlaylistError("");

      await addSongToPlaylist(
        selectedPlaylist,
        selectedSong._id
      );

      setSuccessMessage(
        "Song added to playlist successfully"
      );

      setTimeout(() => {
        setShowPlaylistModal(false);
        setSuccessMessage("");
      }, 1000);
    } catch (error) {
      console.log(
        "ADD SONG ERROR:",
        error
      );

      setPlaylistError(
        error.response?.data?.message ||
          "Failed to add song"
      );
    } finally {
      setAdding(false);
    }
  };

  // ================= PLAY SONG =================

  const handlePlaySong = (song) => {
    playSong(song);
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-zinc-400">
        Loading songs...
      </div>
    );
  }

  // ================= ERROR =================

  if (errorMessage) {
    return (
      <div className="rounded-xl bg-red-500/10 p-5 text-red-400">
        {errorMessage}
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="min-w-0 text-white">

      {/* ================= HEADER ================= */}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Songs"}
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          {searchQuery
            ? `${filteredSongs.length} songs found`
            : "Discover and listen to your music"}
        </p>
      </div>

      {/* ================= SONGS ================= */}

      {filteredSongs.length > 0 && (
        <div className="space-y-3">

          {filteredSongs.map((song, index) => {

            const isCurrentSong =
              currentSong?._id === song._id;

            const isLiked = likedSongs.some(
              (liked) =>
                liked._id === song._id
            );

            return (
              <div
                key={song._id}
                className={`rounded-2xl border p-3 transition sm:p-4 ${
                  isCurrentSong
                    ? "border-purple-500/40 bg-purple-500/5"
                    : "border-white/5 bg-zinc-900 hover:border-purple-500/20 hover:bg-zinc-800"
                }`}
              >

                {/* ================= SONG INFO + ACTIONS ================= */}

                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">

                  {/* SONG INFO */}

                  <div className="flex min-w-0 flex-1 items-center gap-3">

                    {/* Number */}

                    <span className="w-5 shrink-0 text-center text-xs text-zinc-600 sm:w-6 sm:text-sm">
                      {index + 1}
                    </span>

                    {/* Cover */}

                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-800 sm:h-14 sm:w-14">

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
                            className="text-zinc-500"
                          />
                        </div>
                      )}

                    </div>

                    {/* Song Name */}

                    <div className="min-w-0 flex-1">

                      <h2
                        title={song.title}
                        className={`truncate text-sm font-semibold sm:text-base ${
                          isCurrentSong
                            ? "text-purple-400"
                            : "text-white"
                        }`}
                      >
                        {song.title}
                      </h2>

                      <p className="mt-1 text-xs text-zinc-500">
                        {isCurrentSong && isPlaying
                          ? "Now Playing"
                          : "Music"}
                      </p>

                    </div>

                  </div>

                  {/* ================= ACTIONS ================= */}

                  <div className="flex shrink-0 items-center justify-end gap-2 pl-8 sm:pl-0">

                    {/* Play */}

                    <button
                      onClick={() =>
                        handlePlaySong(song)
                      }
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition sm:h-10 sm:w-10 ${
                        isCurrentSong
                          ? "bg-purple-500 hover:bg-purple-400"
                          : "bg-purple-600 hover:bg-purple-500"
                      }`}
                      title="Play"
                    >
                      <Play
                        size={16}
                        fill="currentColor"
                      />
                    </button>

                    {/* Like */}

                    <button
                      onClick={() =>
                        handleLike(song._id)
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 transition hover:border-purple-500/30 hover:bg-purple-500/10 sm:h-10 sm:w-10"
                      title={
                        isLiked
                          ? "Unlike"
                          : "Like"
                      }
                    >
                      <Heart
                        size={17}
                        className={
                          isLiked
                            ? "fill-purple-500 text-purple-500"
                            : "text-zinc-400"
                        }
                      />
                    </button>

                    {/* Add Playlist */}

                    <button
                      onClick={() =>
                        handleOpenPlaylistModal(
                          song
                        )
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400 transition hover:bg-purple-500 hover:text-white sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
                      title="Add to Playlist"
                    >
                      <Plus size={17} />

                      <span className="hidden text-sm font-medium sm:inline">
                        Add to Playlist
                      </span>
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* ================= EMPTY ================= */}

      {filteredSongs.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8 text-center sm:p-10">

          <ListMusic
            size={40}
            className="mx-auto text-zinc-600"
          />

          <h2 className="mt-4 font-semibold">
            {searchQuery
              ? "No songs found"
              : "No songs available"}
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {searchQuery
              ? `No songs match "${searchQuery}". Try another search.`
              : "There are no songs available right now."}
          </p>

        </div>
      )}

      {/* ================= PLAYLIST MODAL ================= */}

      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-2xl sm:p-6">

            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <h2 className="text-xl font-bold">
                  Add to Playlist
                </h2>

                <p className="mt-1 truncate text-sm text-zinc-500">
                  {selectedSong?.title}
                </p>

              </div>

              <button
                onClick={() => {
                  setShowPlaylistModal(false);
                  setPlaylistError("");
                  setSuccessMessage("");
                }}
                className="shrink-0 rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            {/* Playlists */}

            <div className="mt-6">

              {playlists.length === 0 ? (

                <div className="rounded-xl border border-white/5 bg-zinc-800 p-5 text-center">

                  <ListMusic
                    size={30}
                    className="mx-auto text-zinc-600"
                  />

                  <p className="mt-3 text-sm text-zinc-400">
                    You don't have any playlists yet.
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Create a playlist first.
                  </p>

                </div>

              ) : (

                <div className="space-y-2">

                  {playlists.map((playlist) => (

                    <button
                      key={playlist._id}
                      onClick={() =>
                        setSelectedPlaylist(
                          playlist._id
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                        selectedPlaylist ===
                        playlist._id
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-white/5 bg-zinc-800 hover:border-white/10"
                      }`}
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                          <ListMusic size={19} />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-medium">
                            {playlist.name}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {playlist.songs?.length || 0} songs
                          </p>

                        </div>

                      </div>

                      {selectedPlaylist ===
                        playlist._id && (
                        <Check
                          size={20}
                          className="shrink-0 text-purple-400"
                        />
                      )}

                    </button>

                  ))}

                </div>

              )}

            </div>

            {/* Error */}

            {playlistError && (
              <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {playlistError}
              </p>
            )}

            {/* Success */}

            {successMessage && (
              <p className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
                <Check size={17} />
                {successMessage}
              </p>
            )}

            {/* Buttons */}

            {playlists.length > 0 && (
              <div className="mt-6 flex justify-end gap-3">

                <button
                  onClick={() => {
                    setShowPlaylistModal(false);
                    setPlaylistError("");
                  }}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddSong}
                  disabled={adding}
                  className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adding
                    ? "Adding..."
                    : "Add Song"}
                </button>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default Songs;