import { getDb } from '../db/db';
import { Producto } from '../interface';

export const getProductos = async (buscador: string, limit: number = 20, offset: number = 0, rubroId: number): Promise<Producto[]> => {
  const db = await getDb();
  try {
    const filas = (await db.getAllAsync(
      `SELECT 
        p.id_producto,
        p.descripcion,
        p.codigo,
        p.id_rubro,
        p.precio,
        p.stock,
        p.imagen_local,
        (select json_object(
        'id_rubro', id_rubro,
        'nom_rubro', nom_rubro
        ) FROM rubros WHERE id_rubro = p.id_rubro) as rubro,
        (SELECT json_group_array(
          json_object(
            'id_precio_mayorista', id_precio_mayorista,
            'id_articulo', id_articulo,
            'precio_mayorista', precio_mayorista,
            'cant_mayorista', cant_mayorista
          )
        ) FROM precios_mayorista WHERE id_articulo = p.id_producto) as precios_mayoristas
      FROM productos p
      WHERE (p.descripcion LIKE ? OR p.codigo LIKE ?) AND (? = 0 OR p.id_rubro = ?)
      ORDER BY p.descripcion
      LIMIT ? OFFSET ?;`,
      [`%${buscador}%`, `%${buscador}%`, rubroId, rubroId, limit, offset]
    )) as any[];

    return filas.map((fila) => ({
      ...fila,
      rubro: JSON.parse(fila.rubro || '{}'),
      precios_mayoristas: JSON.parse(fila.precios_mayoristas || '[]'),
    })) as Producto[];
  } catch (error) {
    console.error('Error al obtener productos', error);
    return [];
  }
};

export const getProductosForRubro = async (rubroId: number, buscador: string): Promise<Producto[]> => {
  const db = await getDb();
  try {
    const filas = (await db.getAllAsync(
      `SELECT 
        p.id_producto,
        p.descripcion,
        p.codigo,
        p.id_rubro,
        p.precio,
        p.stock,
        p.imagen_local,
        (select json_object(
        'id_rubro', id_rubro,
        'nom_rubro', nom_rubro
        ) FROM rubros WHERE id_rubro = p.id_rubro) as rubro,
        (SELECT json_group_array(
          json_object(
            'id_precio_mayorista', id_precio_mayorista,
            'id_articulo', id_articulo,
            'precio_mayorista', precio_mayorista,
            'cant_mayorista', cant_mayorista
          )
        ) FROM precios_mayorista WHERE id_articulo = p.id_producto) as precios_mayoristas
      FROM productos p
      WHERE (p.descripcion LIKE ? OR p.codigo LIKE ?) AND p.id_rubro = ?
      ORDER BY p.descripcion;`,
      [`%${buscador}%`, `%${buscador}%`, rubroId]
    )) as any[];

    return filas.map((fila) => ({
      ...fila,
      rubro: JSON.parse(fila.rubro || '{}'),
      precios_mayoristas: JSON.parse(fila.precios_mayoristas || '[]'),
    })) as Producto[];
  } catch (error) {
    console.error('Error al obtener productos', error);
    return [];
  }
};

export interface RubroConProductos {
  id_rubro: number;
  nom_rubro: string;
  productos: Producto[];
}

export const getProductosAgrupadosPorRubro = async (): Promise<RubroConProductos[]> => {
  const db = await getDb();
  try {
    const filas = (await db.getAllAsync(
      `SELECT 
        p.id_producto,
        p.descripcion,
        p.codigo,
        p.id_rubro,
        p.precio,
        p.stock,
        p.imagen_local,
        COALESCE(r.nom_rubro, 'Sin Categoría') as nom_rubro,
        (SELECT json_group_array(
          json_object(
            'id_precio_mayorista', pm.id_precio_mayorista,
            'id_articulo', pm.id_articulo,
            'precio_mayorista', pm.precio_mayorista,
            'cant_mayorista', pm.cant_mayorista
          )
        ) FROM precios_mayorista pm WHERE pm.id_articulo = p.id_producto) as precios_mayoristas
      FROM productos p
      LEFT JOIN rubros r ON r.id_rubro = p.id_rubro
      ORDER BY r.nom_rubro ASC, p.descripcion ASC;`
    )) as any[];

    // Agrupamos los productos por su rubro
    const gruposMap = new Map<string, RubroConProductos>();

    filas.forEach((fila) => {
      const nom_rubro = fila.nom_rubro || 'Sin Categoría';
      if (!gruposMap.has(nom_rubro)) {
        gruposMap.set(nom_rubro, {
          id_rubro: fila.id_rubro || 0,
          nom_rubro,
          productos: [],
        });
      }

      gruposMap.get(nom_rubro)!.productos.push({
        id_producto: fila.id_producto,
        codigo: fila.codigo || '',
        descripcion: fila.descripcion,
        id_rubro: fila.id_rubro,
        precio: fila.precio,
        stock: fila.stock,
        imagen_local: fila.imagen_local || '',
        precioAux: fila.precio,
        precios_mayoristas: JSON.parse(fila.precios_mayoristas || '[]'),
      });
    });

    return Array.from(gruposMap.values());
  } catch (error) {
    console.error('Error al obtener productos agrupados por rubro', error);
    return [];
  }
};
