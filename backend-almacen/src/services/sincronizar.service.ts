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
  let transaccionCompletada = false;

  const transaction = await pool.transaction();

  try {
    await transaction.begin();

    // 1. Sincronizamos clientes nuevos si los hay
    if(clientes && clientes.length > 0){
      clientesSincronizados = await cargarClientes(transaction, clientes);
    };

    // 2. Insertamos pedidos pendientes
    if (pedidos && pedidos.length > 0) {
      pedidosSincronizados = await cargarPedidos(transaction, pedidos, clientesSincronizados.length > 0 ? clientesSincronizados : clientes);
    };

    // 3. Confirmamos las escrituras inmediatamente para liberar bloqueos en la base de datos
    await transaction.commit();
    transaccionCompletada = true;
    
    
    const [rubros, productos, todosLosClientes] = await Promise.all([
      obtnenerRubros(),
      obtenerProductos(),
      obtenerClientes()
    ]);

    return { clientes: todosLosClientes, pedidos: pedidosSincronizados, rubros, productos };
  } catch (error) {
    if(!transaccionCompletada){
      await transaction.rollback();
    }
    console.error('Error al sincronizar', error);
    throw new Error('No se pudo completar la sincronizacion de datos');
  }
};
