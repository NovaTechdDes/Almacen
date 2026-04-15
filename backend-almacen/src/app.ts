import express from 'express';
import cors from 'cors';
import { pool } from './config/db';
import { clienteRoutes, sincronizarRoutes } from './routes';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/imagenes', express.static(path.join(process.cwd(), 'uploads')));

app.get('/test', async (_req, res) => {
  res.status(200).json({ ok: true, message: 'API funcionando correctamente' });
});

app.use('/sincronizar', sincronizarRoutes);
app.use('/clientes', clienteRoutes);
app.use('/obtener-datos', sincronizarRoutes);
app.get('/test-db', async (_req, res) => {
  try {
    const result = await pool.request().query('SELECT GETDATE() as fecha');
    res.json(result.recordset);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
