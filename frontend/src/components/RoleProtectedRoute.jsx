import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Checking authentication...
      </div>
    );
  }

  // Login nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role match karta hai
  if (user.role === role) {
    return children;
  }

  // Admin
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Artist
  if (user.role === "artist") {
    return <Navigate to="/artist" replace />;
  }

  // Normal user
  return <Navigate to="/" replace />;
};

export default RoleProtectedRoute;