import { Rubro } from '@/src/interface';
import { useProductoStore } from '@/src/store/producto.store';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface Props {
  rubro: Rubro;
}

export default function RubroItem({ rubro }: Props) {
  const { setRubroSeleccionadoId, rubroSeleccionadoId } = useProductoStore();

  const handleRubro = () => {
    setRubroSeleccionadoId(rubro.id_rubro);
  };

  const rubroSeleccionado = rubroSeleccionadoId === rubro.id_rubro;

  return (
    <TouchableOpacity onPress={handleRubro} className={`p-2 rounded-lg ${rubroSeleccionado ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-800'}`}>
      <Text className="text-black dark:text-white font-bold">{rubro.nom_rubro}</Text>
    </TouchableOpacity>
  );
}
