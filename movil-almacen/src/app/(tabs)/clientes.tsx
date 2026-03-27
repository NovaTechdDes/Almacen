import BuscadorCliente from "@/src/components/clientes/BuscadorCliente";
import ErrorClientes from "@/src/components/clientes/ErrorClientes";
import FormularioCliente from "@/src/components/clientes/FormularioCliente";
import HeaderCliente from "@/src/components/clientes/HeaderCliente";
import ListaVacia from "@/src/components/clientes/ListaVacia";
import Loading from "@/src/components/ui/Loading";
import React, { useMemo } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClienteCard } from "../../components/ClienteCard";
import { useClientes } from "../../hooks";
import { useClienteStore } from "../../store/cliente.store";

export default function ClientesScreen() {
  const { data, isLoading, error } = useClientes();
  const { buscador, modalFormulario } = useClienteStore();
  const { width } = useWindowDimensions();

  // Calcular columnas basado en el ancho (Tabet/Phone)
  const numColumns = useMemo(() => {
    if (width > 800) return 3;
    if (width > 600) return 2;
    return 1;
  }, [width]);

  const filteredClientes = useMemo(() => {
    if (!data) return [];
    if (!buscador) return data;
    const lowerQuery = buscador.toLowerCase();
    return data.filter(
      (cliente) =>
        cliente?.denominacion?.toLowerCase().includes(lowerQuery) ||
        cliente?.dni?.toLowerCase().includes(lowerQuery) ||
        cliente?.localidad?.toLowerCase().includes(lowerQuery),
    );
  }, [data, buscador]);

  if (isLoading) {
    return <Loading texto="Cargando clientes..." />;
  }

  if (error) {
    return <ErrorClientes />;
  }

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50 dark:bg-slate-950"
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 w-full"
      >
        <View className="flex-1 w-full px-4 pt-4">
          {/* Header Section */}
          <HeaderCliente />

          {/* Search Bar */}
          <BuscadorCliente />

          {/* List of Clients */}
          <FlatList
            key={numColumns} // Forzar re-renderizado si cambian las columnas
            numColumns={numColumns}
            data={filteredClientes}
            columnWrapperStyle={numColumns > 1 ? { gap: 16 } : null}
            renderItem={({ item }) => (
              <View
                style={
                  numColumns > 1 ? { flex: 1 / numColumns } : { width: "100%" }
                }
              >
                <ClienteCard cliente={item} />
              </View>
            )}
            keyExtractor={(item) => item.id_cliente.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<ListaVacia />}
          />

          {modalFormulario && <FormularioCliente />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
