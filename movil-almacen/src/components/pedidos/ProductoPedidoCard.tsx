import { ProductoCarrito } from "@/src/interface";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  item: ProductoCarrito;
}

export default function ProductoPedidoCard({ item }: Props) {
  return (
    <View className="flex-row items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg max-w-full">
      <Text className="text-sm font-bold text-blue-600 dark:text-blue-300">{item.cantidad}x</Text>
      <Text numberOfLines={1} className="text-sm text-slate-700 dark:text-slate-200 flex-shrink">
        {item.descripcion ?? item.producto?.descripcion}
      </Text>
    </View>
  );
}
