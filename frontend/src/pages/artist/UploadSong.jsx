import { useState } from "react";
import {
  Upload,
  Music,
  Image,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const UploadSong = () => {
  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Song title is required");
      return;
    }

    if (!audio) {
      setErrorMessage("Please select an audio file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("music", audio);

      if (cover) {
        formData.append("cover", cover);
      }

      await api.post("/music/create", formData);

      setSuccessMessage("Song uploaded successfully");

      setTitle("");
      setAudio(null);
      setCover(null);

      // File inputs reset
      e.target.reset();
    } catch (error) {
      console.log("UPLOAD SONG ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to upload song"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl text-white">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm text-purple-400">
          Artist Panel
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Upload Song
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Upload your music and share it with listeners.
        </p>
      </div>

      {/* Messages */}

      {successMessage && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
          <CheckCircle size={19} />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={19} />
          {errorMessage}
        </div>
      )}

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-zinc-900 p-5 sm:p-7"
      >

        {/* Song Title */}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Song Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title"
            className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-purple-500"
          />
        </div>

        {/* Audio */}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Audio File
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-zinc-800 p-8 text-center transition hover:border-purple-500/50 hover:bg-zinc-800/70">
            <Music
              size={30}
              className="text-purple-400"
            />

            <p className="mt-3 text-sm font-medium text-white">
              {audio
                ? audio.name
                : "Choose your audio file"}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              MP3, WAV and other supported formats
            </p>

            <input
              type="file"
              accept="audio/*"
              onChange={(e) =>
                setAudio(e.target.files[0])
              }
              className="hidden"
            />
          </label>
        </div>

        {/* Cover */}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Cover Image
            <span className="ml-2 text-xs text-zinc-600">
              Optional
            </span>
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-zinc-800 p-8 text-center transition hover:border-purple-500/50 hover:bg-zinc-800/70">
            <Image
              size={30}
              className="text-purple-400"
            />

            <p className="mt-3 text-sm font-medium text-white">
              {cover
                ? cover.name
                : "Choose cover image"}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              JPG, PNG or WEBP
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCover(e.target.files[0])
              }
              className="hidden"
            />
          </label>
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={uploading}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload size={18} />

          {uploading
            ? "Uploading..."
            : "Upload Song"}
        </button>

      </form>
    </div>
  );
};

export default UploadSong;