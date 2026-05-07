import { create } from "zustand";
import { api, User } from "./api";

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      set({ loading: true });
      const { user } = await api.auth.me();
      set({ user, initialized: true, loading: false });
    } catch {
      set({ user: null, initialized: true, loading: false });
    }
  },

  login: async (phone, password) => {
    set({ loading: true });
    try {
      const { user } = await api.auth.login(phone, password);
      set({ user, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  register: async (name, phone, password) => {
    set({ loading: true });
    try {
      const { user } = await api.auth.register(name, phone, password);
      set({ user, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    await api.auth.logout();
    set({ user: null });
  },
}));
