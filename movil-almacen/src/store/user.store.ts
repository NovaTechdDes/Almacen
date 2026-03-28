import { create } from "zustand";
import { Vendedor } from "../interface";

export interface UserStore {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;

  userActive: Vendedor | null;
  setUserActive: (user: Vendedor | null) => void;

  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  modalVisible: false,
  setModalVisible: (visible: boolean) => set({ modalVisible: visible }),

  userActive: null,
  setUserActive: (user: Vendedor | null) => set({ userActive: user }),

  logout: () => set({ userActive: null }),
}));
