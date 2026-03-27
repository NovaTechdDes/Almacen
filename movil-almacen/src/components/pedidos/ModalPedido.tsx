import React from "react";
import { Modal, Text, View } from "react-native";
import ProductosPedidos from "./ProductosPedidos";

const ModalPedido = () => {
  return (
    <Modal>
      <Text>Nuevo Pedido</Text>

      <View>
        <View>
          {/* Clientes */}
          <View></View>

          {/* Productos */}
          <ProductosPedidos />
        </View>

        <View></View>
      </View>
    </Modal>
  );
};

export default ModalPedido;
