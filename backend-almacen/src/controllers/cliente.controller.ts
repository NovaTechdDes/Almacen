import { obtenerClientes } from "../services/clientes.service";
import { Request, Response } from "express";

export const getAllClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await obtenerClientes();
    res.status(200).json({
      ok: true,
      clientes,
    });
  } catch (error) {
    console.error("Error al obtener los clientes", error);
    res.status(500).json({ message: "Error al obtener los clientes" });
  }
};
