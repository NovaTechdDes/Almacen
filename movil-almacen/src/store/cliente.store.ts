import { create } from "zustand";

export interface ClienteStore {
  buscador: string;
  setBuscador: (buscador: string) => void;
}

export const useClienteStore = create<ClienteStore>((set) => ({
  buscador: "",
  setBuscador: (buscador: string) => set({ buscador }),
}));
