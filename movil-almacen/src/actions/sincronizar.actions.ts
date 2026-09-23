import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getDb } from '../db/db';
import { querysGetPedidos } from '../db/querys';
import { clienteMapper, clienteMapperBackEnd } from '../mappers/cliente.mappers';
import { pedidoMapperBackEnd } from '../mappers/pedido.mappers';
import { productoMapper } from '../mappers/producto.mappers';
import { rubroMapper } from '../mappers/rubros.mappers';
import { actualizarClientes } from '../utils/actualizarClientes';
import { actualizarProductos } from '../utils/actualizarProductos';
import { actualizarRubros } from '../utils/actualizarRubros';
import { descargarImagenesEnSegundoPlano } from '../utils/descargarImagenes';

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

    const { data } = await axios.post(`http://${url}/sincronizar`, {
      clientes: clientesMapeados,
      pedidos: pedidosMapeados,
    });

    if (data.ok) {
      // 1. Actualización rápida de estados en SQLite dentro de UNA sola transacción
      await db.withTransactionAsync(async () => {
        for (const pedido of data.data.pedidos) {
          await db.runAsync(`UPDATE pedidos SET estado = 'SINCRONIZADO' WHERE id_pedido = ?`, pedido.num_pedido);
        }
      });

      // 2. Mapeamos productos y rubros recibidos
      const productos = data.data.productos.map((p: any) => productoMapper(p, url));
      const rubros = data.data.rubros.map((r: any) => rubroMapper(r));
      const clientes = data.data.clientes ? data.data.clientes.map((c: any) => clienteMapper(c)) : [];

      // 3. Guardamos clientes, productos y rubros en sql
      if (clientes.length > 0) await actualizarClientes(clientes);
      if (productos.length > 0) await actualizarProductos(productos);
      if (rubros.length > 0) await actualizarRubros(rubros);

      // 4. Lanzamos la descarga de imágenes en SEGUNDO PLANO (sin await)
      descargarImagenesEnSegundoPlano(productos);

      // 5. Devolvemos éxito de inmediato para liberar la pantalla
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

    const rubros = data.data.rubros.map((rubro: any) => rubroMapper(rubro));
    const productos = data.data.productos.map((producto: any) => productoMapper(producto, url));
    const clientes = data.data.clientes ? data.data.clientes.map((c: any) => clienteMapper(c)) : [];

    // 1. Guardamos productos y rubros en SQLite al instante

    if (clientes && clientes.length > 0) {
      await actualizarClientes(clientes);
    }

    if (productos && productos.length > 0) {
      await actualizarProductos(productos);
    }

    if (rubros && rubros.length > 0) {
      await actualizarRubros(rubros);
    }

    // 2. Disparamos la descarga en SEGUNDO PLANO sin congelar la app
    if (productos && productos.length > 0) {
      descargarImagenesEnSegundoPlano(productos);
    }

    // 3. Devolvemos inmediatamente
    return data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      msg: 'Error al obtener los datos',
    };
  }
};
