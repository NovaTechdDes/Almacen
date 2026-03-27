import { create } from "zustand";
import { Cliente } from "../interface";

export interface ClienteStore {
  buscador: string;
  setBuscador: (buscador: string) => void;

  modalFormulario: boolean;
  openModalFormulario: () => void;
  closeModalFormulario: () => void;

  clienteSeleccionado: Cliente | null;
  setClienteSeleccionado: (cliente: Cliente | null) => void;
}

export const useClienteStore = create<ClienteStore>((set) => ({
  buscador: "",
  setBuscador: (buscador: string) => set({ buscador }),

  modalFormulario: false,
  openModalFormulario: () => set({ modalFormulario: true }),
  closeModalFormulario: () => set({ modalFormulario: false }),

  clienteSeleccionado: null,
  setClienteSeleccionado: (cliente: Cliente | null) =>
    set({ clienteSeleccionado: cliente }),
}));
