import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getDb } from "../db/db";
import { clienteMapperBackEnd } from "../mappers/cliente.mappers";
import { productoMapper } from "../mappers/producto.mappers";

const getServerUrl = async () => {
  return await AsyncStorage.getItem("@server_url");
};

export const startPostSincronizar = async (): Promise<boolean> => {
  const db = await getDb();
  const url = await getServerUrl();
  try {
    const clientes = await db.getAllAsync(`SELECT * FROM clientes`);

    const clientesMapeados = clientes.map((cliente: any) =>
      clienteMapperBackEnd(cliente),
    );

    // const pedidos = await db.getAllAsync(
    //   `${querysGetPedidos} WHERE estado = 'PENDIENTE'`,
    // );

    const { data } = await axios.post(`http://${url}/sincronizar`, {
      clientes: clientesMapeados,
      // pedidos,
    });

    console.log(data);

    if (data.ok) {
      for (const pedido of data.data.pedidos) {
        await db.runAsync(`UPDATE pedidos SET estado = ? WHERE id_pedido = ?`, [
          pedido.estado,
          pedido.id_pedido,
        ]);
      }

      for (const cliente of data.data.clientes) {
        await db.runAsync(
          `UPDATE clientes SET id_servidor = ? WHERE id_cliente = ?`,
          [cliente.id_servidor, cliente.id_cliente],
        );
      }

      for (const producto of data.data.productos) {
        await db.runAsync(
          `UPDATE productos SET descripcion = ?, codigo = ?, stock = ?, precio = ? WHERE id_producto = ?`,
          [
            producto.descripcion,
            producto.codigo,
            producto.stock,
            producto.precio,
            producto.id_producto,
          ],
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

export const probarConexion = async () => {
  const url = await getServerUrl();
  console.log(`http://${url}/test`);
  try {
    const { data } = await axios.get(`http://${url}/test`, { timeout: 1000 });
    return data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      msg: "Error al probar la conexion",
    };
  }
};

export const startObtenerInformacion = async () => {
  const db = await getDb();
  const url = await getServerUrl();
  try {
    const { data } = await axios.get(`http://${url}/obtener-datos`);

    const productos = data.data.productos.map((producto: any) =>
      productoMapper(producto),
    );

    if (data.data.productos && data.data.productos.length > 0) {
      for (const producto of productos) {
        console.log(producto);
        await db.runAsync(
          `INSERT INTO productos (descripcion, codigo, precio, stock, id_servidor) VALUES (?, ?, ?, ?, ?)`,
          [
            producto.descripcion,
            producto.codigo,
            producto.precio,
            producto.stock,
            producto.id_producto,
          ],
        );
      }
    }

    return data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      msg: "Error al obtener los datos",
    };
  }
};
