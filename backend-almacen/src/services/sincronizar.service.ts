import { pool } from '../config/db';
import { Cliente, ClienteMovil } from '../types/Cliente';
import { PedidoMovil } from '../types/Pedido';
import { cargarClientes, cargarPedidos, obtenerClientes } from './';
import { obtenerProductos } from './producto.service';

export const sincronizar = async (data: any) => {
  const { clientes, pedidos } = data;

  let clientesSincronizados: ClienteMovil[] | Cliente[] = [];
  let pedidosSincronizados: PedidoMovil[] = [];

  const transaction = await pool.transaction();

  try {
    await transaction.begin();
    if (pedidos && pedidos.length > 0) {
      pedidosSincronizados = await cargarPedidos(transaction, pedidos, clientes);
    }

    const productos = await obtenerProductos();

    await transaction.commit();
    return { clientes: clientesSincronizados, pedidos: pedidosSincronizados, productos };
  } catch (error) {
    await transaction.rollback();
    console.error('Error al sincronizar', error);
    throw new Error('No se pudo completar la sincronizacion de datos');
  }
};
