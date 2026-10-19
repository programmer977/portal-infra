import {z} from "zod";

export const ticketSchema = z.object ({
    title:z.string().trim().min(3).max(100),
    description:z.string().trim().min(10).max(1000),
}).strict();

export const updateTicketSchema = z.object({
    status: z.enum(["aberto", "resolvido"])
}).strict();