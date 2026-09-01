# 🤖 Geo-Explorer — dio_explorer

> *Projeto prático desenvolvido com IBM Bob durante o curso **[IBM Bob: IA de Nível Empresarial para Desenvolvedores e Tech Leaders](https://web.dio.me/track/ibm-bob-ia-nivel-empresarial-para-desenvolvedores)** na [DIO (Digital Innovation One)](https://www.dio.me/).*

---

## 🎯 O que é o Geo-Explorer?

O **Geo-Explorer / dio_explorer** é uma ferramenta CLI + Servidor MCP que simula o ecossistema de aprendizado da DIO. Ele expõe quatro comandos interativos que você pode rodar direto no terminal ou integrar com qualquer agente de IA compatível com o protocolo MCP:

| Comando | Descrição |
|---|---|
| `/trilha <tecnologia>` | Busca e exibe o plano de estudos completo de uma trilha DIO |
| `/desafio <tecnologia> [nivel]` | Gera um desafio de código com enunciado, dicas e esqueleto |
| `/certificado <nome> "<trilha>" [--html]` | Emite um certificado com código de validação único (Markdown ou HTML) |
| `/progresso <nome>` | Exibe o progresso de aprendizado registrado localmente |

O projeto demonstra na prática como construir um agente assistido por IA, expor funcionalidades via **MCP (Model Context Protocol)** e garantir qualidade com **testes unitários automatizados**.

---

## 📁 Estrutura do Projeto

```
Geo-Explorer/
├── dio_explorer/
│   ├── commands/               ← Lógica dos slash commands (Node.js / CJS)
│   │   ├── index.js            ← Dispatcher principal
│   │   ├── trilha.js           ← Comando /trilha
│   │   ├── desafio.js          ← Comando /desafio
│   │   ├── certificado.js      ← Comando /certificado (Markdown + HTML)
│   │   └── progresso.js        ← Comando /progresso
│   ├── data/
│   │   ├── trilhas_dio.json    ← Catálogo com 30 trilhas DIO
│   │   ├── desafios_dio.json   ← Banco de desafios por tecnologia e nível
│   │   └── progresso.json      ← Registro local de progresso
│   ├── docs/                   ← Documentação técnica do projeto
│   │   ├── ARCHITECTURE.md     ← Arquitetura, fluxo de dados e decisões
│   │   ├── COMMANDS.md         ← Referência completa dos slash commands
│   │   ├── MCP_SERVER.md       ← Guia do servidor MCP
│   │   ├── TESTING.md          ← Guia de testes e cobertura
│   │   ├── INSIGHTS.md         ← Aprendizados e reflexões do projeto
│   │   └── certificados/       ← Certificados HTML gerados
│   ├── mcp/                    ← Servidor MCP (TypeScript / ESM)
│   │   ├── src/index.ts        ← Implementação do servidor
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── tests/
│   │   └── commands.test.js    ← 56 testes unitários (Jest)
│   ├── resultado_testes.txt    ← Relatório da última execução de testes
│   └── package.json            ← Dependências: Jest
└── README.md                   ← Este arquivo
```

---

## 🚀 Como executar o projeto

### Pré-requisitos

- **Node.js 18+**
- **npm**

### 1. Clone o repositório

```bash
git clone https://github.com/daniela-miranda-br/Geo-Explorer.git
cd Geo-Explorer/dio_explorer
```

### 2. Instale as dependências

```bash
npm install
```

---

## 💻 Como usar os comandos

Todos os comandos são executados a partir da pasta `dio_explorer/`:

### `/trilha` — Plano de Estudos

```bash
node commands/index.js /trilha java
node commands/index.js /trilha "spring boot"
node commands/index.js /trilha python
node commands/index.js /trilha react
node commands/index.js /trilha docker
```

### `/desafio` — Desafio de Código

```bash
# Nível sorteado automaticamente
node commands/index.js /desafio python

# Nível específico
node commands/index.js /desafio java Iniciante
node commands/index.js /desafio react Avançado
```

### `/certificado` — Emitir Certificado

```bash
# Certificado em Markdown (exibido no terminal)
node commands/index.js /certificado "Daniela Miranda" "Java Spring Boot"

# Certificado em HTML (salvo em docs/certificados/ e aberto no navegador)
node commands/index.js /certificado "Daniela Miranda" "Java Spring Boot" --html
```

> 💡 Com `--html`, o certificado é salvo em `docs/certificados/` e aberto automaticamente no seu navegador padrão.

### `/progresso` — Ver Progresso

```bash
node commands/index.js /progresso Daniela
```

### Ver todos os comandos disponíveis

```bash
node commands/index.js
```

---

## 🧪 Como executar os testes

```bash
# Dentro de dio_explorer/
cd dio_explorer

# Rodar todos os testes com relatório de cobertura
npm test

# Rodar sem cobertura (mais rápido)
npx jest

# Rodar em modo watch (re-executa ao salvar)
npx jest --watch

# Filtrar por comando específico
npx jest -t "/trilha"
```

### Resultado esperado

```
All files  |  95.09%  |  86.36%  |  100%  |  95.83%
```

- **56 testes unitários** — todos passando ✅
- **Cobertura: 95%+** em statements, funções e linhas (meta configurada: 70%)
- Framework: **Jest 29**

---

## 🏗️ Arquitetura

O projeto tem **três camadas** independentes:

```
CLI (index.js)  →  Commands (trilha / desafio / certificado / progresso)  →  Data (JSON)
                                        ↑
                              MCP Server (TypeScript)
                           expõe as mesmas funções via protocolo MCP
```

Leia mais em [`docs/ARCHITECTURE.md`](dio_explorer/docs/ARCHITECTURE.md).

---

## 🔌 Servidor MCP

O projeto inclui um **MCP Server** completo que expõe os três comandos principais como ferramentas consumíveis por qualquer agente compatível com o protocolo MCP (incluindo o IBM Bob).

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": ["/caminho/para/Geo-Explorer/dio_explorer/mcp/build/index.js"]
    }
  }
}
```

Leia mais em [`docs/MCP_SERVER.md`](dio_explorer/docs/MCP_SERVER.md).

---

## ✨ Melhorias que realizei

Além do projeto base do desafio, implementei as seguintes melhorias:

| Melhoria | Descrição |
|---|---|
| **Certificado HTML** | O comando `/certificado --html` gera um arquivo HTML estilizado e o **abre automaticamente no navegador** |
| **Comando `/progresso`** | Novo slash command que exibe o histórico de aprendizado do participante a partir de `data/progresso.json` |
| **Desafios em JSON** | Os desafios foram migrados de objetos hardcoded no código para um arquivo `data/desafios_dio.json`, facilitando a manutenção |
| **Parsing robusto de argumentos CLI** | O `index.js` foi corrigido para preservar tokens com espaços (ex: `"Daniela Miranda"`) ao reconstruir a string de args — evitando que nomes compostos fossem separados erroneamente |
| **Suporte a aspas em nome e trilha** | O `certificado.js` passou a reconhecer corretamente `"Nome Completo" "Trilha com Espaços"` via regex com múltiplos padrões de matching |
| **Testes de integração** | Adicionados testes que verificam o fluxo completo dos comandos, não apenas as funções isoladas |
| **Documentação completa** | Criados 5 documentos técnicos em `docs/`: ARCHITECTURE, COMMANDS, MCP_SERVER, TESTING e INSIGHTS |

---

## 📖 O que aprendi durante o desafio

Durante este projeto, aprendi na prática muito mais do que apenas escrever código. Aqui estão os principais aprendizados:

### 🗂️ Estrutura de projeto real
Entendi como organizar um projeto Node.js em camadas (dados, lógica, interface), separando responsabilidades entre arquivos. Antes eu via código como "um arquivo só" — agora enxergo módulos com contratos claros entre si.

### 🤖 Como integrar e usar o IBM Bob
Aprendi a trabalhar com o Bob como um **co-desenvolvedor**: delegar implementações, revisar o que foi gerado, questionar decisões de arquitetura e iterar. Percebi que saber *o que pedir* e *como verificar* é tão importante quanto saber programar.

### 🔌 O que é o protocolo MCP
Entendi o que é o Model Context Protocol e por que ele importa: é a "tomada padrão" que conecta ferramentas a agentes de IA. Implementar um servidor MCP real mostrou como funciona essa comunicação nos bastidores.

### 🌿 Como o Git é usado no dia a dia
Aprendi o fluxo real de Git: `add`, `commit` com mensagens descritivas, `push`, `.gitignore` para não subir arquivos desnecessários (como `node_modules/` e tokens). Cada commit conta a história do projeto.

### 🧪 Testes unitários na prática
Entendi por que testes não são "opcionais": eles documentam o comportamento esperado e alertam quando algo quebra. Ver 56 testes passando com 95% de cobertura foi uma das melhores sensações do projeto.

### 🏗️ Decisões de arquitetura têm motivo
Cada escolha — usar JSON estático em vez de banco de dados, CJS nos commands e TypeScript só no MCP server — foi uma decisão consciente com vantagens e desvantagens. Aprendi a perguntar "por que?" antes de aceitar qualquer estrutura.

### 📚 Documentação é parte do produto
Escrever os docs (`ARCHITECTURE.md`, `COMMANDS.md`, `TESTING.md`, `MCP_SERVER.md`, `INSIGHTS.md`) me fez entender o projeto de uma forma que só escrever código não teria feito. Documentar é também aprender.

---

## 📚 Documentação técnica

| Documento | Conteúdo |
|---|---|
| [`docs/ARCHITECTURE.md`](dio_explorer/docs/ARCHITECTURE.md) | Arquitetura, fluxo de dados e decisões técnicas |
| [`docs/COMMANDS.md`](dio_explorer/docs/COMMANDS.md) | Referência completa dos slash commands |
| [`docs/MCP_SERVER.md`](dio_explorer/docs/MCP_SERVER.md) | Guia do servidor MCP: uso, ferramentas, recursos |
| [`docs/TESTING.md`](dio_explorer/docs/TESTING.md) | Guia de testes, cobertura e boas práticas |
| [`docs/INSIGHTS.md`](dio_explorer/docs/INSIGHTS.md) | Insights técnicos e aprendizados profissionais |

---

## 🛠️ Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 18+ |
| Linguagem (commands) | JavaScript (CommonJS) |
| Linguagem (MCP server) | TypeScript (ESM, Node16) |
| Testes | Jest 29 |
| Protocolo IA | MCP — Model Context Protocol |
| Agente IA | IBM Bob |
| Dados | JSON estático |

---

## 🤝 Contribuição

Este projeto é um laboratório de aprendizado. Sinta-se à vontade para:
- Adicionar novas trilhas em `data/trilhas_dio.json`
- Adicionar novos desafios em `data/desafios_dio.json`
- Criar novos slash commands em `commands/`
- Expandir o servidor MCP com novos recursos
- Melhorar a cobertura de testes

---

<div align="center">

*Feito com 💙 pela Daniela, com a ajuda do IBM Bob*

**"A melhor forma de aprender é fazendo. E se tiver uma IA do seu lado, melhor ainda."**

</div>
