import { HeaderPedidos, ListaPedidos, ListaVacia } from "@/src/components";
import ModalPedido from "@/src/components/pedidos/ModalPedido";
import { usePedidoStore } from "@/src/store/pedido.store";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Pedido() {
  const { modalOpen } = usePedidoStore();
  const pedidos = undefined;

  return (
    <SafeAreaView>
      {/* Header */}

      <HeaderPedidos />

      {/* main */}
      {!pedidos ? <ListaVacia /> : <ListaPedidos />}

      {/* Modal */}
      {!modalOpen && <ModalPedido />}
    </SafeAreaView>
  );
}
