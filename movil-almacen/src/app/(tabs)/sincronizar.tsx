import Actualizar from "@/src/components/servidor/Actualizar";
import Servidor from "@/src/components/servidor/Servidor";
import SincronizarDatos from "@/src/components/servidor/SincronizarDatos";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Sincronizar = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-10 pb-6">
          <Text className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Panel de Control
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
            Configuración y Sincronización de Terminal
          </Text>
        </View>

        <View className="space-y-6">
          <View>
            <Text className="px-6 mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Conectividad y Acceso
            </Text>

            <Servidor />
          </View>

          <View className="mt-4">
            <Text className="px-6 mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Operaciones de Datos
            </Text>
            <SincronizarDatos />
          </View>

          <View className="mt-4">
            <Text className="px-6 mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Mantenimiento
            </Text>
            <Actualizar />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sincronizar;
