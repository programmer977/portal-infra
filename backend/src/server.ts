import  Express  from "express";

const app = Express();

app.get("/", (req,res)=>{
    res.send("Servidor funcionando!");
})

app.listen(3000, ()=>{
    console.log("Servidor rodando na porta 3000!");
})
