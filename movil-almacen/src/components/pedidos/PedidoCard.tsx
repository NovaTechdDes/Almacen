import { useMutatePedidos } from "@/src/hooks/pedidos/useMutatePedido";
import { Pedido } from "@/src/interface";
import { fechaHora } from "@/src/utils/fecha";
import { mensaje } from "@/src/utils/mensaje";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import ToastConfirmacion from "../ui/ToastConfirmacion";
import ProductoPedidoCard from "./ProductoPedidoCard";

interface Props {
  item: Pedido;
}

export default function PedidoCard({ item }: Props) {
  const { deletePedidoMutation } = useMutatePedidos();
  const [showToast, setShowToast] = useState(false);

  const handleDelete = async () => {
    if (!item.id_pedido) return;

    const res = await deletePedidoMutation.mutateAsync(item.id_pedido);

    if (res) {
      setShowToast(false);
      mensaje("success", "Pedido eliminado correctamente");
    } else {
      mensaje("error", "Error al eliminar el pedido");
    }
  };

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-400">
      <View className="flex-row gap-5">
        {/* Logo */}
        <View className="rounded-full bg-[#7cc1f0] p-2">
          <Ionicons name="cart-outline" size={24} color="#205f8a" />
        </View>

        <View>
          {/* Numero de pedido y estado */}
          <View className="flex-row gap-2">
            <Text className="text-lg font-bold">
              Pedido: {item?.id_pedido?.toString().padStart(4, "0")}
            </Text>
            {item?.estado === "PENDIENTE" ? (
              <View className="flex-row items-center gap-2 text-sm bg-orange-300/20 px-2 py-1 rounded-full">
                <Ionicons name="time-outline" size={16} color="#ea580c" />
                <Text className=" text-orange-600">{item?.estado}</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-2 text-sm bg-green-300/20 px-2 py-1 rounded-full">
                <Ionicons name="checkmark-outline" size={16} color="#16a34a" />
                <Text className=" text-green-600">{item?.estado}</Text>
              </View>
            )}
          </View>

          {/* Cliente y fecha */}
          <View className="flex-row gap-5 mt-2">
            <View className="flex-row items-center gap-2 text-sm  px-2 py-1 rounded-full">
              <Ionicons name="person-outline" size={16} color="gray" />
              <Text className="text-gray-500">
                {item?.cliente?.denominacion}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 text-sm  px-2 py-1 rounded-full">
              <Ionicons name="calendar-outline" size={16} color="gray" />
              <Text className="text-gray-500">{fechaHora(item?.fecha)}</Text>
            </View>
          </View>
        </View>

        {/* Total */}
        <View className="ml-auto flex-row items-center gap-2">
          <View className="gap-2 text-sm  px-2 py-1 rounded-full">
            <Text className="text-lg font-bold">Total</Text>
            <Text className="text-2xl font-bold text-blue-600">
              ${item?.importe.toFixed(2)}
            </Text>
          </View>

          {item.estado === "PENDIENTE" && (
            <Pressable onPress={() => setShowToast(true)} className="ml-auto">
              <Ionicons name="trash-outline" size={24} color="red" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Productos */}
      <View className="border-t border-gray-500 mt-5 pt-5">
        <View>
          <Text className="text-xl text-gray-500">
            {item?.items?.length || 0} Productos
          </Text>
        </View>

        <View className="mt-5 flex-row gap-5">
          {item?.items?.map((item) => (
            <ProductoPedidoCard key={item.id_producto} item={item} />
          ))}
        </View>
      </View>

      {showToast && (
        <ToastConfirmacion
          visible={showToast}
          mensaje="¿Estás seguro de eliminar este Pedido?"
          onConfirm={handleDelete}
          onCancel={() => setShowToast(false)}
        />
      )}
    </View>
  );
}
