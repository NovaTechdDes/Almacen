import express from 'express';
import cors from 'cors';
import { pool } from './config/db';
import { clienteRoutes, sincronizarRoutes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/sincronizar', sincronizarRoutes);
app.use('/clientes', clienteRoutes);

app.get('/test-db', async (_req, res) => {
  try {
    const result = await pool.request().query('SELECT GETDATE() as fecha');
    res.json(result.recordset);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
