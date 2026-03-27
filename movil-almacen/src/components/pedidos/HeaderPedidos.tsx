import React from "react";
import { Text, View } from "react-native";
import Buscador from "./Buscador";

export default function HeaderPedidos() {
  return (
    <View className="bg-white py-10 px-5 flex-row justify-between">
      <View className="mb-5">
        <Text className="text-4xl font-bold">Pedidos</Text>
        <Text className="text-gray-500">12 pedidos registrados</Text>
      </View>

      <Buscador />
    </View>
  );
}
