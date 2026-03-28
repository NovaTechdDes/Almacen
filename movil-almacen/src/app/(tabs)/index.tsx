import { HeaderPedidos, ListaPedidos, ListaVacia } from "@/src/components";
import ModalPedido from "@/src/components/pedidos/ModalPedido";
import Loading from "@/src/components/ui/Loading";
import { usePedidos } from "@/src/hooks/pedidos/usePedidos";
import { useUsers } from "@/src/hooks/users/useUsers";
import { Vendedor } from "@/src/interface";
import { usePedidoStore } from "@/src/store/pedido.store";
import { useUserStore } from "@/src/store/user.store";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Pedido() {
  const { modalOpen } = usePedidoStore();
  const { data, isLoading } = useUsers();

  const { userActive, modalVisible, setModalVisible, setUserActive } =
    useUserStore();
  const { data: pedidos } = usePedidos(new Date().toISOString().split("T")[0]);

  const handleUser = (password: string) => {
    const user = data?.find((user: Vendedor) => user.clave === password);

    setUserActive(user || null);
  };

  useEffect(() => {
    if (data?.length === 0) {
      console.log("sincronizar");
    }
  }, [data]);

  if (isLoading) {
    return <Loading texto="Cargando usuarios..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}

      <HeaderPedidos />

      {/* main */}
      {!pedidos ? <ListaVacia /> : <ListaPedidos pedidos={pedidos} />}

      {/* Modal */}
      {modalOpen && <ModalPedido />}
      {/* {!userActive && (
        <Login
          visible={!modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleUser}
        />
      )} */}
    </SafeAreaView>
  );
}
