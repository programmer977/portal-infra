const form = document.querySelector<HTMLFormElement>("#new-ticket-form");
const list = document.querySelector<HTMLUListElement>("#ticket-list");
const feedback = document.querySelector<HTMLParagraphElement>("#feedback");
const reload = document.querySelector<HTMLButtonElement>("#reload");

if (!form || !list || !feedback || !reload) {
    throw new Error(
        "Elementos obrigatórios não encontrados no HTML"
    );
}

type Ticket = {
  id : number,
  title : string,
  description : string,
  status : "aberto"|"fechado",
  created_at : string;
};

async function api<T>(path:string,options?:RequestInit):Promise<T> {
    const response = await fetch(path,options);
    if(!response.ok){
      throw new Error(`Erro HTTP : ${response.status}`);
    }
    return await response.json() as T;
}

async function renderTickets():Promise<void> {
  try{
    const tickets = await api<Ticket[]>("/api/tickets");
    let count:number = 0;
    list?.replaceChildren();
    tickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  for(const ticket of tickets){
      const item = document.createElement("li");
      const title = document.createElement("strong");
      const createData = document.createElement("li");
      title.textContent = `${ticket.id} - ${ticket.title}`;
      const description = document.createElement("p");
      description.textContent = ticket.description;
      createData.textContent = ticket.created_at;
      const status = document.createElement("p");
      status.textContent =  `Status : ${ticket.status}`;
      if(ticket.status === "aberto"){
        count++;
      }
      item.append(title,description,status);
      list?.append(item);
  }
  const showCount = document.createElement("strong");
  showCount.textContent = `contagem total de chamadas abertas : ${count}`;

  if(tickets.length===0){
    if(feedback){
      feedback.textContent = "não há pedidos atualmente";
    }
  }
}
  catch (error) {
    if(feedback){
        feedback.textContent = error instanceof Error ? error.message : "Erro desconhecido";
      }
    }
}

form.addEventListener('submit', async(event)=>{
  event.preventDefault();
  const formData = new FormData(form);
  const title = String(formData.get("title")??"");
  const description = String(formData.get("description")??"");

  try{
    await api<Ticket>("/api/tickets",{ method:"POST", headers:{"Content-Type":"application/json"} ,
    body:JSON.stringify({title,description})
  });
  form.reset();
  feedback.textContent = "Chamado cadastrado com sucesso";
  await renderTickets();
} catch(error){
    feedback.textContent =
            error instanceof Error
                ? error.message
                : "Falha ao cadastrar chamado";

    }
  }
)