import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

export const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /* =========================
      LOAD USER
  ========================= */

  const loadUser =
    useCallback(async () => {

      try {

        const response =
          await api.get("/auth/me");

        setUser(
          response.data.user || null
        );

        setError(null);

      } catch {

        setUser(null);

      } finally {

        setLoading(false);

      }

    }, []);

  useEffect(() => {

    loadUser();

  }, [loadUser]);

  /* =========================
      LOGIN
  ========================= */

  const login =
    useCallback(
      async (
        email,
        password
      ) => {

        setLoading(true);

        setError(null);

        try {

          const response =
            await api.post(
              "/auth/login",
              {
                email,
                password,
              }
            );

          setUser(
            response.data.user || null
          );

          return response.data.user;

        } catch (err) {

          const message =
            err.response?.data
              ?.message ||
            "Login failed";

          setError(message);

          throw new Error(message);

        } finally {

          setLoading(false);

        }

      },
      []
    );

  /* =========================
      SIGNUP
  ========================= */

  const signup =
    useCallback(
      async (
        name,
        email,
        password,
        phoneNumber
      ) => {

        setLoading(true);

        setError(null);

        try {

          const response =
            await api.post(
              "/auth/signup",
              {
                name,
                email,
                password,
                phoneNumber,
              }
            );

          setUser(
            response.data.user || null
          );

          return response.data.user;

        } catch (err) {

          const message =
            err.response?.data
              ?.message ||
            "Signup failed";

          setError(message);

          throw new Error(message);

        } finally {

          setLoading(false);

        }

      },
      []
    );

  /* =========================
      LOGOUT
  ========================= */

  const logout =
    useCallback(async () => {

      try {

        await api.post(
          "/auth/logout"
        );

      } catch {

        // ignore

      } finally {

        setUser(null);

        setError(null);

      }

    }, []);

  /* =========================
      ADMIN CHECK
  ========================= */

  const isAdmin =
    user?.role === "admin";

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,

    isAuthenticated:
      !!user,

    isAdmin,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};