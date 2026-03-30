import { Router } from 'express';
import { getObtenerDatos, postSincronizar } from '../controllers/sincronizar.controller';

const router = Router();

router.get('/', getObtenerDatos);
router.post('/', postSincronizar);

export default router;
