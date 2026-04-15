import { create } from 'zustand';
import { Cliente, Producto, ProductoCarrito } from '../interface';

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

  changePrice: (producto: ProductoCarrito, nuevoPrecio: number) => void;
  clearPedido: () => void;
}

export const usePedidoStore = create<PedidoStore>((set) => ({
  modalOpen: false,
  toggleModal: () => set((state) => ({ modalOpen: !state.modalOpen })),

  items: [],
  addItem: (producto: Producto | ProductoCarrito) =>
    set((state) => {
      const productoCarrito = state.items.find((item) => item.id_producto === producto.id_producto);
      if (productoCarrito) {
        const precio = productoCarrito.precios_mayoristas
          ?.filter((pm) => pm.cant_mayorista && productoCarrito.cantidad + 1 >= pm.cant_mayorista && pm.id_articulo === productoCarrito.id_producto)
          .sort((a, b) => b.cant_mayorista - a.cant_mayorista)
          .at(0);

        const updateItems = state.items.map((item) =>
          item.id_producto === producto.id_producto
            ? {
                ...item,
                precioAux: precio ? precio?.precio_mayorista : item.precio,
                cantidad: item.cantidad + 1,
              }
            : item
        );

        const total = updateItems.reduce((acc, item) => acc + item.precioAux * item.cantidad, 0);
        return {
          items: updateItems,
          total,
        };
      } else {
        const updateItems = [...state.items, { ...producto, precioAux: producto.precio, cantidad: 1 }];
        const total = updateItems.reduce((acc, item) => acc + item.precioAux * item.cantidad, 0);
        return {
          items: updateItems,
          total,
        };
      }
    }),

  removeItem: (producto: ProductoCarrito) =>
    set((state) => {
      const updateItems = state.items.filter((item) => item.id_producto !== producto.id_producto);
      const total = updateItems.reduce((acc, item) => acc + item.precioAux * item.cantidad, 0);
      return {
        items: updateItems,
        total,
      };
    }),

  substractItem: (producto: ProductoCarrito) =>
    set((state) => {
      const precio = producto.precios_mayoristas?.find((pm) => pm.cant_mayorista && producto.cantidad - 1 >= pm.cant_mayorista && pm.id_articulo === producto.id_producto);

      const updateItems = state.items.map((item) =>
        item.id_producto === producto.id_producto
          ? item.cantidad === 1
            ? { ...item, cantidad: 1, precioAux: item.precio }
            : {
                ...item,
                cantidad: item.cantidad - 1,
                precioAux: precio ? precio?.precio_mayorista : item.precio,
              }
          : item
      );

      console.log(updateItems);

      const total = updateItems.reduce((acc, item) => acc + item.precioAux * item.cantidad, 0);
      return {
        items: updateItems,
        total,
      };
    }),

  total: 0,
  setTotal: (total: number) => set({ total }),

  cliente: null,
  setCliente: (cliente: Cliente | null) => set({ cliente }),

  changePrice: (producto: ProductoCarrito, nuevoPrecio: number) =>
    set((state) => {
      const updateItems = state.items.map((item) => (item.id_producto === producto.id_producto ? { ...item, precio: nuevoPrecio } : item));
      const total = updateItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
      return {
        items: updateItems,
        total,
      };
    }),

  clearPedido: () =>
    set({
      items: [],
      modalOpen: false,
      cliente: null,
      total: 0,
    }),
}));
