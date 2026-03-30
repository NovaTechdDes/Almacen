import { Router } from "express";
import { getAllClientes } from "../controllers/cliente.controller";

const router = Router();

router.get("/", getAllClientes);

export default router;
