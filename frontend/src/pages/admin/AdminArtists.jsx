import { useEffect, useState } from "react";
import { Mic2, RefreshCw, Mail, UserRound } from "lucide-react";
import api from "../../services/api";

const AdminArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/admin/artists");

      setArtists(response.data.artists || []);
    } catch (error) {
      console.log("FETCH ARTISTS ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to fetch artists"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600/15 text-purple-400">
              <Mic2 size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Artists
              </h1>

              <p className="text-sm text-zinc-500">
                Manage all registered artists
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={fetchArtists}
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
            Total Artists
          </p>

          <p className="mt-1 text-3xl font-bold">
            {artists.length}
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
      ) : artists.length === 0 ? (

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

          <Mic2
            size={35}
            className="mx-auto mb-3 text-zinc-600"
          />

          <p className="text-zinc-400">
            No artists found
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
                    Artist
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    ID
                  </th>

                </tr>
              </thead>


              <tbody>

                {artists.map((artist) => (

                  <tr
                    key={artist._id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                  >

                    {/* Artist */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600/15 font-semibold text-purple-400">
                          {artist.name
                            ?.charAt(0)
                            ?.toUpperCase() || "A"}
                        </div>

                        <div>
                          <p className="font-medium text-white">
                            {artist.name || "Unknown"}
                          </p>
                        </div>

                      </div>

                    </td>


                    {/* Email */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-sm text-zinc-400">

                        <Mail size={15} />

                        {artist.email}

                      </div>

                    </td>


                    {/* Role */}
                    <td className="px-5 py-4">

                      <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                        Artist
                      </span>

                    </td>


                    {/* ID */}
                    <td className="px-5 py-4">

                      <p className="max-w-48 truncate text-xs text-zinc-600">
                        {artist._id}
                      </p>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* Mobile */}
          <div className="space-y-3 p-3 md:hidden">

            {artists.map((artist) => (

              <div
                key={artist._id}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-600/15 text-purple-400">
                    <UserRound size={20} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate font-medium text-white">
                      {artist.name || "Unknown"}
                    </p>

                    <p className="truncate text-sm text-zinc-500">
                      {artist.email}
                    </p>

                  </div>

                </div>


                <div className="mt-4 flex items-center justify-between">

                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                    Artist
                  </span>

                  <p className="max-w-32 truncate text-xs text-zinc-600">
                    {artist._id}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminArtists;