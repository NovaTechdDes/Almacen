import { create } from "zustand";

export interface PedidoStore {
  modalOpen: boolean;
  toggleModal: () => void;
}

export const usePedidoStore = create<PedidoStore>((set) => ({
  modalOpen: false,
  toggleModal: () => set((state) => ({ modalOpen: !state.modalOpen })),
}));
