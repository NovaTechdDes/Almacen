import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Loading({ texto }: { texto: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-slate-950">
      <ActivityIndicator size="large" color="#6366f1" />
      <Text className="mt-4 text-slate-500 dark:text-slate-400">{texto}</Text>
    </View>
  );
}
