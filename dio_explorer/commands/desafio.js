/**
 * Slash Command: /desafio
 * Uso: /desafio <tecnologia> [nivel]
 * Descrição: Gera um desafio de código aleatório baseado no nível e tecnologia
 *            escolhida pelo usuário, com enunciado, dicas e esqueleto de código.
 *            Os desafios são carregados de data/desafios_dio.json.
 */

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.resolve(__dirname, "../data/desafios_dio.json");

function carregarDesafios() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

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
  const { desafios, fallback } = carregarDesafios();
  const tecNorm = normalizar(tecnologia);
  const chaves = Object.keys(desafios);

  // 1º: match exato
  let chave = chaves.find((k) => normalizar(k) === tecNorm);

  // 2º: busca contém o termo (ex: "java" dentro de "javascript" — não queremos isso)
  //     ou o termo contém a chave (ex: "golang" contém "go")
  // Ordena as chaves da mais longa para a mais curta para priorizar "javascript" sobre "java"
  if (!chave) {
    const ordenadas = [...chaves].sort((a, b) => b.length - a.length);
    chave = ordenadas.find((k) => {
      const kNorm = normalizar(k);
      return tecNorm.includes(kNorm) || kNorm.includes(tecNorm);
    });
  }

  const pool = chave ? desafios[chave][nivel] : null;
  return pool ? sortear(pool) : fallback[nivel];
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

module.exports = { run, encontrarDesafio, formatarDesafio, resolverNivel, normalizar };
