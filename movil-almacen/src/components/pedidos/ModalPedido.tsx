import { useClientes } from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { usePedidoStore } from "../../store/pedido.store";
import Loading from "../ui/Loading";
import CarritoPedido from "./CarritoPedido";
import ProductosPedidos from "./ProductosPedidos";
import TotalPedido from "./TotalPedido";

const ModalPedido = () => {
  const { clearPedido, setCliente, cliente } = usePedidoStore();
  const { data: clientes, isLoading } = useClientes();

  const handleClearCarrito = () => {
    clearPedido();
  };

  if (isLoading) return <Loading texto="Cargando clientes..." />;

  return (
    <Modal animationType="slide" transparent={false} visible={true}>
      <View className="flex-1 bg-slate-50">
        {/* Header con título y botón cerrar */}
        <View className="flex-row justify-between items-center px-8 py-6 bg-white border-b border-slate-100">
          <Text className="text-2xl font-bold text-slate-800">
            Nuevo Pedido
          </Text>
          <Pressable
            onPress={handleClearCarrito}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <Ionicons name="close" size={24} color="#64748b" />
          </Pressable>
        </View>

        <View className="flex-1 flex-row">
          {/* Columna Izquierda: Clientes y Productos */}
          <View className="flex-[0.6] px-8 pt-6 border-r border-slate-200">
            {/* Sección Cliente Placeholder */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-slate-500 mb-2">
                Cliente
              </Text>
              <View className="bg-white border border-slate-200 rounded-xl shadow-sm shadow-slate-200">
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  containerStyle={styles.containerStyle}
                  data={clientes || []}
                  labelField="denominacion"
                  valueField="id_cliente"
                  placeholder="Seleccionar Cliente"
                  search
                  searchPlaceholder="Buscar cliente..."
                  value={cliente?.id_cliente}
                  onChange={(item) => setCliente(item)}
                />
              </View>
            </View>

            {/* Productos */}
            <ProductosPedidos />
          </View>

          {/* Columna Derecha: Carrito */}
          <View className="flex-[0.4] bg-white">
            <View className="flex-1 px-6 pt-6">
              <CarritoPedido />
            </View>

            <View className="border-t border-slate-100 px-6 py-6 bg-slate-50/50">
              <TotalPedido />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalPedido;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: "100%",
    paddingHorizontal: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#94a3b8",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
  },
  inputSearchStyle: {
    height: 45,
    fontSize: 16,
    borderRadius: 8,
    color: "#1e293b",
  },
  containerStyle: {
    borderRadius: 12,
    marginTop: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
});
