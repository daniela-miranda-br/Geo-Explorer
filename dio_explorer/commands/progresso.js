/**
 * Slash Command: /progresso
 * Uso: /progresso <nome>
 * Descrição: Exibe o progresso de aprendizado de um participante:
 *            trilhas em andamento, concluídas, XP total acumulado e badges.
 */

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.resolve(__dirname, "../data/progresso.json");

function carregarProgresso() {
  if (!fs.existsSync(DATA_PATH)) return { participantes: [] };
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function buscarParticipante(nome) {
  const { participantes } = carregarProgresso();
  const termo = nome.toLowerCase();
  return participantes.find((p) => p.nome.toLowerCase().includes(termo)) || null;
}

function gerarRelatorioProgresso(participante) {
  const trilhas = participante.trilhas || [];
  const concluidas = trilhas.filter((t) => t.status === "concluida");
  const emAndamento = trilhas.filter((t) => t.status === "em andamento");
  const xpTotal = trilhas.reduce((acc, t) => acc + (t.xp_conquistado || 0), 0);

  const barraProgresso = (concluidos, total) => {
    const pct = total > 0 ? Math.round((concluidos / total) * 10) : 0;
    return "█".repeat(pct) + "░".repeat(10 - pct) + ` ${concluidos}/${total}`;
  };

  const secaoConcluidas =
    concluidas.length > 0
      ? concluidas
          .map(
            (t) =>
              `  ✅ **${t.nome}**\n` +
              `     🛠️ ${t.tecnologia} | ⭐ ${(t.xp_conquistado || 0).toLocaleString("pt-BR")} XP | 📅 Concluído em ${t.concluido_em}`
          )
          .join("\n")
      : "  _Nenhuma trilha concluída ainda._";

  const secaoAndamento =
    emAndamento.length > 0
      ? emAndamento
          .map(
            (t) =>
              `  🔄 **${t.nome}**\n` +
              `     🛠️ ${t.tecnologia}\n` +
              `     📊 Progresso: [${barraProgresso(t.modulos_concluidos || 0, t.total_modulos || 0)}]\n` +
              `     📅 Iniciado em ${t.iniciado_em}`
          )
          .join("\n")
      : "  _Nenhuma trilha em andamento._";

  return `
# 📊 Progresso de Aprendizado — ${participante.nome}

---

## 📈 Resumo

| Métrica | Valor |
|---|---|
| ✅ Trilhas Concluídas | ${concluidas.length} |
| 🔄 Em Andamento | ${emAndamento.length} |
| 📚 Total de Trilhas | ${trilhas.length} |
| ⭐ XP Total Conquistado | ${xpTotal.toLocaleString("pt-BR")} XP |

---

## 🔄 Em Andamento

${secaoAndamento}

---

## ✅ Concluídas

${secaoConcluidas}

---

> 💡 *Use \`/trilha <tecnologia>\` para explorar novas trilhas!*
> 🎓 *Ao concluir, use \`/certificado ${participante.nome} "<trilha>"\` para emitir seu certificado.*
`.trim();
}

function registrarProgresso(nome, trilhaNome, tecnologia, totalModulos) {
  const data = carregarProgresso();
  let participante = data.participantes.find(
    (p) => p.nome.toLowerCase() === nome.toLowerCase()
  );

  if (!participante) {
    participante = { nome, trilhas: [] };
    data.participantes.push(participante);
  }

  const jaExiste = participante.trilhas.find(
    (t) => t.nome.toLowerCase() === trilhaNome.toLowerCase()
  );

  if (!jaExiste) {
    participante.trilhas.push({
      nome: trilhaNome,
      tecnologia,
      status: "em andamento",
      iniciado_em: new Date().toISOString().split("T")[0],
      concluido_em: null,
      xp_conquistado: 0,
      modulos_concluidos: 0,
      total_modulos: totalModulos || 0,
    });
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    return `✅ Trilha **${trilhaNome}** registrada para **${nome}**!`;
  }

  return `ℹ️ Trilha **${trilhaNome}** já está registrada para **${nome}**.`;
}

function run(args) {
  if (!args || args.trim() === "") {
    return [
      "❌ Uso correto: `/progresso <nome>`",
      "Exemplos:",
      "  `/progresso Daniela`",
      "  `/progresso \"Daniela Miranda\"`",
    ].join("\n");
  }

  const nome = args.trim().replace(/^"|"$/g, "");
  const participante = buscarParticipante(nome);

  if (!participante) {
    return (
      `❌ Nenhum progresso encontrado para **"${nome}"**.\n\n` +
      `Para começar a rastrear seu progresso, inicie uma trilha com \`/trilha <tecnologia>\` ` +
      `e depois registre com \`/progresso registrar "${nome}" "<trilha>"\`.`
    );
  }

  return gerarRelatorioProgresso(participante);
}

module.exports = { run, buscarParticipante, gerarRelatorioProgresso, registrarProgresso };
