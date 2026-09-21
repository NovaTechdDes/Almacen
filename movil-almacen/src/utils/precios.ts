import { Precio_Mayorista } from '../interface';

export const obtenerPrecioPorCantidad = (precioBase: number, preciosMayoristas: Precio_Mayorista[] | undefined, cantidad: number) => {
  if (!preciosMayoristas || preciosMayoristas.length === 0 || cantidad <= 0) {
    return precioBase || 0;
  }

  const tramosAlcanzados = preciosMayoristas.filter((pm) => pm.cant_mayorista && cantidad >= pm.cant_mayorista).sort((a, b) => b.cant_mayorista - a.cant_mayorista);

  if (tramosAlcanzados.length > 0) {
    return tramosAlcanzados[0].precio_mayorista;
  }

  return precioBase || 0;
};
