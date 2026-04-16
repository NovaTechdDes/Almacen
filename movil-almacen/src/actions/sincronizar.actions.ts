import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getDb } from '../db/db';
import { querysGetPedidos } from '../db/querys';
import { clienteMapperBackEnd } from '../mappers/cliente.mappers';
import { pedidoMapperBackEnd } from '../mappers/pedido.mappers';
import { productoMapper } from '../mappers/producto.mappers';
import { actualizarProductos } from '../utils/actualizarProductos';
import { descargarImagenes } from '../utils/descargarImagenes';

const getServerUrl = async () => {
  return await AsyncStorage.getItem('@server_url');
};

export const startPostSincronizar = async (): Promise<boolean> => {
  const db = await getDb();
  const url = await getServerUrl();
  try {
    const clientes = await db.getAllAsync(`SELECT * FROM clientes`);

    const clientesMapeados = clientes.map((cliente: any) => clienteMapperBackEnd(cliente));

    const pedidos = await db.getAllAsync(`${querysGetPedidos} WHERE estado = 'PENDIENTE'`);
    const pedidosMapeados = await Promise.all(pedidos.map((pedido: any) => pedidoMapperBackEnd(pedido)));

    console.log(pedidosMapeados);

    const { data } = await axios.post(`http://${url}/sincronizar`, {
      clientes: clientesMapeados,
      pedidos: pedidosMapeados,
    });

    if (data.ok) {
      // Actualizamos los estados de los pedidos que fueron procesados por el servidor
      for (const pedido of data.data.pedidos) {
        await db.runAsync(`UPDATE pedidos SET estado = 'SINCRONIZADO' WHERE id_pedido = ?`, pedido.num_pedido);
      }

      // Sincronizamos los IDs de clientes (vincular cliente local con ID del servidor)
      for (const cliente of data.data.clientes) {
        await db.runAsync(`UPDATE clientes SET id_servidor = ? WHERE id_cliente = ?`, [cliente.id_servidor, cliente.id_cliente]);
      }

      // Sincronizamos el catálogo completo de productos y sus precios mayoristas
      // La función actualizarProductos ya maneja transacciones y lógica de UPSERT (Insert o Update)
      const productos = data.data.productos.map((p: any) => productoMapper(p));
      await actualizarProductos(productos);

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al sincronizar', error);
    return false;
  }
};

export const probarConexion = async () => {
  const url = await getServerUrl();
  try {
    const { data } = await axios.get(`http://${url}/test`, { timeout: 1000 });
    return data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      msg: 'Error al probar la conexion',
    };
  }
};

export const startObtenerInformacion = async () => {
  const url = await getServerUrl();

  try {
    const { data } = await axios.get(`http://${url}/obtener-datos`);

    const productos = data.data.productos.map((producto: any) => productoMapper(producto));

    if (data.data.productos && data.data.productos.length > 0) {
      const rutas = await descargarImagenes(productos);

      await actualizarProductos(productos, rutas);
    }

    return data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      msg: 'Error al obtener los datos',
    };
  }
};
