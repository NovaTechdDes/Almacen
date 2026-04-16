import { ProductoCarrito } from '@/src/interface';
import { usePedidoStore } from '@/src/store/pedido.store';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface CarritoPedidoItemProps {
  item: ProductoCarrito;
}

const CarritoPedidoItem = ({ item }: CarritoPedidoItemProps) => {
  const { removeItem, addItem, substractItem } = usePedidoStore();

  const handleRemoveItem = () => {
    removeItem(item);
  };

  const handleAddItem = () => {
    addItem(item);
  };

  const handleSubstractItem = () => {
    substractItem(item);
  };

  return (
    <View className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-4 shadow-sm shadow-slate-100 dark:shadow-none">
      <View className="flex-row items-center mb-4">
        {/* Miniatura */}
        <View className="h-12 w-12 bg-slate-50 dark:bg-slate-700 rounded-xl items-center justify-center mr-3">
          {item.imagen_local ? <Image source={{ uri: item.imagen_local }} className="h-12 w-12 rounded-xl" /> : <Ionicons name="cube-outline" size={20} color="#94a3b8" />}
        </View>

        <View className="flex-1">
          <Text className="text-slate-800 dark:text-slate-200 font-bold text-sm" numberOfLines={1}>
            {item.descripcion}
          </Text>

          {/* Selector de Variante / Precio Mayorista */}
          <View className="mt-2"></View>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        {/* Controles de Cantidad */}
        <View className="flex-row items-center bg-slate-50 rounded-full px-3 py-1 border border-slate-100">
          <Pressable
            className="p-1"
            onPress={handleSubstractItem}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            {({ pressed }) => <Ionicons name="remove" size={22} color={pressed ? '#ef4444' : '#64748b'} className={pressed ? 'bg-[#ef4444]/10 rounded-full' : ''} />}
          </Pressable>
          <Text className="mx-4 font-bold text-slate-700">{item.cantidad}</Text>
          <Pressable
            className="p-1"
            onPress={handleAddItem}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            {({ pressed }) => <Ionicons name="add" size={22} color={pressed ? '#22c55e' : '#64748b'} className={pressed ? 'bg-[#22c55e]/10 rounded-full' : ''} />}
          </Pressable>
        </View>

        <View className="flex-row items-center">
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
            className="mr-4"
            onPress={handleRemoveItem}
          >
            {({ pressed }) => <Ionicons name="trash-outline" size={22} color={pressed ? '#ef4444' : '#ef4444'} className={pressed ? 'bg-[#ef4444]/10 rounded-full' : ''} />}
          </Pressable>
          <Text className="text-blue-600 font-extrabold text-base">
            $
            {(item.precioAux * item.cantidad).toLocaleString('es-AR', {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CarritoPedidoItem;
