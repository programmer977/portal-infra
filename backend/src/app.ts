import  express  from "express";
import {pool} from "./db.js";
import {ticketSchema,updateTicketSchema} from "./validation.js";

export const app = express();

app.use(express.json());

app.get("/api/tickets", async (req,res)=>{
    const result = await pool.query(`SELECT id, title, description, status, created_at 
        FROM tickets 
        ORDER BY id DESC LIMIT 100`);
    res.json(result.rows);
})

app.post("/api/tickets", async (req,res)=>{
    const {title , description}=ticketSchema.parse(req.body);
    const result = await pool.query(`INSERT INTO tickets (title, description)
         VALUES ($1, $2)
         RETURNING id, title, description, status, created_at`, [title,description]);
         res.status(201).json(result.rows);
})

app.patch("/api/tickets/:id/status",async (req,res)=>{
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        res.status(400).json({
            error: "Identificador inválido"
        });
        return;
    }
    const { status } = updateTicketSchema.parse(req.body);
    const result = await pool.query(`UPDATE tickets SET status=$1 WHERE id=$2
        RETURNING id, title, description, status, created_at`, [status,id]);
    if (result.rowCount === 0) {
        res.status(404).json({
            error: "Chamado não encontrado"
        });
        return;
    }
    res.json(result.rows[0]);
})