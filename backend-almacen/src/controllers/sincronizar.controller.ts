import { Request, Response } from 'express';
import { sincronizar } from '../services';

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
    });
  } catch (error) {
    console.error('Error al sincronizar', error);
    res.status(500).json({ error: 'Error al sincronizar' });
  }
};
