import { create } from "zustand";
import { Cliente } from "../interface";

export interface ClienteStore {
  buscador: string;
  setBuscador: (buscador: string) => void;

  clienteSeleccionado: Cliente | null;
  setClienteSeleccionado: (cliente: Cliente | null) => void;
}

export const useClienteStore = create<ClienteStore>((set) => ({
  buscador: "",
  setBuscador: (buscador: string) => set({ buscador }),

  clienteSeleccionado: null,
  setClienteSeleccionado: (cliente: Cliente | null) =>
    set({ clienteSeleccionado: cliente }),
}));
