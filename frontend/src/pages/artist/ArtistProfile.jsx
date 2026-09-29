import { useEffect, useState } from "react";
import {
  User,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import api from "../../services/api";

const ArtistProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ================= FETCH PROFILE =================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/user/profile");

      const user = response.data.user;

      setProfile({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    } catch (error) {
      console.log("PROFILE ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= UPDATE PROFILE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      await api.patch("/user/profile", {
        name: profile.name,
        bio: profile.bio,
      });

      setSuccessMessage(
        "Profile updated successfully"
      );
    } catch (error) {
      console.log("UPDATE PROFILE ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-zinc-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl text-white">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm text-purple-400">
          Artist Panel
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Artist Profile
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Manage your artist information.
        </p>
      </div>

      {/* Error */}

      {errorMessage && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={19} />
          {errorMessage}
        </div>
      )}

      {/* Success */}

      {successMessage && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
          <CheckCircle size={19} />
          {successMessage}
        </div>
      )}

      {/* Profile Card */}

      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5 sm:p-7">

        {/* Avatar */}

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 text-white">
            <User size={34} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {profile.name || "Artist"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Artist Account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Artist Name
            </label>

            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  name: e.target.value,
                })
              }
              placeholder="Enter your artist name"
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-purple-500"
            />
          </div>

          {/* Email */}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-500 outline-none"
            />

            <p className="mt-2 text-xs text-zinc-600">
              Email cannot be changed.
            </p>
          </div>

          {/* Bio */}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Bio
            </label>

            <textarea
              value={profile.bio}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bio: e.target.value,
                })
              }
              rows={5}
              placeholder="Tell listeners something about yourself..."
              className="w-full resize-none rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-purple-500"
            />
          </div>

          {/* Save */}

          <button
            type="submit"
            disabled={saving}
            className="mt-7 flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ArtistProfile;