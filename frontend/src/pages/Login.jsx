import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      await api.post("/auth/login", {
        email,
        password,
      });

      const loggedInUser = await checkAuth();

      console.log("LOGIN USER:", loggedInUser);
      console.log("LOGIN ROLE:", loggedInUser?.role);

      // ADMIN
      if (loggedInUser?.role === "admin") {
        console.log("REDIRECTING TO ADMIN");
        window.location.href = "/admin";
        return;
      }

      // ARTIST
      if (loggedInUser?.role === "artist") {
        console.log("REDIRECTING TO ARTIST");
        window.location.href = "/artist";
        return;
      }

      // NORMAL USER
      console.log("REDIRECTING TO USER");
      window.location.href = "/";
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      setErrorMessage(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 sm:p-8"
      >

        <h1 className="mb-2 text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mb-6 text-sm text-zinc-400">
          Login to continue to BeatFlow
        </p>


        {/* Email */}
        <label className="mb-2 block text-sm text-zinc-300">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg bg-zinc-800 p-3 text-white outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-purple-500"
        />


        {/* Password */}
        <label className="mb-2 block text-sm text-zinc-300">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 w-full rounded-lg bg-zinc-800 p-3 text-white outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-purple-500"
        />


        {/* Error */}
        {errorMessage && (
          <p className="mb-4 text-sm text-red-500">
            {errorMessage}
          </p>
        )}


        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-purple-600 py-3 font-semibold transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>


        {/* Register */}
        <p className="mt-6 text-center text-sm text-zinc-400">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-medium text-purple-500 hover:text-purple-400"
          >
            Register
          </button>
        </p>

      </form>

    </div>
  );
};

export default Login;