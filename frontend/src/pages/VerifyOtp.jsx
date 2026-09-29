import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    try {
      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      console.log(response.data);

      navigate("/login");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-zinc-900 p-6"
      >
        <h1 className="mb-2 text-3xl font-bold">
          Verify OTP
        </h1>

        <p className="mb-6 text-sm text-zinc-400">
          OTP sent to: {email}
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mb-2 w-full rounded-lg bg-zinc-800 p-3 outline-none focus:ring-1 focus:ring-purple-500"
        />

        {errorMessage && (
          <p className="mb-4 text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-purple-600 py-3 font-semibold hover:bg-purple-700"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;