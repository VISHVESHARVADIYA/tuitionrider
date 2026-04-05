import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("tuitionrider_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("tuitionrider_token") || null
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authToken = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (authToken) {
      const nextUser = {
        name: name || "Google User",
        email: email || "",
        role: "student",
      };

      localStorage.setItem("tuitionrider_token", authToken);
      localStorage.setItem("tuitionrider_user", JSON.stringify(nextUser));
      setToken(authToken);
      setUser(nextUser);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("tuitionrider_token", data.token);
    localStorage.setItem("tuitionrider_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("tuitionrider_token", data.token);
    localStorage.setItem("tuitionrider_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("tuitionrider_token");
    localStorage.removeItem("tuitionrider_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin",
      login,
      signup,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
