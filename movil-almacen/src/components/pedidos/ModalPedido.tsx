import { useAppTheme, useClientes } from '@/src/hooks';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePedidoStore } from '../../store/pedido.store';
import Loading from '../ui/Loading';
import CarritoPedido from './CarritoPedido';
import ProductosPedidos from './ProductosPedidos';
import TotalPedido from './TotalPedido';

type Tab = 'productos' | 'carrito';

const ModalPedido = () => {
  const { toggleModal, setCliente, cliente, items } = usePedidoStore();
  const { data: clientes, isLoading } = useClientes();
  const { isDark } = useAppTheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('productos');

  // Tablet: lado corto >= 600. Teléfono en horizontal: ancho > alto.
  const isTablet = Math.min(width, height) >= 600;
  const isLandscape = width > height;
  const splitView = width >= 700 && (isTablet || isLandscape);
  const compact = !isTablet;
  const px = compact ? 12 : 32;

  // Ancho aproximado del panel de productos para calcular columnas
  const leftFlex = isTablet ? 0.6 : 0.58;
  const productosWidth = splitView ? width * leftFlex : width;
  const numColumns = productosWidth >= 900 ? 3 : productosWidth >= 560 ? 2 : 1;

  if (isLoading) return <Loading texto="Cargando clientes..." />;

  const selectorCliente = (
    <View className={compact ? 'mb-3' : 'mb-6'}>
      {!compact && <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Cliente</Text>}
      <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm shadow-slate-200 dark:shadow-none">
        <Dropdown
          style={[styles.dropdown, compact && { height: 44 }]}
          placeholderStyle={[styles.placeholderStyle, isDark && { color: 'white' }]}
          selectedTextStyle={[styles.selectedTextStyle, isDark && { color: 'white' }]}
          inputSearchStyle={[styles.inputSearchStyle, isDark && { color: 'white', backgroundColor: '#1e293b' }]}
          containerStyle={[styles.containerStyle, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}
          itemTextStyle={[isDark && { color: 'white' }]}
          activeColor={isDark ? '#334155' : undefined}
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
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
      onRequestClose={toggleModal}
    >
      <View
        className="flex-1 bg-slate-50 dark:bg-slate-900"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }}
      >
        {/* Header con título y botón cerrar */}
        <View
          className="flex-row justify-between items-center bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700"
          style={{ paddingHorizontal: px, paddingVertical: compact ? 6 : 20 }}
        >
          <Text className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-slate-800 dark:text-white`}>Nuevo Pedido</Text>
          <Pressable onPress={toggleModal} hitSlop={8} className="p-2 rounded-full">
            <Ionicons name="close" size={24} color="#64748b" />
          </Pressable>
        </View>

        {splitView ? (
          <View className="flex-1 flex-row">
            {/* Columna Izquierda: Cliente y Productos */}
            <View className="border-r border-slate-200 dark:border-slate-700" style={{ flex: leftFlex, paddingHorizontal: px, paddingTop: compact ? 10 : 24 }}>
              {selectorCliente}
              <ProductosPedidos numColumns={numColumns} compact={compact} />
            </View>

            {/* Columna Derecha: Carrito */}
            <View className="bg-white dark:bg-slate-800" style={{ flex: 1 - leftFlex }}>
              <View className="flex-1" style={{ paddingHorizontal: compact ? 12 : 24, paddingTop: compact ? 10 : 24 }}>
                <CarritoPedido compact={compact} />
              </View>
              <View
                className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
                style={{ paddingHorizontal: compact ? 12 : 24, paddingVertical: compact ? 8 : 24 }}
              >
                <TotalPedido compact={compact} />
              </View>
            </View>
          </View>
        ) : (
          <View className="flex-1">
            {/* Pestañas Productos / Carrito */}
            <View className="flex-row bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
              {(['productos', 'carrito'] as Tab[]).map((t) => {
                const active = tab === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => setTab(t)}
                    className={`flex-1 flex-row items-center justify-center py-3 border-b-2 ${active ? 'border-blue-600' : 'border-transparent'}`}
                  >
                    <Ionicons name={t === 'productos' ? 'cube-outline' : 'cart-outline'} size={18} color={active ? '#2563eb' : '#94a3b8'} />
                    <Text className={`ml-2 font-semibold ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                      {t === 'productos' ? 'Productos' : `Carrito (${items.length})`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="flex-1" style={{ paddingHorizontal: px, paddingTop: 12 }}>
              {tab === 'productos' ? (
                <>
                  {selectorCliente}
                  <ProductosPedidos numColumns={numColumns} compact={compact} />
                </>
              ) : (
                <CarritoPedido compact={compact} />
              )}
            </View>

            {/* Barra inferior fija con total y acciones */}
            <View className="border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800" style={{ paddingHorizontal: px, paddingVertical: 10 }}>
              <TotalPedido compact inline />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ModalPedido;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: '100%',
    paddingHorizontal: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputSearchStyle: {
    height: 45,
    fontSize: 16,
    borderRadius: 8,
  },
  containerStyle: {
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
});
