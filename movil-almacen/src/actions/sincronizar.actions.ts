import axios from "axios";
import { getDb } from "../db/db";
import { querysGetPedidos } from "../db/querys";

const API_URL = "http://192.168.0.138:4000/sincronizar";

export const startPostSincronizar = async (): Promise<boolean> => {
  const db = await getDb();
  try {
    const clientes = await db.getAllAsync(
      `SELECT * FROM clientes WHERE id_movil IS NULL`,
    );

    const pedidos = await db.getAllAsync(
      `${querysGetPedidos} WHERE estado = 'PENDIENTE'`,
    );

    const { data } = await axios.post(API_URL, {
      clientes,
      pedidos,
    });

    if (data.ok) {
      for (const pedido of data.data.pedidos) {
        await db.runAsync(`UPDATE pedidos SET estado = ? WHERE id_pedido = ?`, [
          pedido.estado,
          pedido.id_pedido,
        ]);
      }

      for (const cliente of data.data.clientes) {
        await db.runAsync(
          `UPDATE clientes SET id_movil = ? WHERE id_cliente = ?`,
          [cliente.id_movil, cliente.id_cliente],
        );
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al sincronizar", error);
    return false;
  }
};
