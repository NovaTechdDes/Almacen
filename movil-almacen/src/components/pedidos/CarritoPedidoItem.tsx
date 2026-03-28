import { ProductoCarrito } from "@/src/interface";
import { usePedidoStore } from "@/src/store/pedido.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

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
    <View className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm shadow-slate-100">
      <View className="flex-row items-center mb-4">
        {/* Miniatura */}
        <View className="h-12 w-12 bg-slate-50 rounded-xl items-center justify-center mr-3">
          <Ionicons name="cube-outline" size={20} color="#94a3b8" />
        </View>

        <View className="flex-1">
          <Text className="text-slate-800 font-bold text-sm" numberOfLines={1}>
            {item.descripcion}
          </Text>

          {/* Selector de Variante Placeholder */}
          <View className="flex-row items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 mt-1.5">
            <Text className="text-slate-500 text-[10px]">
              Mayorista 2 - ${item.precio.toLocaleString()}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#94a3b8" />
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        {/* Controles de Cantidad */}
        <View className="flex-row items-center bg-slate-50 rounded-full px-3 py-1 border border-slate-100">
          <Pressable className="p-1" onPress={handleSubstractItem}>
            <Ionicons name="remove" size={18} color="#64748b" />
          </Pressable>
          <Text className="mx-4 font-bold text-slate-700">{item.cantidad}</Text>
          <Pressable className="p-1" onPress={handleAddItem}>
            <Ionicons name="add" size={18} color="#64748b" />
          </Pressable>
        </View>

        <View className="flex-row items-center">
          <Pressable className="mr-4" onPress={handleRemoveItem}>
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </Pressable>
          <Text className="text-blue-600 font-extrabold text-base">
            $
            {(item.precio * item.cantidad).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CarritoPedidoItem;
