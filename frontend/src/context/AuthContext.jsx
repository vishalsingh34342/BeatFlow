import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


const checkAuth = async () => {
  try {
    const response = await api.get("/user/profile");

    console.log("PROFILE USER:", response.data.user);

    setUser(response.data.user);

    return response.data.user;
  } catch (error) {
    console.log("PROFILE ERROR:", error);
    setUser(null);
    return null;
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    checkAuth();
  }, []);


    return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

 
};

export const useAuth = () => {
  return useContext(AuthContext);
};
