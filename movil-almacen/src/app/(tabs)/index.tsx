import { HeaderPedidos, ListaPedidos, ListaVacia } from "@/src/components";
import ModalPedido from "@/src/components/pedidos/ModalPedido";
import Login from "@/src/components/ui/Login";
import { usePedidos } from "@/src/hooks/pedidos/usePedidos";
import { usePedidoStore } from "@/src/store/pedido.store";
import { useUserStore } from "@/src/store/user.store";
import { mensaje } from "@/src/utils/mensaje";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Pedido() {
  const router = useRouter();
  const { modalOpen } = usePedidoStore();
  const [error, setError] = useState(false);

  const { userActive, modalVisible, setModalVisible, setUserActive } =
    useUserStore();
  const { data: pedidos } = usePedidos(new Date().toISOString().split("T")[0]);

  const handleUser = async (password: string) => {
    const user = await AsyncStorage.getItem("@user_active");

    console.log(user);

    if (user) {
      setUserActive(JSON.parse(user));
      mensaje("success", "Usuario logueado correctamente");
      setModalVisible(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {}, [router]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}

      <HeaderPedidos />

      {/* main */}
      {!pedidos ? <ListaVacia /> : <ListaPedidos pedidos={pedidos} />}

      {/* Modal */}
      {modalOpen && <ModalPedido />}
      {!userActive && (
        <Login
          visible={!modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleUser}
          error={error}
        />
      )}
    </SafeAreaView>
  );
}
