import { Producto } from "@/src/interface";
import { usePedidoStore } from "@/src/store/pedido.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  producto: Producto;
}

export default function PedidoItem({ producto }: Props) {
  const { addItem } = usePedidoStore();

  const handleAddItemCarrito = () => {
    addItem(producto);
  };

  return (
    <Pressable 
      onPress={handleAddItemCarrito}
      className="flex-1 bg-white border border-slate-100 rounded-3xl p-4 flex-row items-center shadow-sm shadow-slate-200"
    >
      {/* Miniatura de Producto */}
      <View className="h-20 w-20 bg-slate-50 rounded-2xl items-center justify-center mr-4">
        <Ionicons name="cube-outline" size={32} color="#94a3b8" />
      </View>

      <View className="flex-1">
        <Text numberOfLines={1} className="text-slate-800 font-bold text-sm mb-1">
          {producto.descripcion}
        </Text>
        <Text className="text-slate-400 text-[10px] mb-2">Marca Genérica</Text>
        <Text className="text-blue-600 font-extrabold text-base">
          ${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View className="ml-2">
        <Ionicons name="add" size={28} color="#64748b" />
      </View>
    </Pressable>
  );
}

