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

const MAX_VISIBLES = 3;

export default function PedidoCard({ item }: Props) {
  const { deletePedidoMutation } = useMutatePedidos();
  const [showToast, setShowToast] = useState(false);
  const [view, setView] = useState(false);

  const pendiente = item?.estado === 'PENDIENTE';
  const items = item?.items ?? [];
  const ocultos = Math.max(items.length - MAX_VISIBLES, 0);
  const visibles = view ? items : items.slice(0, MAX_VISIBLES);

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

  return (
    <Pressable
      onPress={() => setView(!view)}
      className={`${view ? 'border-blue-500' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm shadow-slate-200 dark:shadow-none border`}
    >
      {/* Cabecera: icono, número, estado y acciones */}
      <View className="flex-row items-center gap-3">
        <View className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 items-center justify-center border border-blue-100 dark:border-blue-900/50">
          <Ionicons name="receipt-outline" size={22} color="#2563eb" />
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-900 dark:text-white">Pedido #{item?.id_pedido?.toString().padStart(4, '0')}</Text>
          <View className={`self-start flex-row items-center gap-1 px-2 py-0.5 rounded-full mt-1 ${pendiente ? 'bg-orange-300/20' : 'bg-green-300/20'}`}>
            <Ionicons name={pendiente ? 'time-outline' : 'checkmark-outline'} size={14} color={pendiente ? '#ea580c' : '#16a34a'} />
            <Text className={`text-xs font-semibold ${pendiente ? 'text-orange-600' : 'text-green-600'}`}>{item?.estado}</Text>
          </View>
        </View>

        {pendiente && (
          <Pressable onPress={() => setShowToast(true)} hitSlop={8} className="p-2 rounded-full bg-red-50 dark:bg-red-950/30">
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </Pressable>
        )}
      </View>

      {/* Cliente y fecha */}
      <View className="mt-3 gap-1">
        <View className="flex-row items-center gap-2">
          <Ionicons name="person-outline" size={16} color="#94a3b8" />
          <Text numberOfLines={1} className="flex-1 text-slate-600 dark:text-slate-300">
            {item?.cliente?.denominacion}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={16} color="#94a3b8" />
          <Text className="text-slate-500 dark:text-slate-400 text-sm">{fechaHora(item?.fecha)}</Text>
        </View>
      </View>

      {/* Productos */}
      <View className="border-t border-slate-100 dark:border-slate-700 mt-3 pt-3">
        <View className="flex-row flex-wrap gap-2">
          {visibles.map((producto, index) => (
            <ProductoPedidoCard key={`${producto.id_producto}-${index}`} item={producto} />
          ))}
          {!view && ocultos > 0 && (
            <View className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40">
              <Text className="text-sm font-semibold text-blue-600 dark:text-blue-300">+{ocultos} más</Text>
            </View>
          )}
        </View>
      </View>

      {/* Pie: cantidad de productos y total */}
      <View className="flex-row items-end justify-between mt-3">
        <Text className="text-slate-500 dark:text-slate-400">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </Text>
        <View className="items-end">
          <Text className="text-xs text-slate-500 dark:text-slate-400">Total</Text>
          <Text className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">${(item?.importe ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>

      {showToast && <ToastConfirmacion visible={showToast} mensaje="¿Estás seguro de eliminar este Pedido?" onConfirm={handleDelete} onCancel={() => setShowToast(false)} />}
    </Pressable>
  );
}
