import { create } from "zustand";
import { User } from "@/types/user";
import { clearAuthCookie } from "@/lib/token";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * 👇 MANUAL USER SET (what you asked for)
   */
  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
      isLoading: false,
    }),

  /**
   * Logout user
   */
  logout: async () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    clearAuthCookie();
    window.location.href = "/login";
  },
}));
