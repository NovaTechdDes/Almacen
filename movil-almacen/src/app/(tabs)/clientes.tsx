import BuscadorCliente from "@/src/components/clientes/BuscadorCliente";
import ErrorClientes from "@/src/components/clientes/ErrorClientes";
import HeaderCliente from "@/src/components/clientes/HeaderCliente";
import Loading from "@/src/components/ui/Loading";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View
} from "react-native";
import { ClienteCard } from "../../components/ClienteCard";
import { useClientes } from "../../hooks";

export default function ClientesScreen() {
  const { data, isLoading, error } = useClientes();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClientes = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter(
      (cliente) =>
        cliente.denominacion.toLowerCase().includes(lowerQuery) ||
        cliente.dni.toLowerCase().includes(lowerQuery) ||
        cliente.localidad.toLowerCase().includes(lowerQuery),
    );
  }, [data, searchQuery]);

  if (isLoading) {
    return <Loading texto="Cargando clientes..." />;
  }

  if (error) {
    return <ErrorClientes />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 dark:bg-slate-950"
    >
      <View className="flex-1 px-4 pt-4">
        {/* Header Section */}
        <HeaderCliente />

        {/* Search Bar */}
        <BuscadorCliente />

        {/* List of Clients */}
        <FlatList
          data={filteredClientes}
          renderItem={({ item }) => (
            <ClienteCard
              cliente={item}
              onPress={() =>
                console.log("Cliente seleccionado:", item.id_cliente)
              }
            />
          )}
          keyExtractor={(item) => item.id_cliente.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="mt-12 items-center justify-center">
              <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                <Ionicons name="people-outline" size={40} color="#94a3b8" />
              </View>
              <Text className="text-lg font-semibold text-slate-900 dark:text-white">
                {searchQuery ? "Sin resultados" : "No hay clientes"}
              </Text>
              <Text className="mt-1 text-slate-500 dark:text-slate-400">
                {searchQuery
                  ? "Prueba con otros términos de búsqueda"
                  : "Los clientes aparecerán aquí una vez importados"}
              </Text>
            </View>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}
