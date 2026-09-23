import * as FileSystem from 'expo-file-system';
import { getDb } from '../db/db';
import { Producto } from '../interface';

let estaDescargando = false;

// Descargar una imagen individual si no existe localmente
export const descargarImagenIndividual = async (carpeta: FileSystem.Directory, producto: Producto, db: any): Promise<string | null> => {
  if (!producto.imagen_local || !producto.codigo) return null;

  try {
    const url = producto.imagen_local;

    //Si ya es un archivo local, no hay que descargar nada
    if (url.startsWith('file://')) return url;

    const extension = url.split('/').pop()?.split('?')[0].split('.').pop() || 'jpg';
    const archivoLocal = new FileSystem.File(carpeta, `${producto.codigo}.${extension}`);

    // 1. Si ya existe en el dispositivo, aseguramos que SQLite tenga la ruta local y omitimos descarga
    if (archivoLocal.exists) {
      await db.runAsync(`UPDATE productos SET imagen_local = ? WHERE codigo = ?`, [archivoLocal.uri, producto.codigo]);
      return archivoLocal.uri;
    }

    // 2. Descargamos la imagen
    await FileSystem.File.downloadFileAsync(url, archivoLocal, { idempotent: true });

    // 3. Actualizamos SQLite para que quede guarda la ruta local
    await db.runAsync(`UPDATE productos SET imagen_local = ? WHERE codigo = ?`, [archivoLocal.uri, producto.codigo]);

    return archivoLocal.uri;
  } catch (error) {
    console.error(`Error descargando imagen para ${producto.codigo}:`, error);
    return null;
  }
};

// Procesa la descarga en lotes (Concurrencia de N imagenes en paralelos)

export const procesarEnLotes = async (carpeta: FileSystem.Directory, productos: Producto[], limiteConcurrente: number = 5) => {
  const db = await getDb();

  for (let i = 0; i < productos.length; i += limiteConcurrente) {
    const lote = productos.slice(i, i + limiteConcurrente);
    await Promise.all(lote.map((prod) => descargarImagenIndividual(carpeta, prod, db)));
  }
};

// Funcion en Segundo Plano

export const descargarImagenesEnSegundoPlano = (productos: Producto[]) => {
  if (estaDescargando) {
    console.log('Ya hay una descargar de imagenes en curso');
    return;
  }

  estaDescargando = true;

  //Ejecutamos en segundo plano mediante IIFE asicronica
  (async () => {
    try {
      const carpeta = new FileSystem.Directory(FileSystem.Paths.document, 'imagenes');
      carpeta.create({ idempotent: true });

      //Filtramos solo los que tengan URL web valida
      const productosConImagen = productos.filter((p) => p.imagen_local && (p.imagen_local.startsWith('http://') || p.imagen_local.startsWith('https://')));
      await procesarEnLotes(carpeta, productosConImagen, 5);

      console.log('Descarga de imagenes en segundo plano completa.');
    } catch (error) {
      console.log('Error en procesode descarga de imagenes en segundo plano:', error);
    } finally {
      estaDescargando = false;
    }
  })();
};

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
