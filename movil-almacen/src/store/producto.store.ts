import { create } from 'zustand';

export interface ProductoStore {
  buscador: string;
  setBuscador: (buscador: string) => void;

  rubroSeleccionadoId: number | null;
  setRubroSeleccionadoId: (rubroSeleccionadoId: number | null) => void;
}

export const useProductoStore = create<ProductoStore>((set) => ({
  buscador: '',
  setBuscador: (buscador: string) => set({ buscador }),

  rubroSeleccionadoId: 0,
  setRubroSeleccionadoId: (rubroSeleccionadoId: number | null) => set({ rubroSeleccionadoId }),
}));
