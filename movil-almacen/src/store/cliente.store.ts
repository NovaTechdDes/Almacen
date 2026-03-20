import { create } from "zustand";

export interface ClienteStore {
  buscador: string;
  setBuscador: (buscador: string) => void;

  modalFormulario: boolean;
  openModalFormulario: () => void;
  closeModalFormulario: () => void;
}

export const useClienteStore = create<ClienteStore>((set) => ({
  buscador: "",
  setBuscador: (buscador: string) => set({ buscador }),

  modalFormulario: false,
  openModalFormulario: () => set({ modalFormulario: true }),
  closeModalFormulario: () => set({ modalFormulario: false }),
}));
