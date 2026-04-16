import * as FileSystem from 'expo-file-system';
import { Producto } from '../interface';

export async function descargarImagenes(productos: Producto[]) {
  const rutasDescargadas: string[] = [];

  try {
    // Creamos la referencia a la carpeta usando la nueva API
    const carpeta = new FileSystem.Directory(FileSystem.Paths.document, 'imagenes');

    // create() es SÍNCRONO en la nueva API.
    // Usamos idempotent: true para que no falle si ya existe, eliminando la necesidad de chequear exists.
    carpeta.create({ idempotent: true });

    for (const producto of productos) {
      if (!producto.imagen_local) continue;

      try {
        const url = producto.imagen_local;
        // Extraemos la extensión manejando posibles parámetros de búsqueda en la URLs
        const extension = url.split('/').pop()?.split('?')[0].split('.').pop() || 'jpg';
        console.log(extension);

        // Usamos la clase File para construir la ruta de forma segura
        const archivoLocal = new FileSystem.File(carpeta, `${producto.codigo}.${extension}`);

        // Usamos el método estático moderno para descargar
        await FileSystem.File.downloadFileAsync(url, archivoLocal, { idempotent: true });

        rutasDescargadas.push(archivoLocal.uri);
      } catch (error) {
        console.error(`Error descargando imagen para ${producto.codigo}:`, error);
      }
    }
  } catch (error) {
    console.error('Error en el proceso de descarga de imágenes:', error);
  }

  return rutasDescargadas;
}
