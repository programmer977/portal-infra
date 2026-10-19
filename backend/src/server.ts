import  Express  from "express";

const app = Express();

app.get("/", (req,res)=>{
    res.send("Servidor funcionando!");
})

app.listen(3000, ()=>{
    console.log("Servidor rodando na porta 3000!");
})

app.get("/sobre" ,()=>{
    console.log("rota GET definida!");
})

app.get("/status" , ()=>{
    return console.log({
  "status": "online",
  "service": "portal-infra"
})
})