import pg from "pg";
import {config} from "./config.js";

export const pool = new pg.Pool({
    host:config.DB_HOST,
    port:config.DB_PORT,
    database:config.DB_NAME,
    user:config.DB_USER,
    password:config.DB_PASSWORD,
    max: 5,
    connectionTimeoutMillis: 3000
})

pool.on("error", (error)=>{
    console.error("Erro em conexão ociosa:", error);
})