import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as authService from "../services/authService";
import { subscribe } from "../data/mockDb";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = await authService.getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    // keep the logged-in user's own profile in sync if mock data changes
    return subscribe(() => refresh());
  }, [refresh]);

  const login = async (identifier, password) => {
    const u = await authService.login(identifier, password);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, role: user?.designation || null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
