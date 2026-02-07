"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "./api";
import { STORAGE_KEYS } from "./constants";

interface User {
  name: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Try to get user from sessionStorage first
      const cachedUser = sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (cachedUser) {
        try {
          const parsed = JSON.parse(cachedUser);
          if (parsed.data) {
            setUser(parsed.data);
          } else {
            setUser(parsed);
          }
        } catch {
          // Invalid cached data, fetch from API
        }
      }

      // Fetch fresh user data from API
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
        sessionStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // If fetch fails and we're on a protected route, redirect to login
      if (pathname?.startsWith("/dashboard")) {
        sessionStorage.clear();
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (token: string) => {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    await fetchUser();
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
