import { User } from "@/constants/types";
import { create } from "zustand";

type UserStore = {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
};

const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
}));

export default useUserStore;
