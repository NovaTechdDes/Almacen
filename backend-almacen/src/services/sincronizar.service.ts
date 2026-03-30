import { pool } from '../config/db';
import { PedidoMovil } from '../types/Pedido';
import { cargarClientes, cargarPedidos } from './';

export const sincronizar = async (data: any) => {
  const { clientes, productos, pedidos } = data;
  let pedidosSincronizados: PedidoMovil[] = [];

  try {
    const transaction = await pool.transaction();
    await transaction.begin();

    if (clientes) {
      await cargarClientes(transaction, clientes);
    }

    if (pedidos) {
      pedidosSincronizados = await cargarPedidos(transaction, pedidos);
    }

    await transaction.commit();
    return pedidosSincronizados;
  } catch (error) {
    console.error('Error al sincronizar', error);
    return false;
  }
};
