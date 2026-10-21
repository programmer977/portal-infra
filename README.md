# Portal Infra — Portal Corporativo de Chamados de TI

Aplicação web Fullstack para **registrar e consultar chamados de TI**. O frontend permite cadastrar chamados, visualizar os registros, consultar a data e o status de cada chamado e acompanhar a quantidade de chamados abertos. Os dados são armazenados em um banco PostgreSQL por meio de uma API construída com Node.js, Express e TypeScript.

Este repositório contém **a aplicação e seu esquema SQL**. Configurações de infraestrutura, implantação em servidores, segmentação de redes, HTTPS e serviços como Nginx e Samba **não fazem parte do código versionado nesta etapa**.

## Tecnologias utilizadas

| Camada | Tecnologias |
|---|---|
| Frontend | HTML, CSS, TypeScript e Vite |
| Backend | Node.js, TypeScript e Express 5 |
| Banco de dados | PostgreSQL e driver `pg` |
| Validação | Zod |
| Testes existentes | `node:test` e `node:assert/strict` |

## Funcionalidades implementadas

- Cadastro de chamados com título e descrição.
- Listagem dos **até 100 chamados** mais recentes por identificador, conforme consulta da API.
- Exibição da descrição, data de criação e status de cada chamado.
- Contagem de chamados abertos entre os registros retornados pela API.
- Atualização manual da listagem pelo frontend.
- Endpoint da API para alterar o status de um chamado para `aberto` ou `resolvido` (a interface ainda não oferece essa ação).
- Validação das entradas recebidas pela API e consultas SQL parametrizadas.

## Estrutura do projeto

```text
portal-infra/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts             # Rotas HTTP e tratamento de erros
│       ├── server.ts          # Inicialização do servidor Express
│       ├── config.ts          # Leitura e validação do ambiente
│       ├── db.ts              # Pool de conexões PostgreSQL
│       ├── validation.ts      # Schemas Zod
│       └── testValidation.ts  # Testes de validação
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       └── main.ts            # DOM, chamadas HTTP e formulários
├── db/
│   └── 001_schema.sql         # Estrutura da tabela tickets
├── .gitignore
└── README.md
```

## Pré-requisitos

- Node.js e npm compatíveis com as dependências declaradas em `backend/package.json` e `frontend/package.json`.
- PostgreSQL instalado e em execução.
- Git para clonar o repositório.

As instruções abaixo ilustram uma execução local em um ambiente Linux com acesso ao comando `psql`. A criação do banco e do usuário **não é automatizada pelo repositório**.

## Configuração do banco de dados

Na raiz do repositório, abra o console administrativo do PostgreSQL:

```bash
sudo -u postgres psql
```

Crie a conta e o banco utilizados pela aplicação, substituindo a senha de exemplo:

```sql
CREATE ROLE portal_app WITH LOGIN PASSWORD 'SUBSTITUA_POR_UMA_SENHA_FORTE';
CREATE DATABASE portal_infra;
\q
```

Execute o arquivo SQL já incluído no projeto:

```bash
sudo -u postgres psql -d portal_infra -f db/001_schema.sql
```

Conceda as permissões necessárias à conta da aplicação:

```bash
sudo -u postgres psql -d portal_infra
```

```sql
GRANT CONNECT ON DATABASE portal_infra TO portal_app;
GRANT USAGE ON SCHEMA public TO portal_app;
GRANT SELECT, INSERT, UPDATE ON TABLE tickets TO portal_app;
\q
```

O esquema define a tabela `tickets` com os campos `id`, `title`, `description`, `status` e `created_at`. O status inicial de um chamado é `aberto`; os valores válidos são `aberto` e `resolvido`.

> As instruções de criação de usuário e concessão de privilégios são passos de configuração do ambiente; somente a criação da tabela está no arquivo `db/001_schema.sql` do repositório.

## Configuração do backend

Na raiz do repositório:

```bash
cd backend
npm ci
cp .env.example .env
```

Edite o arquivo `.env` e configure as credenciais criadas no PostgreSQL:

```dotenv
HOST=127.0.0.1
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=portal_infra
DB_USER=portal_app
DB_PASSWORD=SUBSTITUA_PELA_SENHA_CONFIGURADA
```

**Não envie o arquivo `.env` ao Git.** O `.gitignore` já impede seu versionamento em condições normais.

Inicie o backend em modo de desenvolvimento:

```bash
npm run dev
```

A configuração de exemplo disponibiliza a API em `http://127.0.0.1:3000`.

Para compilar e executar o JavaScript gerado:

```bash
npm run build
npm start
```

## Configuração do frontend

Em outro terminal, a partir da raiz do repositório:

```bash
cd frontend
npm ci
npm run dev
```

Acesse o endereço indicado pelo Vite (normalmente `http://localhost:5173`).

O arquivo `frontend/vite.config.ts` encaminha as requisições iniciadas por `/api` ao backend em `http://127.0.0.1:3000` **durante o desenvolvimento**. Por isso, mantenha o backend em execução ao testar as operações da interface.

Para gerar os arquivos estáticos:

```bash
npm run build
```

O resultado é criado no diretório `frontend/dist/`, ignorado pelo Git. O repositório **não contém configuração de servidor web para publicar esse build**. O proxy definido em `server.proxy` no Vite aplica-se ao servidor de desenvolvimento, não constitui um proxy de implantação para o build final.

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/tickets` | Lista até 100 chamados, ordenados por `id` decrescente |
| `POST` | `/api/tickets` | Cria um chamado com título e descrição |
| `PATCH` | `/api/tickets/:id/status` | Atualiza o status de um chamado |

### Criar chamado

```bash
curl -i -X POST http://127.0.0.1:3000/api/tickets \
  -H 'Content-Type: application/json' \
  -d '{"title":"Falha no DNS","description":"O servidor não resolve nomes internos."}'
```

A API retorna `201 Created` quando o registro é inserido com sucesso.

### Listar chamados

```bash
curl http://127.0.0.1:3000/api/tickets
```

### Atualizar status

Substitua `1` por um identificador existente:

```bash
curl -i -X PATCH http://127.0.0.1:3000/api/tickets/1/status \
  -H 'Content-Type: application/json' \
  -d '{"status":"resolvido"}'
```

O backend valida o identificador e os dados enviados. Retorna `404` quando o chamado solicitado para atualização não existe, e `400` em casos de validação inválida. Erros internos são tratados com resposta `500`.

## Validação e testes

No backend, os schemas do Zod exigem:

| Campo | Regra |
|---|---|
| `title` | Texto entre 3 e 100 caracteres, após `trim()` |
| `description` | Texto entre 10 e 1000 caracteres, após `trim()` |
| `status` | Apenas `aberto` ou `resolvido` |

Os testes automatizados existentes verificam a aceitação de um chamado válido e a rejeição de título curto e descrição vazia.

Execute:

```bash
cd backend
npm ci
npm test
```

Esses são **testes de validação**. O repositório ainda não contém testes automatizados de integração HTTP/PostgreSQL.

## Limitações atuais

- A interface permite **cadastrar e listar**, mas não disponibiliza um controle para acionar a rota de atualização de status.
- A contagem de chamados abertos é calculada no frontend sobre os registros retornados pela API, limitada à consulta de até 100 chamados.
- O HTML permite até 120 caracteres no título, mas a API e o esquema SQL limitam esse campo a 100; títulos entre 101 e 120 caracteres serão rejeitados pelo backend.
- O sistema não possui autenticação nem autorização de usuários na API.
- Ainda não há configuração versionada de deploy, HTTPS, Nginx, firewall ou segmentação de rede.

## Repositório

Código-fonte: [github.com/programmer977/portal-infra](https://github.com/programmer977/portal-infra)
