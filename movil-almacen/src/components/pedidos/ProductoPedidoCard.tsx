import { ProductoCarrito } from "@/src/interface";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  item: ProductoCarrito;
}

export default function ProductoPedidoCard({ item }: Props) {
  return (
    <View className="flex-row gap-5 bg-gray-200 p-2 rounded-lg">
      <Text className="text-lg font-bold">
        {item.cantidad}x {item.producto?.descripcion}
      </Text>
    </View>
  );
}
