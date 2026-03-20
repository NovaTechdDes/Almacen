import { useMutateCliente } from "@/src/hooks";
import { useClienteStore } from "@/src/store/cliente.store";
import { mensaje } from "@/src/utils/mensaje";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function FormularioCliente() {
  const { control, handleSubmit } = useForm();
  const { closeModalFormulario } = useClienteStore();
  const { guardarCliente } = useMutateCliente();
  const [error, setError] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    console.log(data);
    if (!data.denominacion) {
      setError(true);
      return;
    }

    const res = await guardarCliente.mutateAsync(data);

    if (res) {
      mensaje("success", "Cliente guardado", "Cliente guardado correctamente");
      closeModalFormulario();
    } else {
      mensaje("error", "Error al guardar", "Error al guardar el cliente");
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full max-w-4xl"
        >
          <View className="overflow-hidden rounded-3xl bg-slate-50 shadow-2xl dark:bg-slate-900">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-950">
              <View className="flex-row items-center">
                <View className="mr-4 rounded-xl bg-indigo-100 p-2 dark:bg-indigo-900/40">
                  <Ionicons name="person-add" size={24} color="#6366f1" />
                </View>
                <View>
                  <Text className="text-xl font-bold text-slate-900 dark:text-white">
                    Nuevo Cliente
                  </Text>
                  <Text className="text-sm text-slate-500 dark:text-slate-400">
                    Complete los datos para registrar un nuevo cliente
                  </Text>
                </View>
              </View>
              <Pressable
                className="rounded-full p-2 active:bg-slate-100 dark:active:bg-slate-800"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Ionicons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>

            {/* Form Content */}
            <ScrollView className="max-h-[70vh] px-8 py-6">
              <View className="flex-row flex-wrap justify-between">
                {/* Denominacion */}
                <View className="mb-6 w-full ">
                  <View className="mb-2 flex-row items-center">
                    <Ionicons
                      name="business-outline"
                      size={18}
                      color="#94a3b8"
                      className="mr-2"
                    />
                    <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Denominación / Nombre Completo *
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="denominacion"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Ej: Juan Pérez o Distribuidora S.A."
                        placeholderTextColor="#94a3b8"
                        className="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base text-slate-900 shadow-sm focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  {error && (
                    <Text className="text-red-500">
                      Este campo es requerido
                    </Text>
                  )}
                </View>

                {/* DNI / CUIT */}
                <View className="mb-6 w-[48%]">
                  <View className="mb-2 flex-row items-center">
                    <Ionicons
                      name="card-outline"
                      size={18}
                      color="#94a3b8"
                      className="mr-2"
                    />
                    <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      DNI / CUIT
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="dni"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Documento"
                        keyboardType="numeric"
                        placeholderTextColor="#94a3b8"
                        className="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base text-slate-900 shadow-sm focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>

                {/* Telefono */}
                <View className="mb-6 w-[48%]">
                  <View className="mb-2 flex-row items-center">
                    <Ionicons
                      name="call-outline"
                      size={18}
                      color="#94a3b8"
                      className="mr-2"
                    />
                    <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Teléfono
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="telefono"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Celular o fijo"
                        keyboardType="phone-pad"
                        placeholderTextColor="#94a3b8"
                        className="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base text-slate-900 shadow-sm focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>

                {/* Direccion */}
                <View className="mb-6 w-full">
                  <View className="mb-2 flex-row items-center">
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#94a3b8"
                      className="mr-2"
                    />
                    <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Dirección
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="direccion"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Calle, número, piso/depto"
                        placeholderTextColor="#94a3b8"
                        className="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base text-slate-900 shadow-sm focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>

                {/* Localidad */}
                <View className="mb-8 w-full">
                  <View className="mb-2 flex-row items-center">
                    <Ionicons
                      name="map-outline"
                      size={18}
                      color="#94a3b8"
                      className="mr-2"
                    />
                    <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Localidad / Ciudad
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="localidad"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Ej: Posadas, Misiones"
                        placeholderTextColor="#94a3b8"
                        className="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base text-slate-900 shadow-sm focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Footer Actions */}
            <View className="flex-row items-center justify-end gap-3 border-t border-slate-200 bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-950">
              <Pressable
                className="rounded-2xl px-6 py-3 active:bg-slate-100 dark:active:bg-slate-800"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text className="text-base font-semibold text-slate-600 dark:text-slate-400">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={guardarCliente.isPending}
                className="rounded-2xl bg-indigo-600 px-8 py-3 shadow-lg shadow-indigo-500/30 active:bg-indigo-700"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Text className="text-base font-bold text-white">
                  {guardarCliente.isPending
                    ? "Guardando..."
                    : "Guardar Cliente"}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
