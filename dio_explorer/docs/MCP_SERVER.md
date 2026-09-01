# 🔌 Servidor MCP — dio_explorer

## O que é MCP?

**MCP (Model Context Protocol)** é um protocolo aberto desenvolvido pela Anthropic que padroniza a comunicação entre agentes de IA (como IBM Bob, Claude, etc.) e ferramentas externas. É análogo ao que REST/HTTP é para APIs web — mas para agentes de IA.

```
Agente de IA  ←──── MCP Protocol ────→  MCP Server  ←──→  Dados / Lógica
(IBM Bob)                               (dio_explorer)     (trilhas_dio.json)
```

---

## Localização

```
dio_explorer/mcp/
├── src/
│   └── index.ts        ← código-fonte TypeScript
├── build/
│   └── index.js        ← compilado pronto para uso
├── package.json
└── tsconfig.json
```

---

## Como iniciar o servidor

### Via stdio (padrão — para uso com IBM Bob ou qualquer cliente MCP local)

```bash
cd Dio-Class/dio_explorer/mcp
node build/index.js
```

O servidor escreve logs no `stderr` (não interfere com o protocolo MCP que usa `stdout`):

```
[dio-explorer-mcp] Servidor iniciado via stdio.
[dio-explorer-mcp] Ferramentas disponíveis: trilha | desafio | certificado
[dio-explorer-mcp] Recurso disponível: dio://trilhas
```

### Recompilar após mudanças

```bash
cd Dio-Class/dio_explorer/mcp
npm run build
```

---

## Registro no IBM Bob (mcp.json)

O servidor já está registrado em `.bob/mcp.json` na raiz do workspace:

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": [
        "C:\\bob teste\\Dio-Class\\dio_explorer\\mcp\\build\\index.js"
      ]
    }
  }
}
```

> O Bob detecta automaticamente o `mcp.json` na pasta `.bob/` do workspace e conecta o servidor ao iniciar.

---

## Ferramentas (Tools)

### `trilha`

Busca uma trilha DIO e retorna o plano de estudos completo.

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `tecnologia` | `string` | Sim | Termo de busca (ex: `"java"`, `"spring boot"`, `"python"`) |

**Exemplo de chamada MCP:**
```json
{
  "tool": "trilha",
  "arguments": {
    "tecnologia": "spring boot"
  }
}
```

**Resposta:** string Markdown com plano de estudos completo.

---

### `desafio`

Gera um desafio de código com enunciado, dicas e esqueleto.

**Parâmetros:**

| Campo | Tipo | Obrigatório | Valores |
|---|---|---|---|
| `tecnologia` | `string` | Sim | `"java"`, `"python"`, `"javascript"`, `"react"`, `"docker"`, ou qualquer string (fallback genérico) |
| `nivel` | `enum` | Não | `"Iniciante"` \| `"Intermediário"` \| `"Avançado"` |

**Exemplo de chamada MCP:**
```json
{
  "tool": "desafio",
  "arguments": {
    "tecnologia": "java",
    "nivel": "Iniciante"
  }
}
```

**Resposta:** string Markdown com o desafio gerado.

---

### `certificado`

Emite um certificado fictício DIO para um participante.

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `nome` | `string` | Sim | Nome completo do participante (ex: `"Daniela Miranda"`) |
| `trilha` | `string` | Sim | Nome ou tecnologia da trilha (busca automática no catálogo) |

**Exemplo de chamada MCP:**
```json
{
  "tool": "certificado",
  "arguments": {
    "nome": "Daniela Miranda",
    "trilha": "Java Spring Boot"
  }
}
```

**Resposta:** string Markdown com o certificado completo.

---

## Recurso (Resource)

### `dio://trilhas`

Lista resumida de todas as 30 trilhas do catálogo DIO.

**URI:** `dio://trilhas`  
**MIME Type:** `application/json`

**Exemplo de resposta:**
```json
[
  {
    "id": 6,
    "nome": "Java Spring Boot: APIs RESTful do Zero à Produção",
    "tecnologia": "Java / Spring Boot / REST",
    "nivel": "Intermediário",
    "xp_total": 13000,
    "numero_de_modulos": 16
  },
  ...
]
```

Esse recurso é útil para que o agente de IA descubra quais trilhas existem antes de chamar a tool `trilha`.

---

## Arquitetura Interna do Servidor

```typescript
// Interoperabilidade ESM ↔ CJS
const require = createRequire(import.meta.url);
const trilhaCmd = require("../commands/trilha.js");

// Servidor MCP
const server = new McpServer({ name: "dio-explorer", version: "1.0.0" });

server.registerTool("trilha",    { ... }, async ({ tecnologia }) => { ... });
server.registerTool("desafio",   { ... }, async ({ tecnologia, nivel }) => { ... });
server.registerTool("certificado", { ... }, async ({ nome, trilha }) => { ... });
server.registerResource("trilhas-disponiveis", "dio://trilhas", { ... }, async () => { ... });

// Transporte stdio
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Decisão-chave:** o servidor não reimplementa a lógica dos commands — ele simplesmente chama `trilhaCmd.run()`, `desafioCmd.run()` e `certCmd.run()`. Isso garante que qualquer melhoria nos commands é automaticamente refletida no servidor MCP.

---

## Tratamento de Erros

Todos os handlers seguem o padrão MCP de retornar `isError: true` em caso de falha, sem lançar exceções:

```typescript
try {
  const resultado = trilhaCmd.run(tecnologia);
  return { content: [{ type: "text", text: resultado }] };
} catch (error) {
  return {
    content: [{ type: "text", text: `Erro: ${error.message}` }],
    isError: true,   // ← sinaliza ao agente para tentar se recuperar
  };
}
```

Isso permite que o agente de IA tente corrigir o input ou informar o usuário sem interromper o fluxo.

---

## Expansão para HTTPS / SSO

O servidor atual usa **transporte stdio**, que é o padrão para uso local. Para expô-lo via HTTPS (ex: para acesso por múltiplos usuários ou integração com SSO):

### Opção 1 — Proxy HTTP simples

```
Internet ──HTTPS──▶ Nginx/Caddy ──▶ Express proxy ──stdio──▶ dio-explorer-mcp
                   (TLS + Auth)      (traduz HTTP→stdio)
```

### Opção 2 — HTTP Streamable Transport (MCP nativo)

O SDK MCP suporta `StreamableHTTPServerTransport`. Para migrar:

```typescript
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";

const app = express();

// Middleware de autenticação (JWT, OAuth, API Key)
app.use("/mcp", authMiddleware);

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => randomUUID() });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3000);
```

Registre no `mcp.json` com URL em vez de command/args:

```json
{
  "mcpServers": {
    "dio-explorer-remote": {
      "url": "https://seu-dominio.com/mcp",
      "headers": {
        "Authorization": "Bearer SEU_TOKEN"
      }
    }
  }
}
```

### Opção 3 — mcp-proxy (zero código extra)

```bash
npx mcp-proxy --port 3000 -- node build/index.js
```

Transforma qualquer servidor stdio em endpoint HTTP em um único comando.

---

## Dependências

| Pacote | Versão | Uso |
|---|---|---|
| `@modelcontextprotocol/sdk` | ^1.12.1 | Servidor MCP, transportes, tipos |
| `zod` | ^3.25.67 | Validação e tipagem dos parâmetros das tools |
| `typescript` | ^5.7.0 | Compilação (devDependency) |
| `@types/node` | ^22.0.0 | Tipos Node.js (devDependency) |
