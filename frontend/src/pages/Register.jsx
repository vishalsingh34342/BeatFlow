import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log(response.data);

      navigate("/verify-otp", {
        state: { email },
      });

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Registration failed"
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
        {/* Heading */}
        <h1 className="mb-2 text-3xl font-bold">
          Create Account
        </h1>

        <p className="mb-6 text-sm text-zinc-400">
          Create your BeatFlow account
        </p>

        {/* Name */}
        <label className="mb-2 block text-sm text-zinc-300">
          Name
        </label>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full rounded-lg bg-zinc-800 p-3 text-white outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-purple-500"
        />

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
          <p className="mt-3 text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        {/* Register */}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-purple-600 py-3 font-semibold transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Login navigation */}
        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-purple-500 hover:text-purple-400"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;