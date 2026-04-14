import { Router } from 'express';
import { createCliente, getAllClientes } from '../controllers/cliente.controller';

const router = Router();

router.get('/', getAllClientes);
router.post('/', createCliente);

export default router;
