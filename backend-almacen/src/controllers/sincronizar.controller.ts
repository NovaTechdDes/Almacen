import { Request, Response } from 'express';
import { sincronizar } from '../services';
import { obtenerProductos } from '../services/producto.service';
import { obtenerVendedores } from '../services/vendedor.service';
import { obtnenerRubros } from '../services/rubro.service';

export const postSincronizar = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await sincronizar(data);
    if (!result) {
      return res.status(500).json({ error: 'Error al sincronizar' });
    }
    res.status(200).json({
      ok: true,
      message: 'Sincronizacion exitosa',
      data: result,
    });
  } catch (error) {
    console.error('Error al sincronizar', error);
    res.status(500).json({ error: 'Error al sincronizar' });
  }
};

export const getObtenerDatos = async (req: Request, res: Response) => {
  try {
    const productos = await obtenerProductos();
    const rubros = await obtnenerRubros();
    if (!productos) {
      return res.status(500).json({ error: 'Error al obtener los datos' });
    }
    res.status(200).json({
      ok: true,
      message: 'Datos obtenidos exitosamente',
      data: { productos, rubros },
    });
  } catch (error) {
    console.error('Error al obtener los datos', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
};
