import { Stack } from 'expo-router';
import React from 'react';

export default function ProductosLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Rubros' }} />
      <Stack.Screen name="[rubroId]" options={{ title: 'Productos' }} />
    </Stack>
  );
}
