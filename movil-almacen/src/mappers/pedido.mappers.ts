import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedido } from '../interface';

export const pedidoMapperBackEnd = async (pedido: Pedido) => {
  const user = await AsyncStorage.getItem('@user');
  const vendedor = user ? JSON.parse(user).codigo : '';

  return {
    num_pedido: pedido.id_pedido,
    fecha_pedido: pedido.fecha,
    id_cliente: pedido.id_cliente,
    vendedor: `${vendedor}`,
    facturado: false,

    items: pedido.items,
  };
};
