// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
} | null;

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser;
};

type LoginArgs = {
  token: string;
  user: AuthUser;
  remember?: boolean;
};

type AuthContextValue = {
  auth: AuthState;
  login: (args: LoginArgs) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "zonerlost-admin-auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  // Load auth state from localStorage on first mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuth({
          isAuthenticated: true,
          token: parsed.token,
          user: parsed.user ?? null,
        });
      }
    } catch (err) {
      console.error("Failed to read auth from storage", err);
    }
  }, []);

  const login = ({ token, user, remember = true }: LoginArgs) => {
    const next: AuthState = {
      isAuthenticated: true,
      token,
      user,
    };

    setAuth(next);

    if (remember) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error("Failed to write auth to storage", err);
      }
    }
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      token: null,
      user: null,
    });

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear auth storage", err);
    }
  };

  const value: AuthContextValue = { auth, login, logout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
