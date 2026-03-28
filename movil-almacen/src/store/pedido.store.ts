import { create } from "zustand";
import { Cliente, Producto, ProductoCarrito } from "../interface";

export interface PedidoStore {
  modalOpen: boolean;
  toggleModal: () => void;

  items: ProductoCarrito[];
  addItem: (producto: Producto | ProductoCarrito) => void;
  removeItem: (producto: ProductoCarrito) => void;
  substractItem: (producto: ProductoCarrito) => void;

  total: number;
  setTotal: (total: number) => void;

  cliente: Cliente | null;
  setCliente: (cliente: Cliente | null) => void;

  clearPedido: () => void;
}

export const usePedidoStore = create<PedidoStore>((set) => ({
  modalOpen: false,
  toggleModal: () => set((state) => ({ modalOpen: !state.modalOpen })),

  items: [],
  addItem: (producto: Producto | ProductoCarrito) =>
    set((state) => {
      const productoCarrito = state.items.find(
        (item) => item.id_producto === producto.id_producto,
      );

      if (productoCarrito) {
        const updateItems = state.items.map((item) =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
        const total = updateItems.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0,
        );
        return {
          items: updateItems,
          total,
        };
      } else {
        const updateItems = [...state.items, { ...producto, cantidad: 1 }];
        const total = updateItems.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0,
        );
        return {
          items: updateItems,
          total,
        };
      }
    }),

  removeItem: (producto: ProductoCarrito) =>
    set((state) => {
      const updateItems = state.items.filter(
        (item) => item.id_producto !== producto.id_producto,
      );
      const total = updateItems.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0,
      );
      return {
        items: updateItems,
        total,
      };
    }),

  substractItem: (producto: ProductoCarrito) =>
    set((state) => {
      const updateItems = state.items.map((item) =>
        item.id_producto === producto.id_producto
          ? item.cantidad === 1
            ? { ...item, cantidad: 1 }
            : { ...item, cantidad: item.cantidad - 1 }
          : item,
      );
      const total = updateItems.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0,
      );
      return {
        items: updateItems,
        total,
      };
    }),

  total: 0,
  setTotal: (total: number) => set({ total }),

  cliente: null,
  setCliente: (cliente: Cliente | null) => set({ cliente }),

  clearPedido: () =>
    set({
      items: [],
      modalOpen: false,
      total: 0,
    }),
}));
