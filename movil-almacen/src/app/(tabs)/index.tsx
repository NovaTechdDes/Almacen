import { HeaderPedidos, ListaPedidos, ListaVacia } from "@/src/components";
import ModalPedido from "@/src/components/pedidos/ModalPedido";
import Loading from "@/src/components/ui/Loading";
import Login from "@/src/components/ui/Login";
import { usePedidos } from "@/src/hooks/pedidos/usePedidos";
import { useUsers } from "@/src/hooks/users/useUsers";
import { Vendedor } from "@/src/interface";
import { usePedidoStore } from "@/src/store/pedido.store";
import { useUserStore } from "@/src/store/user.store";
import { mensaje } from "@/src/utils/mensaje";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Pedido() {
  const router = useRouter();
  const { modalOpen } = usePedidoStore();
  const { data, isLoading } = useUsers();

  const { userActive, modalVisible, setModalVisible, setUserActive } =
    useUserStore();
  const { data: pedidos } = usePedidos(new Date().toISOString().split("T")[0]);
  console.log(data);

  const handleUser = (password: string) => {
    const user = data?.find((user: Vendedor) => user.clave === password);

    if (user) {
      setUserActive(user);
      mensaje("success", "Usuario logueado correctamente");
      setModalVisible(false);
    } else {
      mensaje("error", "Contraseña incorrecta");
    }
  };

  useEffect(() => {
    if (data && data.length === 0) {
      router.replace("/(tabs)/sincronizar");
    }
  }, [data, router]);

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
      {!userActive && (
        <Login
          visible={!modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleUser}
        />
      )}
    </SafeAreaView>
  );
}
