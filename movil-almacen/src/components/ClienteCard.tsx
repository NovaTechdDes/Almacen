import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useMutateCliente } from "../hooks";
import { Cliente } from "../interface";
import { useClienteStore } from "../store/cliente.store";
import { mensaje } from "../utils/mensaje";
import ToastConfirmacion from "./ui/ToastConfirmacion";

interface Props {
  cliente: Cliente;
}

export const ClienteCard: React.FC<Props> = ({ cliente }) => {
  const [showToast, setShowToast] = useState(false);
  const { eliminarCliente } = useMutateCliente();
  const { setClienteSeleccionado, openModalFormulario } = useClienteStore();

  const initials = cliente.denominacion
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleDelete = async () => {
    try {
      const res = await eliminarCliente.mutateAsync(
        cliente.id_cliente.toString(),
      );
      if (res) {
        mensaje(
          "success",
          "Cliente eliminado",
          "El cliente ha sido eliminado correctamente",
        );
      } else {
        mensaje("error", "Error al eliminar", "No se pudo eliminar el cliente");
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      mensaje(
        "error",
        "Error fatal",
        "Ocurrió un error inesperado al eliminar",
      );
    } finally {
      setShowToast(false);
    }
  };

  const handleEdit = () => {
    setClienteSeleccionado(cliente);
    openModalFormulario();
  };

  return (
    <View className="mb-4 overflow-hidden rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900 shadow-black/10 transition-all active:scale-[0.98]">
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
      </View>

      <View className="flex-row items-center gap-2 w-full mt-5">
        <Pressable
          onPress={handleEdit}
          className="flex-1 bg-blue-500 px-2 py-1 rounded-lg"
        >
          <Text className="text-white text-sm text-center">Editar</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowToast(true)}
          className="flex-1 bg-red-500 px-2 py-1 rounded-lg"
        >
          <Text className="text-white text-sm text-center">Eliminar</Text>
        </Pressable>
      </View>

      {showToast && (
        <ToastConfirmacion
          visible={showToast}
          mensaje="¿Estás seguro de eliminar este cliente?"
          onConfirm={handleDelete}
          onCancel={() => setShowToast(false)}
        />
      )}
    </View>
  );
};
