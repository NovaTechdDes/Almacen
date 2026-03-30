import { Router } from 'express';
import { postSincronizar } from '../controllers';

const router = Router();

router.post('/', postSincronizar);

export default router;
