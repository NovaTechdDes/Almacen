import React from "react";
import { Text, View } from "react-native";

export default function HeaderCliente() {
  return (
    <View className="mb-6 px-1">
      <Text className="text-3xl font-bold text-slate-900 dark:text-white">
        Clientes
      </Text>
      <Text className="text-slate-500 dark:text-slate-400">
        Gestiona tu cartera de clientes
      </Text>
    </View>
  );
}
