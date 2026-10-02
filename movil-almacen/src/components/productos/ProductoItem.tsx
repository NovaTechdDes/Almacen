import { Producto } from '@/src/interface';
import { usePedidoStore } from '@/src/store/pedido.store';
import { mensaje } from '@/src/utils/mensaje';
import { obtenerPrecioPorCantidad } from '@/src/utils/precios';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ToastNumber from '../ui/ToastNumber';

interface Props {
  producto: Producto;
}

const ProductoItem = React.memo(function ProductoItem({ producto }: Props) {
  const { addItem } = usePedidoStore();
  const [show, setShow] = useState(false);
  const [cantidad, setCantidad] = useState('1');
  const [precio, setPrecio] = useState<string>('');

  const handleAddCart = () => {
    mensaje('success', 'Producto agregado al carrito');
    addItem(producto);
  };

  const handleLongPress = () => {
    const cantidadInicial = 1;
    setCantidad('1');

    const precioCalculado = obtenerPrecioPorCantidad(producto.precio, producto.precios_mayoristas, cantidadInicial);
    setPrecio(precioCalculado.toString());

    setShow(true);
  };

  const handleCantidadChange = (nuevaCantidadStr: string) => {
    setCantidad(nuevaCantidadStr);

    const cantNum = parseFloat(nuevaCantidadStr) || 0;

    if (cantNum > 0) {
      const nuevoPrecio = obtenerPrecioPorCantidad(producto.precio, producto.precios_mayoristas, cantNum);
      setPrecio(nuevoPrecio.toString());
    }
  };

  const handleConfirm = () => {
    const cantNum = parseFloat(cantidad) || 1;
    const precioNum = parseFloat(precio) || producto.precio;

    addItem(producto, cantNum, precioNum);

    mensaje('success', `Producto agregado al carrito con la cantidad: ${cantidad}`);
    setShow(false);
  };

  useEffect(() => {
    setPrecio(producto.precio?.toFixed(2) || '0.00');
  }, [producto]);

  return (
    <View
      className="flex-1 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
      style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }}
    >
      {/* Imagen con badges superpuestos */}
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={handleLongPress}
        onPress={handleAddCart}
        className="h-44 bg-slate-50 dark:bg-slate-800 items-center justify-center p-3"
      >
        {producto.imagen_local ? (
          <Image className="h-full w-full" resizeMode="contain" source={{ uri: producto.imagen_local }} />
        ) : (
          <View className="items-center justify-center opacity-20">
            <Ionicons name="cube-outline" size={52} color="#64748b" />
          </View>
        )}

        {/* Stock — top left */}
        <View className="absolute top-2 left-2 bg-slate-900/70 px-2.5 py-0.5 rounded-full">
          <Text className="text-white text-[10px] font-semibold">Stock: {producto.stock}</Text>
        </View>

        {/* Rubro — top right */}
        {producto.rubro?.nom_rubro && (
          <View className="absolute top-2 right-2 bg-indigo-500/90 px-2.5 py-0.5 rounded-full max-w-[55%]">
            <Text className="text-white text-[10px] font-bold uppercase tracking-wide" numberOfLines={1}>
              {producto.rubro.nom_rubro}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Contenido */}
      <View className="px-3 pt-2.5 pb-3 gap-2">
        {/* Código */}
        <Text className="text-[10px] font-mono text-slate-400 dark:text-slate-500" numberOfLines={1}>
          #{producto.codigo}
        </Text>

        {/* Descripción */}
        <Text className="text-sm font-bold text-slate-800 dark:text-white leading-snug min-h-[40px]" numberOfLines={2}>
          {producto.descripcion}
        </Text>

        {/* Precios */}
        <View className="pt-2.5 border-t border-slate-100 dark:border-slate-800 gap-1">
          <View className="flex-row justify-between items-baseline">
            <Text className="text-[11px] text-slate-400">Unitario</Text>
            <Text className="text-base font-extrabold text-slate-900 dark:text-white">
              ${producto.precio?.toFixed(2) || '0.00'}
            </Text>
          </View>

          {producto.precios_mayoristas?.map((pm, index) => (
            <View key={pm.id_precio_mayorista || index} className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-1">
                <View className="w-1 h-1 rounded-full bg-emerald-400" />
                <Text className="text-[10px] text-slate-400 dark:text-slate-500">x{pm.cant_mayorista}u</Text>
              </View>
              <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ${pm.precio_mayorista?.toFixed(2) || '0.00'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Botón agregar */}
      <TouchableOpacity
        onPress={handleAddCart}
        onLongPress={handleLongPress}
        activeOpacity={0.8}
        className="mx-3 mb-3 bg-indigo-600 rounded-xl py-2.5 flex-row items-center justify-center gap-2"
      >
        <Ionicons name="cart-outline" size={15} color="#ffffff" />
        <Text className="text-white text-xs font-bold tracking-widest">AGREGAR</Text>
      </TouchableOpacity>

      <ToastNumber
        visible={show}
        cantidad={cantidad}
        setCantidad={handleCantidadChange}
        precio={precio.toString()}
        setPrecio={setPrecio}
        precioSugerido={obtenerPrecioPorCantidad(producto.precio, producto.precios_mayoristas, parseFloat(cantidad) || 1)}
        onConfirm={handleConfirm}
        onCancel={() => {
          setShow(false);
        }}
      />
    </View>
  );
});

export default ProductoItem;
