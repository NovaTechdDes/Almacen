import { useMutatePedidos } from '@/src/hooks/pedidos/useMutatePedido';
import { usePedidoStore } from '@/src/store/pedido.store';
import { useProductoStore } from '@/src/store/producto.store';
import { mensaje } from '@/src/utils/mensaje';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  compact?: boolean;
  inline?: boolean; // total y botones en una sola fila (barra inferior)
}

export default function TotalPedido({ compact = false, inline = false }: Props) {
  const { clearPedido, total, items, cliente } = usePedidoStore();
  const { setBuscador } = useProductoStore();
  const { postPedidoMutation } = useMutatePedidos();
  const [error, setError] = useState<boolean>(false);

  const handleCreatePedido = async () => {
    if (!cliente) return setError(true);
    if (items.length === 0) return setError(true);

    const pedido = {
      importe: total,
      items,
      id_cliente: Number(cliente?.id_cliente),
      fecha: new Date().toISOString(),
      estado: 'PENDIENTE',
    };

    const res = await postPedidoMutation.mutateAsync(pedido);

    if (res) {
      mensaje('success', 'Pedido creado exitosamente');
      clearPedido();
    } else {
      mensaje('error', 'Error al crear el pedido');
    }
  };

  const onCancel = () => {
    clearPedido();
    setBuscador('');
  };

  const totalText = `$${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
  const py = compact ? 'py-3' : 'py-4';

  const errores = (
    <>
      {error && !cliente && <Text className="text-red-500 font-bold mb-2">Debe seleccionar un cliente</Text>}
      {error && items.length === 0 && <Text className="text-red-500 font-bold mb-2">El pedido debe tener items</Text>}
    </>
  );

  const cancelar = (
    <Pressable
      onPress={onCancel}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
      className={`${inline ? 'px-4' : 'flex-1'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${py} rounded-xl items-center`}
    >
      {({ pressed }) => <Text className={`font-bold ${pressed ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>Cancelar</Text>}
    </Pressable>
  );

  const crear = (
    <Pressable
      disabled={postPedidoMutation.isPending}
      onPress={handleCreatePedido}
      className={`${inline ? 'px-5' : 'flex-[1.5]'} bg-blue-500 ${py} rounded-xl items-center shadow-md shadow-blue-200 ${postPedidoMutation.isPending ? 'opacity-60' : ''}`}
    >
      <Text className={`text-white font-bold ${compact ? 'text-base' : 'text-lg'}`}>{postPedidoMutation.isPending ? 'Creando...' : 'Crear Pedido'}</Text>
    </Pressable>
  );

  if (inline) {
    return (
      <View>
        {errores}
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-xs text-slate-500 dark:text-slate-400">Total</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
              {totalText}
            </Text>
          </View>
          {cancelar}
          {crear}
        </View>
      </View>
    );
  }

  return (
    <View>
      <View className={`flex-row justify-between items-center ${compact ? 'mb-2' : 'mb-6'}`}>
        <Text className={`${compact ? 'text-base' : 'text-xl'} font-bold text-slate-800 dark:text-slate-200`}>Total</Text>
        <Text numberOfLines={1} adjustsFontSizeToFit className={`${compact ? 'text-2xl' : 'text-3xl'} font-extrabold text-blue-600 dark:text-blue-400`}>
          {totalText}
        </Text>
      </View>
      {errores}
      <View className={`flex-row ${compact ? 'gap-2' : 'gap-4'}`}>
        {cancelar}
        {crear}
      </View>
    </View>
  );
}
