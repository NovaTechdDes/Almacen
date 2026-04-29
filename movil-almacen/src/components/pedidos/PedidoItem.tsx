import { Producto } from '@/src/interface';
import { usePedidoStore } from '@/src/store/pedido.store';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import ToastNumber from '../ui/ToastNumber';

interface Props {
  producto: Producto;
}

export default function PedidoItem({ producto }: Props) {
  const { addItem } = usePedidoStore();
  const [cantidad, setCantidad] = useState('1');
  const [show, setShow] = useState(false);

  const handleAddItemCarrito = () => {
    addItem(producto);
  };

  const handleLongPress = () => {
    setShow(true);
  };

  const handleConfirm = () => {
    addItem(producto, Number(cantidad));
    setShow(false);
  };

  return (
    <Pressable
      onPress={handleAddItemCarrito}
      onLongPress={handleLongPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
      className="flex-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-4 flex-row items-center shadow-sm shadow-slate-200 dark:shadow-none"
    >
      {({ pressed }) => (
        <>
          {/* Miniatura de Producto */}
          <View className="h-20 w-20 bg-slate-50 dark:bg-slate-700 rounded-2xl items-center justify-center mr-4">
            {producto.imagen_local ? <Image source={{ uri: producto.imagen_local }} className="h-20 w-20 rounded-2xl" /> : <Ionicons name="cube-outline" size={32} color="#94a3b8" />}
          </View>

          <View className="flex-1">
            <Text numberOfLines={1} className="text-slate-800 dark:text-slate-200 font-bold text-sm mb-1">
              {producto.descripcion}
            </Text>
            <Text className="text-slate-400 text-[10px] mb-2">Marca Genérica</Text>
            <Text className="text-blue-600 dark:text-blue-400 font-extrabold text-base">
              $
              {producto.precio.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View className={`ml-2 p-2 rounded-full ${pressed ? 'bg-slate-200 dark:bg-slate-600' : 'bg-slate-50 dark:bg-slate-700'}`}>
            <Ionicons name="add" size={24} color="#64748b" />
          </View>
          <ToastNumber
            visible={show}
            cantidad={cantidad}
            setCantidad={setCantidad}
            onConfirm={handleConfirm}
            onCancel={() => {
              setShow(false);
            }}
          />
        </>
      )}
    </Pressable>
  );
}
