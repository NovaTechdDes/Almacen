import { getDb } from "../db/db";
import { Pedido } from "../interface/Pedido";

export const getPedidos = async (fecha: string): Promise<Pedido[]> => {
  const db = await getDb();
  try {
    const resultado = (await db.getAllAsync(
      `SELECT * FROM pedidos WHERE fecha = ?`,
      [fecha],
    )) as Pedido[];
    return resultado;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPedido = async (id: number): Promise<Pedido | null> => {
  const db = await getDb();
  const resultado = (await db.getFirstAsync(
    `SELECT * FROM pedidos WHERE id_pedido = ?`,
    [id],
  )) as Pedido | null;
  return resultado;
};

export const startPostPedido = async (pedido: Pedido) => {
  const db = await getDb();
  try {
    await db.runAsync(
      `INSERT INTO pedidos (numero, id_cliente, fecha, importe, estado, observacion) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        pedido.numero,
        pedido.id_cliente,
        pedido.fecha,
        pedido.importe,
        pedido.estado,
        pedido.observacion,
      ],
    );
    return true;
  } catch (error) {
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
    await db.runAsync(
      `UPDATE pedidos SET numero = ?, id_cliente = ?, fecha = ?, importe = ?, estado = ?, observacion = ? WHERE id_pedido = ?`,
      [
        pedido.numero,
        pedido.id_cliente,
        pedido.fecha,
        pedido.importe,
        pedido.estado,
        pedido.observacion,
        pedido.id_pedido,
      ],
    );
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
