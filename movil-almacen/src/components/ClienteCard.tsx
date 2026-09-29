import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useMutateCliente } from '../hooks';
import { Cliente } from '../interface';
import { useClienteStore } from '../store/cliente.store';
import { usePedidoStore } from '../store/pedido.store';
import { mensaje } from '../utils/mensaje';
import ToastConfirmacion from './ui/ToastConfirmacion';

interface Props {
  cliente: Cliente;
}

export const ClienteCard: React.FC<Props> = ({ cliente }) => {
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const { eliminarCliente } = useMutateCliente();
  const { setClienteSeleccionado, openModalFormulario } = useClienteStore();
  const { setCliente, openModal } = usePedidoStore();

  const isSincronizado = !!cliente.id_servidor;

  const initials =
    cliente.denominacion
      ?.split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'CL';

  // --- 1. Flujo de Pedido Directo ---
  const handleCrearPedido = () => {
    setCliente(cliente);
    openModal();
    router.push('/(tabs)');
  };

  // --- 2. Acciones de Contacto Rápido ---
  const handleWhatsApp = async () => {
    if (!cliente.telefono) return;
    try {
      let clean = cliente.telefono.replace(/\D/g, '');
      if (clean.startsWith('0')) clean = clean.slice(1);
      // Formato Argentina para WhatsApp (549 + área + número)
      if (clean.length === 10) {
        clean = `549${clean}`;
      } else if (!clean.startsWith('54') && clean.length <= 11) {
        clean = `54${clean}`;
      }
      const url = `https://wa.me/${clean}`;
      await Linking.openURL(url);
    } catch {
      mensaje('error', 'Error', 'No se pudo abrir WhatsApp');
    }
  };

  const handleMaps = async () => {
    if (!cliente.direccion) return;
    try {
      const direccionCompleta = [cliente.direccion, cliente.localidad].filter(Boolean).join(', ');
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`;
      await Linking.openURL(url);
    } catch {
      mensaje('error', 'Error', 'No se pudo abrir Google Maps');
    }
  };

  const handleCall = async () => {
    if (!cliente.telefono) return;
    try {
      const url = `tel:${cliente.telefono.replace(/[^\d+]/g, '')}`;
      await Linking.openURL(url);
    } catch {
      mensaje('error', 'Error', 'No se pudo iniciar la llamada');
    }
  };

  // --- 3. Edición y Eliminación ---
  const handleEdit = () => {
    setClienteSeleccionado(cliente);
    openModalFormulario();
  };

  const handleDelete = async () => {
    // Protección extra: jamás eliminar un cliente sincronizado con el servidor
    if (cliente.id_servidor) {
      mensaje('error', 'No permitido', 'No se pueden eliminar clientes sincronizados con el servidor');
      setShowToast(false);
      return;
    }

    try {
      if (!cliente.id_cliente) return;
      const res = await eliminarCliente.mutateAsync(cliente.id_cliente.toString());
      if (res) {
        mensaje('success', 'Cliente eliminado', 'El cliente ha sido eliminado correctamente');
      } else {
        mensaje('error', 'Error al eliminar', 'No se pudo eliminar el cliente');
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      mensaje('error', 'Error fatal', 'Ocurrió un error inesperado al eliminar');
    } finally {
      setShowToast(false);
    }
  };

  return (
    <View className="mb-4 overflow-hidden rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900 shadow-black/10">
      <View className="flex-row items-center">
        {/* Avatar */}
        <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10">
          <Text className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{initials}</Text>
        </View>

        {/* Info Principal */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 text-base font-bold text-slate-900 dark:text-white mr-2" numberOfLines={1}>
              {cliente.denominacion}
            </Text>

            {/* Badge de Sincronización */}
            {isSincronizado ? (
              <View className="flex-row items-center bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Ionicons name="checkmark-circle" size={11} color="#059669" />
                <Text className="ml-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Sincronizado</Text>
              </View>
            ) : (
              <View className="flex-row items-center bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                <Ionicons name="cloud-upload-outline" size={11} color="#d97706" />
                <Text className="ml-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">Sin sincronizar</Text>
              </View>
            )}
          </View>

          {/* Localidad si existe */}
          {cliente.localidad && <Text className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{cliente.localidad}</Text>}

          {/* Datos y Botones Rápidos de Contacto */}
          <View className="mt-2 space-y-1.5">
            {cliente.dni && (
              <View className="flex-row items-center">
                <Ionicons name="card-outline" size={13} color="#64748b" />
                <Text className="ml-2 text-xs text-slate-500 dark:text-slate-400">DNI: {cliente.dni}</Text>
              </View>
            )}

            {cliente.telefono && (
              <View className="flex-row items-center justify-between mt-1">
                <View className="flex-row items-center flex-1 mr-2">
                  <Ionicons name="call-outline" size={13} color="#64748b" />
                  <Text className="ml-2 text-xs text-slate-500 dark:text-slate-400">{cliente.telefono}</Text>
                </View>

                {/* Acciones Rápidas: Llamada y WhatsApp */}
                <View className="flex-row items-center gap-1.5">
                  <Pressable onPress={handleCall} className="h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 active:bg-slate-200">
                    <Ionicons name="call" size={13} color="#0284c7" />
                  </Pressable>
                  <Pressable onPress={handleWhatsApp} className="h-7 w-7 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 active:bg-emerald-100">
                    <Ionicons name="logo-whatsapp" size={14} color="#16a34a" />
                  </Pressable>
                </View>
              </View>
            )}

            {cliente.direccion && (
              <View className="flex-row items-center justify-between mt-1">
                <View className="flex-row items-center flex-1 mr-2">
                  <Ionicons name="location-outline" size={13} color="#64748b" />
                  <Text className="ml-2 text-xs text-slate-500 dark:text-slate-400" numberOfLines={1}>
                    {cliente.direccion}
                  </Text>
                </View>

                {/* Acción Rápida: Google Maps */}
                <Pressable onPress={handleMaps} className="h-7 w-7 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 active:bg-blue-100">
                  <Ionicons name="map-outline" size={13} color="#2563eb" />
                </Pressable>
              </View>
            )}

            {cliente.email && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="mail-outline" size={13} color="#64748b" />
                <Text className="ml-2 text-xs text-slate-500 dark:text-slate-400" numberOfLines={1}>
                  {cliente.email}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Barra de Acciones Inferior */}
      <View className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
        {/* Botón Principal: Iniciar Pedido */}
        <Pressable onPress={handleCrearPedido} className="flex-row items-center justify-center gap-2 bg-indigo-600 active:bg-indigo-700 py-2.5 px-4 rounded-xl">
          <Ionicons name="cart-outline" size={17} color="white" />
          <Text className="text-white text-sm font-semibold">Iniciar Pedido</Text>
        </Pressable>

        {/* Botones Secundarios: Editar y Eliminar (condicional) */}
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={handleEdit}
            className="flex-1 flex-row items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 active:bg-slate-200 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <Ionicons name="create-outline" size={15} color="#475569" />
            <Text className="text-slate-700 dark:text-slate-200 text-sm font-medium">Editar</Text>
          </Pressable>

          {/* SOLO se muestra si NO tiene id_servidor (nunca sincronizado) */}
          {!cliente.id_servidor && (
            <Pressable
              onPress={() => setShowToast(true)}
              className="flex-1 flex-row items-center justify-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 active:bg-rose-100 py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900"
            >
              <Ionicons name="trash-outline" size={15} color="#e11d48" />
              <Text className="text-rose-600 dark:text-rose-400 text-sm font-medium">Eliminar</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Modal de Confirmación para Eliminar */}
      {showToast && (
        <ToastConfirmacion
          visible={showToast}
          mensaje={`¿Estás seguro de eliminar a "${cliente.denominacion}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setShowToast(false)}
        />
      )}
    </View>
  );
};
