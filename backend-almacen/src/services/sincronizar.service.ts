import { pool } from '../config/db';
import { Cliente, ClienteMovil } from '../types/Cliente';
import { PedidoMovil } from '../types/Pedido';
import { Rubros } from '../types/Rubros';
import { cargarClientes, cargarPedidos, obtenerClientes } from './';
import { obtenerProductos } from './producto.service';
import { obtnenerRubros } from './rubro.service';

export const sincronizar = async (data: any) => {
  const { clientes, pedidos } = data;

  let clientesSincronizados: ClienteMovil[] | Cliente[] = [];
  let pedidosSincronizados: PedidoMovil[] = [];
  let rubrosSincronizados: Rubros[] = [];

  const transaction = await pool.transaction();

  try {
    await transaction.begin();
    if (pedidos && pedidos.length > 0) {
      pedidosSincronizados = await cargarPedidos(transaction, pedidos, clientes);
    }
    const rubros = await obtnenerRubros();
    const productos = await obtenerProductos();

    await transaction.commit();
    return { clientes: clientesSincronizados, pedidos: pedidosSincronizados, productos, rubros };
  } catch (error) {
    await transaction.rollback();
    console.error('Error al sincronizar', error);
    throw new Error('No se pudo completar la sincronizacion de datos');
  }
};
