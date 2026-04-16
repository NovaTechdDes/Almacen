import path from 'path';
import fs from 'fs';
import { Articulos } from '../types/Articulos';

export const obtenerDireccionImage = (articulos: Articulos[]) => {
  const carpetaImagenes = path.join(process.cwd(), 'uploads');

  const articulosConImagen = articulos.map((art) => {
    const archivos = fs.readdirSync(carpetaImagenes);

    const archivoImagen = archivos.find((file) => file.startsWith(art.codigo!));

    return {
      ...art,
      imagenURL: archivoImagen ? `http://${process.env.IMAGE_URL}:${process.env.PORT}/imagenes/${archivoImagen}` : '',
    };
  });

  return articulosConImagen;
};
