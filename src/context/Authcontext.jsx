import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
