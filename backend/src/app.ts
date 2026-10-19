import  express  from "express";
import {pool} from "./db.js";

export const app = express();

app.use(express.json());

app.get("/api/tickets", async (req,res)=>{
    const result = await pool.query(`SELECT id, title, description, status, created_at 
        FROM tickets 
        ORDER BY id DESC LIMIT 100`);
    res.json(result.rows);
})