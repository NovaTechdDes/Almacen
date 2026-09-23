import path from 'path';
import fs from 'fs';
import { Articulos } from '../types/Articulos';

export const resolverCarpetaUploads = (): string => {
  const rutasPosibles = [
    path.resolve(__dirname, '../../uploads'),
    path.resolve(__dirname, '../uploads'),
    path.join(process.cwd(), 'uploads'),
    path.join(process.cwd(), 'backend-almacen', 'uploads'),
  ];

  const rutaEncontrada = rutasPosibles.find((ruta) => fs.existsSync(ruta));
  return rutaEncontrada || path.join(process.cwd(), 'uploads');
};

export const obtenerDireccionImage = (articulos: Articulos[]) => {
  const carpetaImagenes = resolverCarpetaUploads();

  // Si la carpeta no existe, devolvemos los articulos sin url sin romper la app
  if (!fs.existsSync(carpetaImagenes)) {
    console.warn(`[obtenerDireccionImage] Carpeta uploads no encontrada en: ${carpetaImagenes}`);
    return articulos.map((art) => ({ ...art, imagenURL: '' }));
  }

  // 1. Leemos el disco una sola vez
  const archivos = fs.readdirSync(carpetaImagenes);

  // 2. Indexamos en un Map por el nombre base del archivo
  const mapaArchivos = new Map<string, string>();
  for (const archivo of archivos) {
    const dotIndex = archivo.lastIndexOf('.');
    const baseName = dotIndex !== -1 ? archivo.substring(0, dotIndex) : archivo;

    if (!mapaArchivos.has(baseName)) {
      mapaArchivos.set(baseName, archivo);
    }
  }

  const baseURL = (process.env.BASE_URL || '').replace(/\/+$/, '');

  // 3. Mapeo ultra rápido en memoria O(1)
  const articulosConImagen = articulos.map((art) => {
    if (!art.codigo) {
      return { ...art, imagenURL: '' };
    }

    // Búsqueda directa por el código en el Map
    let archivoImagen = mapaArchivos.get(art.codigo);

    // Si tuviera sufijos extras
    if (!archivoImagen) {
      archivoImagen = archivos.find((file) => file.startsWith(art.codigo!));
    }

    const rutaRelativa = archivoImagen ? `/imagenes/${archivoImagen}` : '';

    return {
      ...art,
      imagenURL: archivoImagen ? (baseURL ? `${baseURL}${rutaRelativa}` : rutaRelativa) : '',
    };
  });

  return articulosConImagen;
};
