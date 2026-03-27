import { create } from "zustand";

export interface ProductoStore {
  buscador: string;
  setBuscador: (buscador: string) => void;
}

export const useProductoStore = create<ProductoStore>((set) => ({
  buscador: "",
  setBuscador: (buscador: string) => set({ buscador }),
}));
