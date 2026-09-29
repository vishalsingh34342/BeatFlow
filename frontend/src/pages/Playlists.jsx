import { useEffect, useState } from "react";
import {
  Plus,
  ListMusic,
  Trash2,
  ArrowLeft,
  Play,
} from "lucide-react";

import {
  createPlaylist,
  getMyPlaylists,
  deletePlaylist,
  removeSongFromPlaylist,
} from "../services/playlist";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ================= FETCH PLAYLISTS =================

  const fetchPlaylists = async () => {
    try {
      setLoading(true);

      const data = await getMyPlaylists();

      setPlaylists(data.playlists);
    } catch (error) {
      console.log("PLAYLIST ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load playlists"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // ================= CREATE PLAYLIST =================

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();

    if (!playlistName.trim()) {
      setErrorMessage("Playlist name is required");
      return;
    }

    try {
      setCreating(true);
      setErrorMessage("");

      await createPlaylist(playlistName);

      setPlaylistName("");
      setShowCreate(false);

      fetchPlaylists();
    } catch (error) {
      console.log("CREATE PLAYLIST ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to create playlist"
      );
    } finally {
      setCreating(false);
    }
  };

  // ================= OPEN PLAYLIST =================

  const handleOpenPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setErrorMessage("");
  };

  // ================= DELETE PLAYLIST =================

  const handleDeletePlaylist = async (playlistId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this playlist?"
    );

    if (!confirmed) return;

    try {
      setErrorMessage("");

      await deletePlaylist(playlistId);

      // Remove from frontend immediately
      setPlaylists((prev) =>
        prev.filter(
          (playlist) => playlist._id !== playlistId
        )
      );

      // If currently opened playlist was deleted
      if (selectedPlaylist?._id === playlistId) {
        setSelectedPlaylist(null);
      }
    } catch (error) {
      console.log("DELETE PLAYLIST ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to delete playlist"
      );
    }
  };

  // ================= REMOVE SONG =================

  const handleRemoveSong = async (playlistId, songId) => {
    try {
      setErrorMessage("");

      const data = await removeSongFromPlaylist(
        playlistId,
        songId
      );

      // Update opened playlist
      setSelectedPlaylist(data.playlist);

      // Update playlist list also
      setPlaylists((prev) =>
        prev.map((playlist) =>
          playlist._id === data.playlist._id
            ? data.playlist
            : playlist
        )
      );
    } catch (error) {
      console.log("REMOVE SONG ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to remove song"
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="py-10 text-center text-zinc-500">
        Loading playlists...
      </div>
    );
  }

  // ================= OPENED PLAYLIST =================

  if (selectedPlaylist) {
    return (
      <div className="text-white">

        {/* Back */}

        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setErrorMessage("");
          }}
          className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Playlists
        </button>

        {/* Error */}

        {errorMessage && (
          <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Playlist Header */}

        <div className="mb-8 flex items-center gap-5">

          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600">
            <ListMusic size={38} />
          </div>

          <div>

            <p className="text-sm text-zinc-500">
              Playlist
            </p>

            <h1 className="text-3xl font-bold">
              {selectedPlaylist.name}
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              {selectedPlaylist.songs?.length || 0} songs
            </p>

          </div>

        </div>

        {/* Songs */}

        {selectedPlaylist.songs?.length === 0 ? (

          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center">

            <ListMusic
              size={40}
              className="mx-auto text-zinc-600"
            />

            <p className="mt-4 text-zinc-500">
              No songs in this playlist
            </p>

          </div>

        ) : (

          <div className="space-y-3">

            {selectedPlaylist.songs.map(
              (song, index) => (

                <div
                  key={song._id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-white/5 bg-zinc-900 p-4 transition hover:bg-zinc-800"
                >

                  {/* Number */}

                  <span className="w-6 text-center text-sm text-zinc-600">
                    {index + 1}
                  </span>

                  {/* Cover */}

                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">

                    {song.coverUrl ? (

                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full w-full items-center justify-center">
                        <Play
                          size={20}
                          className="text-zinc-500"
                        />
                      </div>

                    )}

                  </div>

                  {/* Song Info */}

                  <div className="min-w-0 flex-1">

                    <h2 className="truncate font-semibold">
                      {song.title}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      Music
                    </p>

                  </div>

                  {/* Audio */}

                  <audio
                    controls
                    src={song.audioUrl}
                    className="w-full sm:w-56"
                  />

                  {/* Remove Song */}

                  <button
                    onClick={() =>
                      handleRemoveSong(
                        selectedPlaylist._id,
                        song._id
                      )
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                    title="Remove from playlist"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              )
            )}

          </div>

        )}

      </div>
    );
  }

  // ================= PLAYLIST PAGE =================

  return (
    <div className="text-white">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Your Playlists
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Create and manage your playlists
          </p>

        </div>

        <button
          onClick={() => {
            setErrorMessage("");
            setShowCreate(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
        >
          <Plus size={18} />
          Create Playlist
        </button>

      </div>

      {/* Error */}

      {errorMessage && !showCreate && (

        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {errorMessage}
        </div>

      )}

      {/* Empty */}

      {playlists.length === 0 ? (

        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
            <ListMusic size={30} />
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            No playlists yet
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Create your first playlist and start adding songs.
          </p>

          <button
            onClick={() => setShowCreate(true)}
            className="mt-5 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold hover:bg-purple-500"
          >
            Create Playlist
          </button>

        </div>

      ) : (

        /* Playlist Cards */

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {playlists.map((playlist) => (

            <div
              key={playlist._id}
              onClick={() =>
                handleOpenPlaylist(playlist)
              }
              className="group cursor-pointer rounded-2xl border border-white/10 bg-zinc-900 p-5 transition hover:border-purple-500/40 hover:bg-zinc-800"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <ListMusic size={24} />
                </div>

                {/* Delete Playlist */}

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    handleDeletePlaylist(
                      playlist._id
                    );
                  }}
                  className="rounded-lg p-2 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400"
                  title="Delete playlist"
                >
                  <Trash2 size={18} />
                </button>

              </div>

              <h2 className="mt-5 truncate text-lg font-semibold">
                {playlist.name}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {playlist.songs?.length || 0} songs
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-purple-400">
                <Play size={15} fill="currentColor" />
                Open Playlist
              </div>

            </div>

          ))}

        </div>

      )}

      {/* ================= CREATE MODAL ================= */}

      {showCreate && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">

            <h2 className="text-2xl font-bold">
              Create Playlist
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Give your playlist a name
            </p>

            <form
              onSubmit={handleCreatePlaylist}
              className="mt-6"
            >

              <label className="mb-2 block text-sm text-zinc-300">
                Playlist Name
              </label>

              <input
                type="text"
                value={playlistName}
                onChange={(e) =>
                  setPlaylistName(e.target.value)
                }
                placeholder="e.g. My Chill Songs"
                autoFocus
                className="w-full rounded-lg bg-zinc-800 p-3 text-white outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-purple-500"
              />

              {errorMessage && (

                <p className="mt-2 text-sm text-red-400">
                  {errorMessage}
                </p>

              )}

              <div className="mt-5 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setPlaylistName("");
                    setErrorMessage("");
                  }}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? "Creating..."
                    : "Create Playlist"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Playlists;