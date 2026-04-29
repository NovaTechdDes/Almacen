import { getDb } from '../db/db';
import { querysGetPedidos } from '../db/querys';
import { Pedido } from '../interface/Pedido';
import { finDia, inicioDia } from '../utils/fecha';

export const getPedidos = async (fecha: string): Promise<Pedido[]> => {
  const db = await getDb();

  const init = inicioDia();
  const fin = finDia();

  try {
    const resultado = (await db.getAllAsync(`${querysGetPedidos}  WHERE fecha BETWEEN ? AND ? ORDER BY id_pedido DESC`, [init, fin])) as any[];

    return resultado.map((pedido) => ({
      ...pedido,
      cliente: JSON.parse(pedido.cliente || '{}'),
      items: JSON.parse(pedido.items || '[]'),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPedido = async (id: number): Promise<Pedido | null> => {
  const db = await getDb();
  const resultado = (await db.getFirstAsync(`SELECT * FROM pedidos WHERE id_pedido = ?`, [id])) as Pedido | null;
  return resultado;
};

export const startPostPedido = async (pedido: Pedido) => {
  const db = await getDb();

  try {
    await db.execAsync('BEGIN TRANSACTION');
    const res = await db.runAsync(`INSERT INTO pedidos (id_cliente, fecha, importe, estado, observacion) VALUES (?, ?, ?, ?, ?)`, [
      pedido.id_cliente,
      pedido.fecha,
      pedido.importe,
      pedido.estado,
      pedido.observacion || '',
    ]);

    const idPedido = res.lastInsertRowId;

    for (const item of pedido.items || []) {
      await db.runAsync(
        `
        INSERT INTO detalle_pedido 
        (id_pedido, id_producto, cantidad, precio)
        VALUES (?, ?, ?, ?)
        `,
        [idPedido, item.id_producto, item.cantidad, item.precio]
      );
    }

    await db.execAsync('COMMIT');
    return true;
  } catch (error) {
    await db.execAsync('ROLLBACK');
    console.error(error);
    return false;
  }
};

export const startPutPedido = async (pedido: Pedido) => {
  const db = await getDb();
  try {
    if (!pedido.id_pedido) {
      return false;
    }
    await db.runAsync(`UPDATE pedidos SET id_cliente = ?, fecha = ?, importe = ?, estado = ?, observacion = ? WHERE id_pedido = ?`, [
      pedido.id_cliente,
      pedido.fecha,
      pedido.importe,
      pedido.estado,
      pedido.observacion || '',
      pedido.id_pedido,
    ]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const startDeletePedido = async (id: number) => {
  const db = await getDb();
  try {
    await db.runAsync(`DELETE FROM pedidos WHERE id_pedido = ?`, [id]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
