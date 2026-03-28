import { usePedidoStore } from "@/src/store/pedido.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";
import CarritoPedidoItem from "./CarritoPedidoItem";

export default function CarritoPedido() {
  const { items } = usePedidoStore();

  return (
    <View className="flex-1">
      <View className="flex-row items-center mb-6">
        <Ionicons name="cart-outline" size={24} color="#334155" />
        <Text className="text-xl font-bold text-slate-700 ml-2">
          Carrito ({items.length})
        </Text>
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

