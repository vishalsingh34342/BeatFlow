import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Shield,
  Pencil,
  Save,
  X,
} from "lucide-react";

import api from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editing, setEditing] = useState(false);

  // ================= FETCH PROFILE =================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get("/user/profile");

        const user = response.data.user;

        setProfile(user);
        setName(user?.name || "");
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

    fetchProfile();
  }, []);

  // ================= UPDATE PROFILE =================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Name cannot be empty");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await api.patch(
        "/user/profile",
        {
          name: name.trim(),
        }
      );

      const updatedUser =
        response.data.user || {
          ...profile,
          name: name.trim(),
        };

      setProfile(updatedUser);
      setName(updatedUser.name || "");

      setEditing(false);

      setSuccessMessage(
        "Profile updated successfully"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
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
      <div className="flex min-h-[300px] items-center justify-center text-zinc-400">
        Loading profile...
      </div>
    );
  }

  // ================= ERROR =================

  if (errorMessage && !profile) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl text-white">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm text-purple-400">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Manage your BeatFlow account information.
        </p>
      </div>

      {/* Messages */}

      {errorMessage && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
          {successMessage}
        </div>
      )}

      {/* Profile Card */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">

        {/* Top */}

        <div className="border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-transparent p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Avatar */}

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-900/20">
              <User size={36} />
            </div>

            {/* User */}

            <div className="min-w-0">

              <h2 className="truncate text-2xl font-bold">
                {profile?.name || "User"}
              </h2>

              <p className="mt-1 truncate text-sm text-zinc-400">
                {profile?.email || "No email"}
              </p>

              {profile?.role && (
                <span className="mt-3 inline-flex rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium capitalize text-purple-400">
                  {profile.role}
                </span>
              )}

            </div>

          </div>

        </div>

        {/* Information */}

        <div className="p-6">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h3 className="font-semibold">
                Personal Information
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Your account details
              </p>
            </div>

            {!editing && (
              <button
                onClick={() => {
                  setName(profile?.name || "");
                  setEditing(true);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-sm font-medium text-purple-400 transition hover:bg-purple-500 hover:text-white"
              >
                <Pencil size={16} />
                Edit
              </button>
            )}

          </div>

          {editing ? (

            <form
              onSubmit={handleUpdateProfile}
              className="space-y-5"
            >

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm text-zinc-400">
                  Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-zinc-800 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-500"
                    placeholder="Enter your name"
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="mb-2 block text-sm text-zinc-400">
                  Email
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-zinc-800/50 py-3 pl-10 pr-4 text-sm text-zinc-500 outline-none"
                  />

                </div>

                <p className="mt-2 text-xs text-zinc-600">
                  Email cannot be changed.
                </p>

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setName(profile?.name || "");
                    setErrorMessage("");
                  }}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          ) : (

            <div className="space-y-3">

              {/* Name */}

              <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-zinc-800/50 p-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <User size={19} />
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Name
                  </p>

                  <p className="mt-1 font-medium">
                    {profile?.name || "Not available"}
                  </p>
                </div>

              </div>

              {/* Email */}

              <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-zinc-800/50 p-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <Mail size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-zinc-500">
                    Email
                  </p>

                  <p className="mt-1 truncate font-medium">
                    {profile?.email || "Not available"}
                  </p>
                </div>

              </div>

              {/* Role */}

              <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-zinc-800/50 p-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <Shield size={19} />
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Account Type
                  </p>

                  <p className="mt-1 font-medium capitalize">
                    {profile?.role || "User"}
                  </p>
                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;