import { useEffect, useState } from "react";
import { Trash2, Shield, RefreshCw, Users } from "lucide-react";
import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/admin/users");

      setUsers(response.data.users || []);
    } catch (error) {
      console.log("FETCH USERS ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setErrorMessage("");

      await api.delete(`/admin/users/${userId}`);

      setUsers((prev) =>
        prev.filter((user) => user._id !== userId)
      );
    } catch (error) {
      console.log("DELETE USER ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      setUpdatingId(userId);
      setErrorMessage("");

      const response = await api.patch(
        `/admin/users/${userId}/role`,
        { role }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? response.data.user
            : user
        )
      );
    } catch (error) {
      console.log("ROLE UPDATE ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update role"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600/15 text-purple-400">
              <Users size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Users
              </h1>

              <p className="text-sm text-zinc-500">
                Manage all registered users
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
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
            Total Users
          </p>

          <p className="mt-1 text-3xl font-bold">
            {users.length}
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
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <Users
            size={35}
            className="mx-auto mb-3 text-zinc-600"
          />

          <p className="text-zinc-400">
            No users found
          </p>
        </div>
      ) : (

        /* Desktop Table */
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">

              <thead className="border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Role
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Action
                  </th>
                </tr>
              </thead>


              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                  >

                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600/15 font-semibold text-purple-400">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="font-medium text-white">
                            {user.name || "Unknown"}
                          </p>

                          <p className="text-xs text-zinc-600">
                            {user._id}
                          </p>
                        </div>

                      </div>
                    </td>


                    {/* Email */}
                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {user.email}
                    </td>


                    {/* Role */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">

                        <Shield
                          size={15}
                          className="text-purple-400"
                        />

                        <select
                          value={user.role}
                          disabled={updatingId === user._id}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-zinc-300 outline-none focus:border-purple-500/50 disabled:opacity-50"
                        >
                          <option value="user">
                            User
                          </option>

                          <option value="artist">
                            Artist
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>

                      </div>
                    </td>


                    {/* Delete */}
                    <td className="px-5 py-4 text-right">

                      {user.role === "admin" ? (
                        <span className="text-xs text-zinc-600">
                          Protected
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handleDelete(user._id)
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>


          {/* Mobile Cards */}
          <div className="space-y-3 p-3 md:hidden">

            {users.map((user) => (
              <div
                key={user._id}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600/15 font-semibold text-purple-400">
                    {user.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {user.name || "Unknown"}
                    </p>

                    <p className="truncate text-sm text-zinc-500">
                      {user.email}
                    </p>
                  </div>

                </div>


                <div className="flex items-center justify-between gap-3">

                  <select
                    value={user.role}
                    disabled={updatingId === user._id}
                    onChange={(e) =>
                      handleRoleChange(
                        user._id,
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-zinc-300 outline-none focus:border-purple-500/50 disabled:opacity-50"
                  >
                    <option value="user">
                      User
                    </option>

                    <option value="artist">
                      Artist
                    </option>

                    <option value="admin">
                      Admin
                    </option>
                  </select>


                  {user.role === "admin" ? (
                    <span className="text-xs text-zinc-600">
                      Protected
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        handleDelete(user._id)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminUsers;