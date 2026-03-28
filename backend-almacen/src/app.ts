import express from "express";
import cors from "cors";
import { pool } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "API Funcionando!!!" });
});

app.get("/test-db", async (_req, res) => {
  try {
    const result = await pool.request().query("SELECT GETDATE() as fecha");
    res.json(result.recordset);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
