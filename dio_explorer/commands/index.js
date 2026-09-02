/**
 * dio_explorer — Dispatcher de Slash Commands
 * Uso: node commands/index.js /trilha Python
 *      node commands/index.js /desafio React Avançado
 *      node commands/index.js /certificado "Daniela" "Python para Data Science"
 */

const trilha = require("./trilha");
const desafio = require("./desafio");
const certificado = require("./certificado");
const progresso = require("./progresso");

const COMANDOS = {
  "/trilha": trilha,
  "/desafio": desafio,
  "/certificado": certificado,
  "/progresso": progresso,
};

function AJUDA() {
  return `
🤖 **dio_explorer — Slash Commands disponíveis**

| Comando       | Uso                                              | Descrição                              |
|---------------|--------------------------------------------------|----------------------------------------|
| /trilha       | \`/trilha <tecnologia>\`                         | Plano de estudos de uma trilha DIO     |
| /desafio      | \`/desafio <tecnologia> [nivel]\`                | Gera um desafio de código aleatório    |
| /certificado  | \`/certificado <nome> "<trilha>" [--html]\`      | Emite um certificado (Markdown ou HTML)|
| /progresso    | \`/progresso <nome>\`                            | Exibe o progresso de aprendizado       |

**Exemplos:**
  node index.js /trilha Python
  node index.js /desafio React Avançado
  node index.js /certificado Daniela "Python para Data Science e Machine Learning"
  node index.js /certificado Daniela "Java Spring Boot" --html
  node index.js /progresso Daniela
`.trim();
}

function dispatch(input) {
  if (!input) return AJUDA();

  const primeiroEspaco = input.indexOf(" ");
  const comando = primeiroEspaco === -1 ? input : input.slice(0, primeiroEspaco);
  const args = primeiroEspaco === -1 ? "" : input.slice(primeiroEspaco + 1);

  const handler = COMANDOS[comando.toLowerCase()];
  if (!handler) {
    return `❌ Comando desconhecido: \`${comando}\`\n\n${AJUDA()}`;
  }

  return handler.run(args);
}

// Execução via CLI: node index.js /trilha Python
if (require.main === module) {
  const argv = process.argv.slice(2);
  const comando = argv[0] || "";
  // Reconstrói os args preservando tokens com espaços entre aspas
  const argsTokens = argv.slice(1);
  const argsStr = argsTokens.map(t => (t.includes(" ") ? `"${t}"` : t)).join(" ");
  console.log(dispatch(comando + (argsStr ? " " + argsStr : "")));
}

module.exports = { dispatch };
