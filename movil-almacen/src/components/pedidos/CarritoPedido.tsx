import { usePedidoStore } from "@/src/store/pedido.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";
import CarritoPedidoItem from "./CarritoPedidoItem";

export default function CarritoPedido() {
  const { items } = usePedidoStore();

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <Ionicons name="cart-outline" size={24} color="#334155" />
          <Text className="text-xl font-bold text-slate-700 dark:text-slate-200 ml-2">
            Carrito ({items.length})
          </Text>
        </View>
        <Ionicons name="cart" size={28} color="#205f8a" />
      </View>
      
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <CarritoPedidoItem item={item} />
        )}

        keyExtractor={(item) => item.id_producto.toString()}
        contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

