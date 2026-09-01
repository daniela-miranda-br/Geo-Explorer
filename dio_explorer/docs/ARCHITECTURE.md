# 🏗️ Arquitetura — dio_explorer

## Visão Geral

O **dio_explorer** é organizado em três camadas independentes que se comunicam de forma clara e sem acoplamento desnecessário:

```
┌─────────────────────────────────────────────────────┐
│                    CONSUMIDORES                      │
│                                                      │
│   CLI (terminal)        MCP Client (IBM Bob, etc.)   │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐   ┌──────────────────────────────┐
│  commands/       │   │  mcp/build/index.js           │
│  index.js        │   │  (MCP Server — TypeScript)    │
│  (Dispatcher)    │   │                               │
└────────┬─────────┘   └──────────────┬───────────────┘
         │                             │
         ▼                             │
┌────────────────────────────────────────────────────┐
│              CAMADA DE LÓGICA (commands/)           │
│                                                     │
│  trilha.js  desafio.js  certificado.js  progresso.js│
└────────────────────────┬───────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  data/               │
              │  trilhas_dio.json    │
              │  (fonte de dados)    │
              └──────────────────────┘
```

---

## Camadas em Detalhe

### 1. Camada de Dados — `data/trilhas_dio.json`

Fonte de verdade do projeto. Um arquivo JSON estático com **30 trilhas DIO** contendo:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Identificador único |
| `nome` | string | Nome completo da trilha |
| `tecnologia` | string | Stack (ex: "Java / Spring Boot / REST") |
| `nivel` | string | Iniciante / Intermediário / Avançado |
| `numero_de_modulos` | number | Quantidade de módulos |
| `xp_total` | number | XP acumulado ao concluir |
| `badges_disponiveis` | string[] | Badges conquistáveis |
| `promocoes` | object \| null | Desconto e validade (quando disponível) |
| `live_ao_vivo` | boolean | Tem aulas ao vivo |
| `vitalicio` | boolean | Acesso vitalício |
| `url` | string | Link da trilha na DIO |

**Decisão de design:** dados estáticos em JSON foram escolhidos intencionalmente para manter o projeto zero-dependência de banco de dados — perfeito para aprendizado e demonstração.

---

### 2. Camada de Lógica — `commands/`

Cada arquivo implementa um slash command como um módulo Node.js CommonJS (CJS) independente.

#### `commands/index.js` — Dispatcher

```
Input string  →  extrai comando (/trilha, /desafio, /certificado)
              →  roteia para o handler correto
              →  retorna string formatada em Markdown
```

Responsabilidades:
- Parsear o input bruto (`"/trilha java"`)
- Resolver qual handler chamar
- Retornar mensagem de ajuda (`AJUDA()`) quando o input é vazio ou inválido
- **Não** contém lógica de negócio — apenas despacha

#### `commands/trilha.js`

Fluxo interno:
1. `buscarTrilha(tecnologia)` — lê o JSON e faz busca por substring no nome e tecnologia (case-insensitive)
2. `gerarPlanoDeEstudos(trilha)` — formata o resultado em Markdown com emojis, módulos gerados dinamicamente e badges

**Detalhe importante:** os módulos são gerados a partir de uma lista de 20 nomes pré-definidos, ciclados pelo operador `% nomes.length` — sem necessidade de dados de módulo no JSON.

#### `commands/desafio.js`

Fluxo interno:
1. `resolverNivel(nivelArg)` — mapeia o argumento para Iniciante/Intermediário/Avançado (ou sorteia se omitido)
2. `encontrarDesafio(tecnologia, nivel)` — encontra no dicionário `DESAFIOS` pelo nome da tecnologia normalizado; cai no `FALLBACK_DESAFIOS` se não encontrado
3. `formatarDesafio(desafio, tecnologia, nivel)` — formata com seed aleatório, emojis e bloco de código

Tecnologias suportadas com desafios específicos: `javascript`, `python`, `java`, `react`, `docker`.

#### `commands/certificado.js`

Fluxo interno:
1. `run(args)` — parseia `<nome> "<trilha>" [--html]` via regex com quatro padrões (ambos com aspas / só nome / só trilha / sem aspas)
2. `buscarTrilha(trilhaArg)` — reusa a função de `trilha.js` para encontrar info enriquecida
3. `gerarCodigoValidacao(nome, trilha)` — hash djb2 do par nome+trilha+timestamp, formatado como `DIO-XXXX-XXXX-NNNN`
4. `gerarCertificado(nome, nomeTrilha, trilhaInfo)` — monta o documento Markdown
5. `gerarCertificadoHTML(nome, nomeTrilha, trilhaInfo)` — gera HTML estilizado completo (com `--html`)
6. `salvarHTML(nome, nomeTrilha, html)` — salva o arquivo em `docs/certificados/` e abre no navegador via `execSync`

#### `commands/progresso.js`

Fluxo interno:
1. `run(args)` — recebe o nome do participante
2. Lê `data/progresso.json` para exibir o histórico de trilhas concluídas e XP acumulado

---

### 3. Camada MCP — `mcp/`

Um servidor MCP escrito em **TypeScript/ESM** que **reutiliza** os módulos CJS da camada de lógica via `createRequire`.

#### Por que TypeScript aqui e não nos commands?

Os `commands/` foram escritos em JavaScript puro para demonstrar que **boas práticas de programação não dependem da linguagem**. O servidor MCP usa TypeScript para demonstrar tipagem estática em um contexto de integração de sistemas — que é onde os tipos trazem maior valor.

#### Estratégia de interoperabilidade ESM ↔ CJS

```typescript
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const trilhaCmd = require("../commands/trilha.js");
```

Esse padrão permite que o servidor MCP (ESM) consuma módulos CommonJS sem reescrever a lógica existente — técnica comum em projetos reais que migram gradualmente para ESM.

#### Ferramentas registradas

| Tool MCP | Parâmetros | Mapeia para |
|---|---|---|
| `trilha` | `tecnologia: string` | `trilhaCmd.run(tecnologia)` |
| `desafio` | `tecnologia: string`, `nivel?: enum` | `desafioCmd.run(args)` |
| `certificado` | `nome: string`, `trilha: string` | `certCmd.run(args)` |

#### Recurso registrado

| URI | Tipo | Descrição |
|---|---|---|
| `dio://trilhas` | `application/json` | Lista resumida das 30 trilhas |

---

## Fluxo de Dados — Exemplo completo

**Usuário digita:** `/trilha spring boot`

```
1. CLI:        process.argv → "spring boot" → dispatch("/trilha spring boot")
2. index.js:   extrai comando="/trilha", args="spring boot" → trilha.run("spring boot")
3. trilha.js:  buscarTrilha("spring boot")
               → readFileSync("trilhas_dio.json")
               → JSON.parse → array de 30 trilhas
               → find: t.nome.includes("spring boot") || t.tecnologia.includes("spring boot")
               → match: id=6, "Java Spring Boot: APIs RESTful do Zero à Produção"
4. trilha.js:  gerarPlanoDeEstudos(trilha)
               → monta string Markdown com módulos, badges, XP
5. index.js:   console.log(resultado)
```

---

## Decisões de Design

| Decisão | Alternativa considerada | Razão da escolha |
|---|---|---|
| Dados em JSON estático | Banco de dados (SQLite, MongoDB) | Reduz dependências; foco no aprendizado do protocolo |
| Módulos CommonJS nos commands | TypeScript + ESM | Menor barreira de entrada para iniciantes |
| TypeScript só no MCP server | JavaScript em tudo | Demonstra quando e por que usar TS |
| Teste por função pública | Teste de integração E2E | Mais rápido e isolado; permite testar cada caso |
| Fallback de desafio | Erro para tecnologia desconhecida | Melhor UX — sempre entrega valor |
| Hash djb2 para código de validação | UUID | Demonstra como gerar IDs determinísticos |
