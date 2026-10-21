import test from "node:test";
import assert from "node:assert/strict";
import { ticketSchema } from "./validation.js";

test("deve aceitar um chamado válido", () => {
    const result = ticketSchema.safeParse({ title: "Servidor indisponível", description: "O servidor não responde"});
    assert.equal(result.success, true);
});

test("deve rejeitar título muito curto", () => {

    const result = ticketSchema.safeParse({ title: "A", description: "Descrição válida"});
    assert.equal(result.success, false);
});
test("deve rejeitar descrição vazia", () => {
    const result = ticketSchema.safeParse({ title: "Problema no servidor", description: ""});
    assert.equal(result.success, false);
});