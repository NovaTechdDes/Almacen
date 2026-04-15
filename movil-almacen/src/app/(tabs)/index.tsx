import { ListaPedidos } from '@/src/components';
import ModalPedido from '@/src/components/pedidos/ModalPedido';
import Login from '@/src/components/ui/Login';
import { usePedidos } from '@/src/hooks/pedidos/usePedidos';
import { usePedidoStore } from '@/src/store/pedido.store';
import { useUserStore } from '@/src/store/user.store';
import { mensaje } from '@/src/utils/mensaje';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Pedido() {
  const router = useRouter();
  const { modalOpen } = usePedidoStore();
  const [error, setError] = useState(false);

  const { userActive, modalVisible, setModalVisible, setUserActive } = useUserStore();
  const { data: pedidos } = usePedidos(new Date().toISOString().split('T')[0]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleUser = async (password: string) => {
    const user = await AsyncStorage.getItem('@user');

    if (user) {
      setUserActive(JSON.parse(user));
      mensaje('success', 'Usuario logueado correctamente');
      setModalVisible(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('@user');
      const usuario = JSON.parse(user || '{}');
      if (!usuario.codigo) {
        router.replace('/(tabs)/sincronizar');
      }
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* main */}
      <ListaPedidos pedidos={pedidos || []} refreshing={refreshing} onRefresh={onRefresh} />

      {/* Modal */}
      {modalOpen && <ModalPedido />}

      {!userActive && <Login visible={!modalVisible} onClose={() => setModalVisible(false)} onConfirm={handleUser} error={error} />}
    </SafeAreaView>
  );
}
