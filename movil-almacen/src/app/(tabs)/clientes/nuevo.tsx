import { useMutateCliente } from '@/src/hooks';
import { useClienteStore } from '@/src/store/cliente.store';
import { mensaje } from '@/src/utils/mensaje';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { KeyboardTypeOptions, Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CampoProps {
  control: Control<any>;
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  half?: boolean; // ocupa la mitad del ancho cuando hay espacio
}

const Campo = ({ control, name, label, icon, placeholder, keyboardType, error, half }: CampoProps) => (
  <View className="mb-5" style={half ? { width: '48%', minWidth: 260, flexGrow: 1 } : { width: '100%' }}>
    <View className="mb-2 flex-row items-center gap-2">
      <Ionicons name={icon} size={18} color="#94a3b8" />
      <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</Text>
    </View>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
          className="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base text-slate-900 shadow-sm focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          value={value}
          onChangeText={onChange}
        />
      )}
    />
    {error && <Text className="mt-1 text-red-500">{error}</Text>}
  </View>
);

export default function FormularioCliente() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { setClienteSeleccionado, clienteSeleccionado } = useClienteStore();
  const { guardarCliente, actualizarCliente } = useMutateCliente();

  const { control, handleSubmit } = useForm<any>({
    defaultValues: clienteSeleccionado || {},
  });
  const [error, setError] = useState<boolean>(false);

  const editando = !!clienteSeleccionado;
  const pendiente = editando ? actualizarCliente.isPending : guardarCliente.isPending;
  const wide = width >= 600;
  const px = width >= 900 ? 32 : 16;

  const handleClose = () => {
    setClienteSeleccionado(null);
    router.back();
  };

  const onSubmit = async (data: any) => {
    if (!data.denominacion) {
      setError(true);
      return;
    }

    const res = editando ? await actualizarCliente.mutateAsync(data) : await guardarCliente.mutateAsync(data);

    if (res) {
      mensaje('success', editando ? 'Cliente actualizado' : 'Cliente guardado', editando ? 'Cliente actualizado correctamente' : 'Cliente guardado correctamente');
      handleClose();
    } else {
      mensaje('error', editando ? 'Error al actualizar' : 'Error al guardar', editando ? 'Error al actualizar el cliente' : 'Error al guardar el cliente');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950" edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: editando ? 'Editar Cliente' : 'Nuevo Cliente' }} />

      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={58}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: px, paddingVertical: 20, alignItems: 'center' }}
      >
        <View className="w-full max-w-3xl">
          {/* Encabezado de la página */}
          <View className="mb-6 flex-row items-center">
            <View className="mr-4 rounded-xl bg-indigo-100 p-2 dark:bg-indigo-900/40">
              <Ionicons name={editando ? 'create-outline' : 'person-add'} size={24} color="#6366f1" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-900 dark:text-white">{editando ? 'Editar Cliente' : 'Nuevo Cliente'}</Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400">
                {editando ? 'Modifique los datos del cliente' : 'Complete los datos para registrar un nuevo cliente'}
              </Text>
            </View>
          </View>

          {/* Formulario */}
          <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900" style={{ padding: wide ? 28 : 16 }}>
            <View className="flex-row flex-wrap justify-between" style={{ columnGap: 16 }}>
              <Campo
                control={control}
                name="denominacion"
                label="Denominación / Nombre Completo *"
                icon="business-outline"
                placeholder="Ej: Juan Pérez o Distribuidora S.A."
                error={error ? 'Este campo es requerido' : undefined}
              />
              <Campo half control={control} name="dni" label="DNI / CUIT" icon="card-outline" placeholder="Documento" keyboardType="numeric" />
              <Campo half control={control} name="telefono" label="Teléfono" icon="call-outline" placeholder="Celular o fijo" keyboardType="phone-pad" />
              <Campo half control={control} name="direccion" label="Dirección" icon="location-outline" placeholder="Calle, número, piso/depto" />
              <Campo half control={control} name="localidad" label="Localidad / Ciudad" icon="map-outline" placeholder="Ej: Posadas, Misiones" />
              <Campo control={control} name="email" label="Email" icon="mail-outline" placeholder="google@gmail.com.ar" keyboardType="email-address" />
            </View>

            {/* Acciones */}
            <View className="mt-2 flex-row items-center justify-end gap-3">
              <Pressable onPress={handleClose} className="rounded-2xl px-6 py-3 active:bg-slate-100 dark:active:bg-slate-800" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                <Text className="text-base font-semibold text-slate-600 dark:text-slate-400">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={pendiente}
                className={`rounded-2xl bg-indigo-600 px-8 py-3 shadow-lg shadow-indigo-500/30 active:bg-indigo-700 ${pendiente ? 'opacity-60' : ''}`}
                style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
              >
                <Text className="text-base font-bold text-white">
                  {editando ? (pendiente ? 'Actualizando...' : 'Actualizar Cliente') : pendiente ? 'Guardando...' : 'Guardar Cliente'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
