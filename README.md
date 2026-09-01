# 🤖 Dio-Class — dio_explorer

> *Projeto prático desenvolvido com IBM Bob durante o curso **[IBM Bob: IA de Nível Empresarial para Desenvolvedores e Tech Leaders](https://web.dio.me/track/ibm-bob-ia-nivel-empresarial-para-desenvolvedores)** na [DIO (Digital Innovation One)](https://www.dio.me/).*

---

## 🎯 O que é este projeto?

O **dio_explorer** é uma ferramenta CLI + Servidor MCP que simula o ecossistema de aprendizado da DIO. Ele expõe três comandos interativos:

| Comando | Descrição |
|---|---|
| `/trilha <tecnologia>` | Busca e exibe o plano de estudos de uma trilha DIO |
| `/desafio <tecnologia> [nivel]` | Gera um desafio de código com enunciado, dicas e esqueleto |
| `/certificado <nome> "<trilha>"` | Emite um certificado fictício com código de validação único |

O projeto demonstra na prática como construir um agente de IA assistida, expor funcionalidades via **MCP (Model Context Protocol)** e garantir qualidade com **testes unitários automatizados**.

---

## 📁 Estrutura do Projeto

```
Dio-Class/
├── dio_explorer/
│   ├── commands/               ← Lógica dos slash commands (Node.js/CJS)
│   │   ├── index.js            ← Dispatcher principal
│   │   ├── trilha.js           ← Comando /trilha
│   │   ├── desafio.js          ← Comando /desafio
│   │   └── certificado.js      ← Comando /certificado
│   ├── data/
│   │   └── trilhas_dio.json    ← Catálogo com 30 trilhas DIO
│   ├── docs/                   ← Documentação do projeto
│   │   ├── ARCHITECTURE.md
│   │   ├── COMMANDS.md
│   │   ├── MCP_SERVER.md
│   │   ├── TESTING.md
│   │   └── INSIGHTS.md
│   ├── mcp/                    ← Servidor MCP (TypeScript/ESM)
│   │   ├── src/index.ts        ← Implementação do servidor
│   │   ├── build/index.js      ← Build compilado (pronto para uso)
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── tests/
│   │   └── commands.test.js    ← 56 testes unitários (Jest)
│   ├── resultado_testes.txt    ← Relatório da última execução de testes
│   └── package.json            ← Deps: Jest
└── README.md                   ← Este arquivo
```

---

## 🚀 Como usar

### Pré-requisitos
- Node.js 18+
- npm

### Instalação

```bash
cd Dio-Class/dio_explorer
npm install
```

### Usando via CLI

```bash
# Consultar trilha
node commands/index.js /trilha java

# Gerar desafio
node commands/index.js /desafio python Iniciante

# Emitir certificado
node commands/index.js /certificado "Daniela Miranda" "Java Spring Boot: APIs RESTful do Zero à Produção"
```

### Rodando os testes

```bash
npm test
```

---

## 🏗️ Arquitetura

O projeto tem **três camadas**:

```
CLI (index.js)  →  Commands (trilha/desafio/certificado)  →  Data (trilhas_dio.json)
                                  ↑
                        MCP Server (TypeScript)
                     expõe as mesmas funções via protocolo MCP
```

Leia mais em [`docs/ARCHITECTURE.md`](dio_explorer/docs/ARCHITECTURE.md).

---

## 🔌 Servidor MCP

O projeto inclui um **MCP Server** completo que expõe os três comandos como ferramentas consumíveis por qualquer agente compatível com o protocolo MCP (incluindo IBM Bob).

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": ["/caminho/para/Dio-Class/dio_explorer/mcp/build/index.js"]
    }
  }
}
```

Leia mais em [`docs/MCP_SERVER.md`](dio_explorer/docs/MCP_SERVER.md).

---

## 🧪 Testes

- **56 testes unitários** cobrindo 100% das funções públicas
- **Cobertura de 95%+** em statements e linhas (meta: 70%)
- Framework: **Jest**

```
All files  |  95.09%  |  86.36%  |  100%  |  95.83%
```

Leia mais em [`docs/TESTING.md`](dio_explorer/docs/TESTING.md).

---

## 📚 Documentação

| Documento | Conteúdo |
|---|---|
| [`docs/ARCHITECTURE.md`](dio_explorer/docs/ARCHITECTURE.md) | Arquitetura, fluxo de dados e decisões técnicas |
| [`docs/COMMANDS.md`](dio_explorer/docs/COMMANDS.md) | Referência completa dos slash commands |
| [`docs/MCP_SERVER.md`](dio_explorer/docs/MCP_SERVER.md) | Guia do servidor MCP: uso, ferramentas, recursos |
| [`docs/TESTING.md`](dio_explorer/docs/TESTING.md) | Guia de testes, cobertura e boas práticas |
| [`docs/INSIGHTS.md`](dio_explorer/docs/INSIGHTS.md) | Insights e aprendizados para profissionais |

---

## 🛠️ Stack Tecnológica

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
- Criar novos slash commands em `commands/`
- Expandir o servidor MCP com novos recursos
- Melhorar a cobertura de testes

---

<div align="center">

*Feito com 💙 pela Daniela, com a ajuda do IBM Bob*

**"A melhor forma de aprender é fazendo. E se tiver uma IA do seu lado, melhor ainda."**

</div>
