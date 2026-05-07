import { create } from "zustand";
import { api, User } from "./api";

type AdminState = {
  admin: User | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchAdmin: () => Promise<void>;
};

export const useAdminStore = create<AdminState>((set) => ({
  admin: null,
  loading: false,
  initialized: false,

  fetchAdmin: async () => {
    try {
      set({ loading: true });
      const { user } = await api.auth.me();
      if (user.isAdmin) {
        set({ admin: user, initialized: true, loading: false });
      } else {
        set({ admin: null, initialized: true, loading: false });
      }
    } catch {
      set({ admin: null, initialized: true, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { user } = await api.auth.login(email, password);
      if (!user.isAdmin) {
        await api.auth.logout();
        set({ loading: false });
        throw new Error("This account does not have admin access");
      }
      set({ admin: user, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    await api.auth.logout();
    set({ admin: null });
  },
}));
