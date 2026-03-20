import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Cliente } from "../interface";

interface Props {
  cliente: Cliente;
  onPress?: () => void;
}

export const ClienteCard: React.FC<Props> = ({ cliente, onPress }) => {
  const initials = cliente.denominacion
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mb-4 overflow-hidden rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900 shadow-black/10 transition-all active:scale-[0.98]"
    >
      <View className="flex-row items-center">
        {/* Avatar Section */}
        <View className="mr-5 h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10">
          <Text className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {initials}
          </Text>
        </View>

        {/* Info Section */}
        <View className="flex-1">
          <View className="mb-1 flex-row items-center justify-between">
            <Text
              className="flex-1 text-lg font-bold text-slate-900 dark:text-white"
              numberOfLines={1}
            >
              {cliente.denominacion}
            </Text>
            {cliente.localidad && (
              <View className="ml-2 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {cliente.localidad}
                </Text>
              </View>
            )}
          </View>

          <View className="space-y-2 mt-1">
            {cliente.dni && (
              <View className="flex-row items-center">
                <Ionicons name="card-outline" size={14} color="#64748b" />
                <Text className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                  DNI: {cliente.dni}
                </Text>
              </View>
            )}

            {cliente.telefono && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="call-outline" size={14} color="#64748b" />
                <Text className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                  {cliente.telefono}
                </Text>
              </View>
            )}

            {cliente.direccion && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="location-outline" size={14} color="#64748b" />
                <Text
                  className="ml-2 text-sm text-slate-500 dark:text-slate-400"
                  numberOfLines={1}
                >
                  {cliente.direccion}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Indicator */}
        <View className="ml-4 h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
