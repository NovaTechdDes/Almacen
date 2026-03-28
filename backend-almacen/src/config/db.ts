import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT!),
  options: {
    encrypt: false,
  },
};

export const pool = new sql.ConnectionPool(config);
export const poolConnect = pool.connect();
