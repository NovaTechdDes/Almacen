import { pool } from '../config/db';
import { ClienteMovil } from '../types/Cliente';
import { PedidoMovil } from '../types/Pedido';
import { cargarClientes, cargarPedidos } from './';

export const sincronizar = async (data: any) => {
  const { clientes, pedidos } = data;

  let clientesSincronizados: ClienteMovil[] = [];
  let pedidosSincronizados: PedidoMovil[] = [];

  const transaction = await pool.transaction();

  try {
    await transaction.begin();

    if (clientes && clientes.length > 0) {
      clientesSincronizados = await cargarClientes(transaction, clientes);
    }

    if (pedidos && pedidos.length > 0) {
      pedidosSincronizados = await cargarPedidos(transaction, pedidos, clientesSincronizados);
    }

    await transaction.commit();
    return { clientes: clientesSincronizados, pedidos: pedidosSincronizados };
  } catch (error) {
    await transaction.rollback();
    console.error('Error al sincronizar', error);
    throw new Error('No se pudo completar la sincronizacion de datos');
  }
};
