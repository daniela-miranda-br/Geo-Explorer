/**
 * dio_explorer — Dispatcher de Slash Commands
 * Uso: node commands/index.js /trilha Python
 *      node commands/index.js /desafio React Avançado
 *      node commands/index.js /certificado "Daniela" "Python para Data Science"
 */

const trilha = require("./trilha");
const desafio = require("./desafio");
const certificado = require("./certificado");

const COMANDOS = {
  "/trilha": trilha,
  "/desafio": desafio,
  "/certificado": certificado,
};

function AJUDA() {
  return `
🤖 **dio_explorer — Slash Commands disponíveis**

| Comando       | Uso                                         | Descrição                              |
|---------------|---------------------------------------------|----------------------------------------|
| /trilha       | \`/trilha <tecnologia>\`                    | Plano de estudos de uma trilha DIO     |
| /desafio      | \`/desafio <tecnologia> [nivel]\`           | Gera um desafio de código aleatório    |
| /certificado  | \`/certificado <nome> "<trilha>"\`          | Emite um certificado fictício          |

**Exemplos:**
  node index.js /trilha Python
  node index.js /desafio React Avançado
  node index.js /certificado Daniela "Python para Data Science e Machine Learning"
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
  const args = process.argv.slice(2).join(" ");
  console.log(dispatch(args));
}

module.exports = { dispatch };
