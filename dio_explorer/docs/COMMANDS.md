# 📖 Referência dos Slash Commands — dio_explorer

## Como usar via CLI

```bash
# Sintaxe geral
node commands/index.js <comando> [argumentos]

# Ou diretamente pelo dispatcher
node -e "const {dispatch} = require('./commands/index'); console.log(dispatch('/trilha java'));"
```

---

## `/trilha` — Plano de Estudos

### Sintaxe

```
/trilha <tecnologia>
```

### Descrição

Busca no catálogo de trilhas DIO (`data/trilhas_dio.json`) e retorna um plano de estudos completo com:
- Nível e stack da trilha
- Lista de módulos gerada dinamicamente
- Badges disponíveis
- XP total e informações de acesso
- Promoção ativa (quando disponível)

### Parâmetros

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `tecnologia` | Sim | Termo de busca. Pesquisa no nome e tecnologia da trilha (substring, case-insensitive) |

### Exemplos

```bash
node commands/index.js /trilha java
node commands/index.js /trilha spring boot
node commands/index.js /trilha python
node commands/index.js /trilha react
node commands/index.js /trilha aws
node commands/index.js /trilha docker
node commands/index.js /trilha flutter
node commands/index.js /trilha rust
node commands/index.js /trilha go
node commands/index.js /trilha typescript
```

### Saída de exemplo

```markdown
# 📚 Plano de Estudos — Java Spring Boot: APIs RESTful do Zero à Produção

🟡 **Nível:** Intermediário
🛠️ **Tecnologia:** Java / Spring Boot / REST
📦 **Módulos:** 16
⭐ **XP Total:** 13.000 XP
♾️ **Acesso Vitalício:** Sim
🎥 **Live ao Vivo:** Sim
🔗 **URL:** https://web.dio.me/play
🏷️ **Promoção:** 10% de desconto até 2026-04-01

---

## 🗺️ Módulos da Trilha

  1. Introdução e Fundamentos
  2. Configuração do Ambiente
  ...
  16. Monitoramento e Observabilidade

---

## 🏅 Badges Disponíveis

- 🎖️ Java Champion
- 🎖️ Spring Master
- 🎖️ API Builder
```

### Comportamentos especiais

| Situação | Resultado |
|---|---|
| Tecnologia não encontrada | Mensagem de erro com sugestões |
| Args vazio ou null | Instrução de uso |
| Busca case-insensitive | `JAVA` == `java` == `Java` |
| Múltiplos termos | `/trilha spring boot` funciona |

---

## `/desafio` — Desafio de Código

### Sintaxe

```
/desafio <tecnologia> [nivel]
```

### Descrição

Gera um desafio de código aleatório com enunciado, dicas e esqueleto de código pronto para ser preenchido.

### Parâmetros

| Parâmetro | Obrigatório | Valores possíveis |
|---|---|---|
| `tecnologia` | Sim | Qualquer string; suporte completo para: `javascript`, `python`, `java`, `react`, `docker` |
| `nivel` | Não | `iniciante`, `intermediário`, `intermediario`, `avançado`, `avancado` |

> Se `nivel` for omitido, um nível é **sorteado aleatoriamente**.

### Tecnologias com desafios específicos

| Tecnologia | Iniciante | Intermediário | Avançado |
|---|---|---|---|
| `javascript` | Contador de Vogais, FizzBuzz | Debounce Function | Event Emitter do Zero |
| `python` | Palíndromo | Decorador de Log | Pipeline de Dados Assíncrono |
| `java` | Fibonacci Iterativo | Builder Pattern | Thread Pool do Zero |
| `react` | Contador Interativo | Hook useFetch | Gerenciador de Estado Global |
| `docker` | Dockerizando uma API | Docker Compose com DB | Otimização Multi-stage |

> Para tecnologias não listadas, um desafio **fallback genérico** é entregue (Hello World com Estilo / API REST / Cache LRU).

### Exemplos

```bash
node commands/index.js /desafio java
node commands/index.js /desafio java Iniciante
node commands/index.js /desafio python Avançado
node commands/index.js /desafio react intermediário
node commands/index.js /desafio docker
node commands/index.js /desafio golang           # usa fallback genérico
```

### Saída de exemplo

```markdown
# ⚔️ Desafio DIO — Fibonacci Iterativo

🟢 **Nível:** Iniciante
🛠️ **Tecnologia:** java
🎲 **Seed:** #4731

---

## 📋 Enunciado

Implemente o cálculo do N-ésimo número de Fibonacci de forma iterativa.

---

## 💡 Dicas

1. Evite recursão para não estourar a pilha
2. Use duas variáveis para guardar os últimos dois valores

---

## 🧩 Esqueleto de Código

```java
public class Fibonacci {
    public static long calcular(int n) {
        // seu código aqui
        return 0;
    }
}
```
```

---

## `/certificado` — Emissão de Certificado

### Sintaxe

```
/certificado <nome> "<trilha>" [--html]
/certificado <nome> <tecnologia> [--html]
```

### Descrição

Emite um certificado com:
- Código de validação único gerado por hash (`DIO-XXXX-XXXX-NNNN`)
- Data de emissão
- XP conquistado
- Badges da trilha (quando encontrada no catálogo)
- Assinaturas do participante e do IBM Bob

Com a flag `--html`, gera um **arquivo HTML estilizado** salvo em `docs/certificados/` e o abre automaticamente no navegador padrão.

### Parâmetros

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `nome` | Sim | Nome completo do participante (use aspas para nomes com espaço) |
| `trilha` | Sim | Nome da trilha (com aspas) ou tecnologia (sem aspas para busca automática) |
| `--html` | Não | Gera e abre o certificado em HTML estilizado |

### Exemplos

```bash
# Markdown no terminal (padrão)
node commands/index.js /certificado "Daniela Miranda" "Java Spring Boot"

# HTML — salvo em docs/certificados/ e aberto no navegador
node commands/index.js /certificado "Daniela Miranda" "Java Spring Boot" --html

# Com tecnologia como busca
node commands/index.js /certificado "João Silva" java --html

# Nome simples
node commands/index.js /certificado Daniela python
```

### Como o código de validação é gerado

```
base  = "<nome>-<trilha>-<timestamp>"
hash  = djb2(base)         ← determinístico por input
code  = DIO-{hash[0:4]}-{hash[4:8]}-{random 4 digits}
```

O componente aleatório final (`NNNN`) garante que cada emissão do mesmo certificado tenha um código diferente — simulando o comportamento de sistemas reais de emissão.

### Comportamento de resolução de trilha

```
/certificado Daniela "Java Spring Boot"
        ↓
buscarTrilha("Java Spring Boot")
        ↓
encontrou? → usa xp_total, tecnologia, nivel e badges da trilha
não encontrou? → usa o argumento literal como nomeTrilha, XP = "N/A"
```

---

## Dispatcher — `commands/index.js`

O dispatcher é o ponto de entrada para qualquer consumidor (CLI, MCP, testes).

```javascript
const { dispatch } = require("./commands/index");

dispatch("/trilha java");        // retorna string Markdown
dispatch("/desafio python");     // retorna string Markdown
dispatch("/certificado X Y");    // retorna string Markdown
dispatch("");                    // retorna texto de ajuda
dispatch(null);                  // retorna texto de ajuda
dispatch("/foobar");             // retorna erro + ajuda
```

### Regras de parsing

```
input: "/trilha spring boot"
         │
         ├── primeiroEspaco = indexOf(" ") = 7
         ├── comando = input.slice(0, 7) = "/trilha"
         └── args    = input.slice(8)    = "spring boot"
```

O comando é normalizado com `.toLowerCase()` antes da lookup, tornando `/TRILHA`, `/Trilha` e `/trilha` equivalentes.

---

## `/progresso` — Progresso de Aprendizado

### Sintaxe

```
/progresso <nome>
```

### Descrição

Exibe o progresso de aprendizado registrado em `data/progresso.json`, mostrando trilhas concluídas e XP acumulado.

### Parâmetros

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `nome` | Sim | Nome do participante |

### Exemplos

```bash
node commands/index.js /progresso Daniela
node commands/index.js /progresso "Daniela Miranda"
```
