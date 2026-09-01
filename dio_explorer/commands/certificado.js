/**
 * Slash Command: /certificado
 * Uso: /certificado <nome> "<trilha>"
 * Descrição: Gera um certificado fictício em Markdown com o nome do usuário
 *            e a trilha concluída, incluindo código de validação único.
 */

const { buscarTrilha } = require("./trilha");

function gerarCodigoValidacao(nome, trilha) {
  const base = `${nome}-${trilha}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  const positivo = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return `DIO-${positivo.slice(0, 4)}-${positivo.slice(4, 8)}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

function formatarData(date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function gerarCertificado(nome, nomeTrilha, trilhaInfo) {
  const codigo = gerarCodigoValidacao(nome, nomeTrilha);
  const hoje = formatarData(new Date());
  const xp = trilhaInfo ? trilhaInfo.xp_total.toLocaleString("pt-BR") : "N/A";
  const tecnologia = trilhaInfo ? trilhaInfo.tecnologia : nomeTrilha;
  const nivel = trilhaInfo ? trilhaInfo.nivel : "Concluído";
  const badges = trilhaInfo ? trilhaInfo.badges_disponiveis : [];

  return `
# 🎓 Certificado de Conclusão

---

\`\`\`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           🏅  DIGITAL INNOVATION ONE — DIO  🏅              ║
║                                                              ║
║                  CERTIFICADO DE CONCLUSÃO                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
\`\`\`

---

## Certificamos que

# 🧑‍💻 ${nome}

concluiu com êxito a trilha de aprendizado:

## 📚 ${nomeTrilha}

---

| Campo              | Detalhe                         |
|--------------------|----------------------------------|
| 🛠️ Tecnologia      | ${tecnologia}                   |
| 📊 Nível           | ${nivel}                        |
| ⭐ XP Conquistado  | ${xp} XP                        |
| 📅 Data de Emissão | ${hoje}                         |
| 🔑 Código          | \`${codigo}\`                   |

---

${badges.length > 0 ? `## 🏅 Badges Conquistadas\n\n${badges.map((b) => `- 🎖️ **${b}**`).join("\n")}\n\n---\n` : ""}

## Declaração

> *Este certificado atesta que o(a) participante demonstrou dedicação,
> comprometimento e domínio dos conteúdos apresentados ao longo da trilha,
> desenvolvendo habilidades práticas e teóricas reconhecidas pela
> comunidade DIO.*

---

\`\`\`
  ___________________________      ___________________________
 |                           |    |                           |
 |   Daniela Miranda         |    |   IBM Bob                 |
 |   Participante            |    |   Assistente Oficial      |
 |___________________________|    |___________________________|
\`\`\`

---

<sub>🔐 Código de validação: \`${codigo}\` — Emitido em ${hoje} via dio_explorer</sub>
<sub>📎 Verifique em: https://github.com/daniela-miranda-br/Dio-Class</sub>
`.trim();
}

function run(args) {
  if (!args || args.trim() === "") {
    return [
      "❌ Uso correto: `/certificado <nome> \"<trilha>\"`",
      "Exemplos:",
      '  `/certificado Daniela "Python para Data Science e Machine Learning"`',
      '  `/certificado João "React"`  ← busca automaticamente pelo nome da trilha',
    ].join("\n");
  }

  // Extrai nome e trilha do argumento
  // Formato: /certificado <nome> "<trilha>"  ou  /certificado <nome> <tecnologia>
  const match = args.match(/^(.+?)\s+"(.+)"$/) || args.match(/^(.+?)\s+(.+)$/);

  if (!match) {
    return `❌ Formato inválido. Use: \`/certificado <nome> "<trilha>"\``;
  }

  const nome = match[1].trim();
  const trilhaArg = match[2].trim();

  // Tenta encontrar a trilha no JSON
  const trilhaInfo = buscarTrilha(trilhaArg);
  const nomeTrilha = trilhaInfo ? trilhaInfo.nome : trilhaArg;

  return gerarCertificado(nome, nomeTrilha, trilhaInfo);
}

module.exports = { run, gerarCertificado };
