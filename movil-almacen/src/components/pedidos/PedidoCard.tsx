import { useMutatePedidos } from '@/src/hooks/pedidos/useMutatePedido';
import { Pedido } from '@/src/interface';
import { fechaHora } from '@/src/utils/fecha';
import { mensaje } from '@/src/utils/mensaje';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ToastConfirmacion from '../ui/ToastConfirmacion';
import ProductoPedidoCard from './ProductoPedidoCard';

interface Props {
  item: Pedido;
}

export default function PedidoCard({ item }: Props) {
  const { deletePedidoMutation } = useMutatePedidos();
  const [showToast, setShowToast] = useState(false);
  const [view, setView] = useState(false);

  const handleDelete = async () => {
    if (!item.id_pedido) return;

    const res = await deletePedidoMutation.mutateAsync(item.id_pedido);

    if (res) {
      setShowToast(false);
      mensaje('success', 'Pedido eliminado correctamente');
    } else {
      mensaje('error', 'Error al eliminar el pedido');
    }
  };

  const handleView = () => {
    setView(!view);
  };

  return (
    <Pressable onPress={handleView} className={`${view ? 'border-blue-500 border-2' : 'border-gray-400 dark:border-slate-700'} bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm mb-4 border`}>
      <View className="flex-row gap-5">
        {/* Logo / Icono de pedido */}
        <View className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-sm">
          <Ionicons name="receipt-outline" size={24} color="#2563eb" />
        </View>

        <View>
          {/* Numero de pedido y estado */}
          <View className="flex-row gap-2">
            <Text className="text-lg font-bold dark:text-white">Pedido: {item?.id_pedido?.toString().padStart(4, '0')}</Text>
            {item?.estado === 'PENDIENTE' ? (
              <View className="flex-row items-center gap-2 text-sm bg-orange-300/20 px-2 py-1 rounded-full">
                <Ionicons name="time-outline" size={16} color="#ea580c" />
                <Text className=" text-orange-600">{item?.estado}</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-2 text-sm bg-green-300/20 px-2 py-1 rounded-full">
                <Ionicons name="checkmark-outline" size={16} color="#16a34a" />
                <Text className=" text-green-600">{item?.estado}</Text>
              </View>
            )}
          </View>

          {/* Cliente y fecha */}
          <View className="flex-row gap-5 mt-2">
            <View className="flex-row items-center gap-2 text-sm  px-2 py-1 rounded-full">
              <Ionicons name="person-outline" size={16} color="gray" />
              <Text className="text-gray-500">{item?.cliente?.denominacion}</Text>
            </View>
            <View className="flex-row items-center gap-2 text-sm  px-2 py-1 rounded-full">
              <Ionicons name="calendar-outline" size={16} color="gray" />
              <Text className="text-gray-500">{fechaHora(item?.fecha)}</Text>
            </View>
          </View>
        </View>

        {/* Total */}
        <View className="ml-auto flex-row items-center gap-2">
          <View className="gap-2 text-sm  px-2 py-1 rounded-full">
            <Text className="text-lg font-bold dark:text-slate-300">Total</Text>
            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">${item?.importe.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
          </View>

          {item.estado === 'PENDIENTE' && (
            <Pressable onPress={() => setShowToast(true)} className="ml-auto">
              <Ionicons name="trash-outline" size={24} color="red" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Productos */}
      <View className="border-t border-gray-500 dark:border-slate-700 mt-5 pt-5">
        <View>
          <Text className="text-xl text-gray-500 dark:text-slate-400">{item?.items?.length || 0} Productos</Text>
        </View>

        <View className="mt-5 flex-row flex-wrap gap-2">
          {view
            ? item?.items?.map((producto, index) => <ProductoPedidoCard key={`${producto.id_producto}-${index}`} item={producto} />)
            : item?.items?.slice(0, 3).map((producto, index) => <ProductoPedidoCard key={`${producto.id_producto}-${index}`} item={producto} />)}
        </View>
      </View>

      {showToast && <ToastConfirmacion visible={showToast} mensaje="¿Estás seguro de eliminar este Pedido?" onConfirm={handleDelete} onCancel={() => setShowToast(false)} />}
    </Pressable>
  );
}
