/**
 * Slash Command: /desafio
 * Uso: /desafio <tecnologia> [nivel]
 * Descrição: Gera um desafio de código aleatório baseado no nível e tecnologia
 *            escolhida pelo usuário, com enunciado, dicas e esqueleto de código.
 */

const DESAFIOS = {
  javascript: {
    Iniciante: [
      {
        titulo: "Contador de Vogais",
        enunciado: "Crie uma função que receba uma string e retorne o número de vogais encontradas.",
        dicas: ["Use .split('') para iterar caracteres", "Crie um array com as vogais e use .includes()"],
        esqueleto: `function contarVogais(texto) {\n  // seu código aqui\n}\n\nconsole.log(contarVogais("Daniela")); // 4`,
      },
      {
        titulo: "FizzBuzz Clássico",
        enunciado: "Imprima números de 1 a 100. Para múltiplos de 3, imprima 'Fizz'; de 5, 'Buzz'; de ambos, 'FizzBuzz'.",
        dicas: ["Use o operador módulo %", "Verifique o caso FizzBuzz primeiro"],
        esqueleto: `for (let i = 1; i <= 100; i++) {\n  // seu código aqui\n}`,
      },
    ],
    Intermediário: [
      {
        titulo: "Debounce Function",
        enunciado: "Implemente uma função debounce que atrasa a execução de uma função pelo tempo especificado.",
        dicas: ["Use setTimeout e clearTimeout", "Retorne uma função closure"],
        esqueleto: `function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    // seu código aqui\n  };\n}`,
      },
    ],
    Avançado: [
      {
        titulo: "Event Emitter do Zero",
        enunciado: "Implemente uma classe EventEmitter com os métodos on(), off() e emit() sem usar bibliotecas.",
        dicas: ["Use um Map para armazenar os listeners", "emit() deve chamar todos os listeners registrados para o evento"],
        esqueleto: `class EventEmitter {\n  constructor() {\n    // seu código aqui\n  }\n  on(event, listener) {}\n  off(event, listener) {}\n  emit(event, ...args) {}\n}`,
      },
    ],
  },
  python: {
    Iniciante: [
      {
        titulo: "Palíndromo",
        enunciado: "Escreva uma função que verifique se uma palavra é um palíndromo (lida igual de trás pra frente).",
        dicas: ["Use slicing: palavra[::-1]", "Normalize com .lower() antes de comparar"],
        esqueleto: `def e_palindromo(palavra: str) -> bool:\n    # seu código aqui\n    pass\n\nprint(e_palindromo("arara"))  # True`,
      },
    ],
    Intermediário: [
      {
        titulo: "Decorador de Log",
        enunciado: "Crie um decorador @log_chamada que imprime o nome da função, argumentos e resultado a cada chamada.",
        dicas: ["Use functools.wraps para preservar metadados", "Capture *args e **kwargs"],
        esqueleto: `import functools\n\ndef log_chamada(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        # seu código aqui\n        pass\n    return wrapper`,
      },
    ],
    Avançado: [
      {
        titulo: "Pipeline de Dados Assíncrono",
        enunciado: "Implemente um pipeline assíncrono com asyncio que processa uma lista de URLs em paralelo e retorna os status codes.",
        dicas: ["Use asyncio.gather() para paralelismo", "Use aiohttp para as requisições"],
        esqueleto: `import asyncio\nimport aiohttp\n\nasync def checar_url(session, url):\n    # seu código aqui\n    pass\n\nasync def pipeline(urls: list[str]):\n    # seu código aqui\n    pass`,
      },
    ],
  },
  java: {
    Iniciante: [
      {
        titulo: "Fibonacci Iterativo",
        enunciado: "Implemente o cálculo do N-ésimo número de Fibonacci de forma iterativa.",
        dicas: ["Evite recursão para não estourar a pilha", "Use duas variáveis para guardar os últimos dois valores"],
        esqueleto: `public class Fibonacci {\n    public static long calcular(int n) {\n        // seu código aqui\n        return 0;\n    }\n}`,
      },
    ],
    Intermediário: [
      {
        titulo: "Builder Pattern",
        enunciado: "Implemente o padrão Builder para construir um objeto Pedido com campos opcionais (desconto, observacao, prioridade).",
        dicas: ["A classe Builder deve ser estática e interna", "O método build() retorna a instância final"],
        esqueleto: `public class Pedido {\n    private final String produto;\n    private final int quantidade;\n    private double desconto;\n    private String observacao;\n\n    // implemente o Builder aqui\n}`,
      },
    ],
    Avançado: [
      {
        titulo: "Thread Pool do Zero",
        enunciado: "Implemente um ThreadPool simples com número fixo de workers e uma fila de tarefas Runnable.",
        dicas: ["Use BlockingQueue para a fila de tarefas", "Cada worker deve consumir da fila em loop"],
        esqueleto: `public class ThreadPool {\n    private final int nThreads;\n    // seu código aqui\n\n    public void submit(Runnable task) {}\n    public void shutdown() {}\n}`,
      },
    ],
  },
  react: {
    Iniciante: [
      {
        titulo: "Contador Interativo",
        enunciado: "Crie um componente React com um contador que incrementa, decrementa e reseta, usando useState.",
        dicas: ["Um único estado numérico é suficiente", "Crie três botões: +1, -1 e Reset"],
        esqueleto: `import { useState } from 'react';\n\nexport function Contador() {\n  const [count, setCount] = useState(0);\n  // seu código aqui\n}`,
      },
    ],
    Intermediário: [
      {
        titulo: "Hook useFetch Customizado",
        enunciado: "Crie um hook customizado useFetch(url) que retorna { data, loading, error } e refaz a requisição ao mudar a URL.",
        dicas: ["Use useEffect com url como dependência", "Cancele requisições anteriores com AbortController"],
        esqueleto: `import { useState, useEffect } from 'react';\n\nexport function useFetch(url) {\n  // seu código aqui\n  return { data, loading, error };\n}`,
      },
    ],
    Avançado: [
      {
        titulo: "Gerenciador de Estado Global sem Libs",
        enunciado: "Implemente um gerenciador de estado global usando apenas Context API + useReducer + hooks customizados.",
        dicas: ["Separe o contexto de estado do contexto de dispatch", "Crie um hook useStore() para encapsular o acesso"],
        esqueleto: `const StoreContext = createContext(null);\nconst DispatchContext = createContext(null);\n\nexport function StoreProvider({ children }) {\n  // seu código aqui\n}`,
      },
    ],
  },
  docker: {
    Iniciante: [
      {
        titulo: "Dockerizando uma API Node.js",
        enunciado: "Crie um Dockerfile para uma API Node.js com boas práticas: usuário não-root, .dockerignore e multi-stage build.",
        dicas: ["Use a imagem node:alpine para menor tamanho", "Defina um usuário node para segurança"],
        esqueleto: `# Dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\n# seu código aqui\n\nFROM node:20-alpine\n# seu código aqui`,
      },
    ],
    Intermediário: [
      {
        titulo: "Docker Compose com Banco de Dados",
        enunciado: "Crie um docker-compose.yml com um serviço de API, PostgreSQL e Redis, com healthchecks e volumes persistentes.",
        dicas: ["Use depends_on com condition: service_healthy", "Defina volumes nomeados para persistência"],
        esqueleto: `version: '3.9'\nservices:\n  api:\n    # seu código aqui\n  postgres:\n    # seu código aqui\n  redis:\n    # seu código aqui`,
      },
    ],
    Avançado: [
      {
        titulo: "Otimização de Imagem com Multi-stage",
        enunciado: "Reduza uma imagem Docker de uma app Go de 800MB para menos de 20MB usando multi-stage build e scratch.",
        dicas: ["Compile o binário estático com CGO_ENABLED=0", "Use FROM scratch como imagem final"],
        esqueleto: `FROM golang:1.22-alpine AS builder\n# compile aqui\n\nFROM scratch\nCOPY --from=builder /app/main /main\nENTRYPOINT ["/main"]`,
      },
    ],
  },
};

const FALLBACK_DESAFIOS = {
  Iniciante: {
    titulo: "Hello World com Estilo",
    enunciado: "Crie um programa que imprime 'Hello, DIO!' e exibe a data e hora atual formatada.",
    dicas: ["Pesquise como obter a data atual na sua linguagem", "Formate no padrão dd/mm/yyyy HH:MM"],
    esqueleto: `// Implemente em sua linguagem preferida\n// Saída esperada:\n// Hello, DIO!\n// Hoje é: 09/01/2026 às 10:30`,
  },
  Intermediário: {
    titulo: "API REST Simples",
    enunciado: "Crie uma API REST com endpoints CRUD para gerenciar uma lista de tarefas (to-do list) em memória.",
    dicas: ["GET /tasks, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id", "Use um array em memória como 'banco de dados'"],
    esqueleto: `// Implemente os 4 endpoints CRUD\n// Cada tarefa deve ter: id, titulo, concluida, criadaEm`,
  },
  Avançado: {
    titulo: "Cache LRU",
    enunciado: "Implemente uma estrutura de cache LRU (Least Recently Used) com capacidade configurável e operações get/put em O(1).",
    dicas: ["Combine um HashMap com uma Doubly Linked List", "get() e put() devem ser O(1)"],
    esqueleto: `// LRUCache(capacidade)\n// get(chave) -> valor ou -1\n// put(chave, valor) -> void`,
  },
};

function normalizar(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function sortear(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function resolverNivel(nivelArg) {
  if (!nivelArg) return sortear(["Iniciante", "Intermediário", "Avançado"]);
  const n = normalizar(nivelArg);
  if (n.includes("inic")) return "Iniciante";
  if (n.includes("inter")) return "Intermediário";
  if (n.includes("avan")) return "Avançado";
  return sortear(["Iniciante", "Intermediário", "Avançado"]);
}

function encontrarDesafio(tecnologia, nivel) {
  const chave = Object.keys(DESAFIOS).find((k) =>
    normalizar(tecnologia).includes(k)
  );

  const pool = chave ? DESAFIOS[chave][nivel] : null;
  return pool ? sortear(pool) : FALLBACK_DESAFIOS[nivel];
}

function formatarDesafio(desafio, tecnologia, nivel) {
  const nivelEmoji = { Iniciante: "🟢", Intermediário: "🟡", Avançado: "🔴" };
  const emoji = nivelEmoji[nivel] || "⚪";
  const seed = Math.floor(Math.random() * 9000) + 1000;

  return `
# ⚔️ Desafio DIO — ${desafio.titulo}

${emoji} **Nível:** ${nivel}
🛠️ **Tecnologia:** ${tecnologia}
🎲 **Seed:** #${seed}

---

## 📋 Enunciado

${desafio.enunciado}

---

## 💡 Dicas

${desafio.dicas.map((d, i) => `${i + 1}. ${d}`).join("\n")}

---

## 🧩 Esqueleto de Código

\`\`\`
${desafio.esqueleto}
\`\`\`

---

> 🏆 *Conseguiu resolver? Use \`/certificado <seu-nome> "${desafio.titulo}"\` para registrar sua conquista!*
`.trim();
}

function run(args) {
  if (!args || args.trim() === "") {
    return "❌ Uso correto: `/desafio <tecnologia> [nivel]`\nExemplo: `/desafio Python Avançado` ou `/desafio React`";
  }

  const partes = args.trim().split(" ");
  const nivelArg = ["iniciante", "intermediario", "intermediário", "avancado", "avançado"].find(
    (n) => normalizar(partes[partes.length - 1]).includes(n.replace("ç", "c").replace("á", "a").replace("ã", "a"))
  )
    ? partes.pop()
    : null;

  const tecnologia = partes.join(" ");
  const nivel = resolverNivel(nivelArg);
  const desafio = encontrarDesafio(tecnologia, nivel);

  return formatarDesafio(desafio, tecnologia, nivel);
}

module.exports = { run, encontrarDesafio, formatarDesafio };
