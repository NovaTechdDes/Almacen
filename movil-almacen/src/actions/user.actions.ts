import { getDb } from "../db/db";
import { Vendedor } from "../interface";

export const getUsers = async (): Promise<Vendedor[]> => {
  const db = await getDb();
  try {
    const data = (await db.getAllAsync("SELECT * FROM vendedor")) as Vendedor[];
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
