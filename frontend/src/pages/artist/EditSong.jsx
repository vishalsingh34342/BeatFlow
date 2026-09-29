import { useEffect, useState } from "react";
import { ArrowLeft, Save, Upload, Music } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getMySongs, editSong } from "../../services/music";

const EditSong = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [song, setSong] = useState(null);

  const [musicFile, setMusicFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getMySongs();

        const foundSong = data.songs?.find(
          (item) => item._id === id
        );

        if (!foundSong) {
          setErrorMessage("Song not found");
          return;
        }

        setSong(foundSong);
        setTitle(foundSong.title || "");
      } catch (error) {
        console.log("EDIT SONG LOAD ERROR:", error);

        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load song"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setErrorMessage("");

      const formData = new FormData();

      formData.append("title", title);

      if (musicFile) {
        formData.append("music", musicFile);
      }

      if (coverFile) {
        formData.append("cover", coverFile);
      }

      await editSong(id, formData);

      navigate("/artist/songs");
    } catch (error) {
      console.log("EDIT SONG ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update song"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-zinc-500">
        Loading song...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">

      <Link
        to="/artist/songs"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to My Songs
      </Link>

      <div className="mb-8">
        <p className="text-sm text-purple-400">
          Artist Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Edit Song
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Update your song details and files.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      {song && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-zinc-900 p-6"
        >

          {/* Current Cover */}
          <div className="mb-6 flex items-center gap-4">

            <div className="h-20 w-20 overflow-hidden rounded-xl bg-zinc-800">

              {song.coverUrl ? (
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-600">
                  <Music size={28} />
                </div>
              )}

            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Current song
              </p>

              <h2 className="font-semibold">
                {song.title}
              </h2>
            </div>

          </div>

          {/* Title */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Song Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-purple-500"
              placeholder="Enter song title"
            />

          </div>

          {/* Music */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Replace Music
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/10 bg-black p-4 transition hover:border-purple-500/50">

              <Upload
                size={20}
                className="text-purple-400"
              />

              <div className="min-w-0">

                <p className="text-sm text-zinc-300">
                  {musicFile
                    ? musicFile.name
                    : "Choose a new audio file"}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Leave empty to keep the current song
                </p>

              </div>

              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) =>
                  setMusicFile(e.target.files[0])
                }
              />

            </label>

          </div>

          {/* Cover */}
          <div className="mb-8">

            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Replace Cover
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/10 bg-black p-4 transition hover:border-purple-500/50">

              <Upload
                size={20}
                className="text-purple-400"
              />

              <div className="min-w-0">

                <p className="text-sm text-zinc-300">
                  {coverFile
                    ? coverFile.name
                    : "Choose a new cover image"}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Leave empty to keep the current cover
                </p>

              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setCoverFile(e.target.files[0])
                }
              />

            </label>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>

        </form>
      )}

    </div>
  );
};

export default EditSong;