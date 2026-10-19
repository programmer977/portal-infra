import "dotenv/config";
import { z } from "zod";

const envSchema = z.object ({
    HOST: z.string().default("127.0.0.1"),
    PORT: z.coerce.number().int().default(3000),
    DB_HOST : z.string().min(1),
    DB_PORT : z.coerce.number().int().default(5432),
    DB_NAME : z.string().min(1),
    DB_USER : z.string().min(1),
    DB_PASSWORD : z.string().min(1)
})

export const config = envSchema.parse(process.env);