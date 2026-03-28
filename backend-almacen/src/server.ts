import dotenv from "dotenv";
import app from "./app";
import { poolConnect } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await poolConnect;
    console.log(`Conectado a la base de datos de ${process.env.DB_NAME}`);
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
  }
}

startServer();
