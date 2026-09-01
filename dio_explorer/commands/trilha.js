/**
 * Slash Command: /trilha
 * Uso: /trilha <tecnologia>
 * Descrição: Busca no arquivo trilhas_dio.json e retorna um plano de estudos
 *            formatado com os módulos da trilha correspondente à tecnologia.
 */

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.resolve(__dirname, "../data/trilhas_dio.json");

function buscarTrilha(tecnologia) {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const { trilhas } = JSON.parse(raw);

  const termo = tecnologia.toLowerCase();
  return trilhas.find(
    (t) =>
      t.nome.toLowerCase().includes(termo) ||
      t.tecnologia.toLowerCase().includes(termo)
  );
}

function gerarPlanoDeEstudos(trilha) {
  const nivelEmoji = {
    Iniciante: "🟢",
    Intermediário: "🟡",
    Avançado: "🔴",
  };

  const emoji = nivelEmoji[trilha.nivel] || "⚪";
  const modulos = Array.from({ length: trilha.numero_de_modulos }, (_, i) => {
    const nomes = [
      "Introdução e Fundamentos",
      "Configuração do Ambiente",
      "Conceitos Essenciais",
      "Primeiros Projetos Práticos",
      "Aprofundando nos Conceitos",
      "Boas Práticas e Padrões",
      "Integração com Ferramentas",
      "Testes e Qualidade",
      "Segurança e Performance",
      "Deploy e Infraestrutura",
      "Projeto Integrador",
      "Desafios Avançados",
      "Revisão e Consolidação",
      "Certificação e Próximos Passos",
      "Arquitetura e Design Patterns",
      "Monitoramento e Observabilidade",
      "Casos de Uso Reais",
      "Contribuição Open Source",
      "Mentoria e Comunidade",
      "Conclusão e Certificado",
    ];
    return `  ${i + 1}. ${nomes[i % nomes.length]}`;
  });

  return `
# 📚 Plano de Estudos — ${trilha.nome}

${emoji} **Nível:** ${trilha.nivel}
🛠️ **Tecnologia:** ${trilha.tecnologia}
📦 **Módulos:** ${trilha.numero_de_modulos}
⭐ **XP Total:** ${trilha.xp_total.toLocaleString("pt-BR")} XP
♾️ **Acesso Vitalício:** ${trilha.vitalicio ? "Sim" : "Não"}
🎥 **Live ao Vivo:** ${trilha.live_ao_vivo ? "Sim" : "Não"}
🔗 **URL:** ${trilha.url}
${trilha.promocoes ? `🏷️ **Promoção:** ${trilha.promocoes.desconto} de desconto até ${trilha.promocoes.validade}` : ""}

---

## 🗺️ Módulos da Trilha

${modulos.join("\n")}

---

## 🏅 Badges Disponíveis

${trilha.badges_disponiveis.map((b) => `- 🎖️ ${b}`).join("\n")}

---

> 💡 *Use \`/desafio ${trilha.tecnologia.split(" / ")[0]}\` para gerar um desafio de código desta trilha!*
> 🎓 *Ao concluir, use \`/certificado <seu-nome> "${trilha.nome}"\` para gerar seu certificado.*
`.trim();
}

function run(args) {
  if (!args || args.trim() === "") {
    return "❌ Uso correto: `/trilha <tecnologia>`\nExemplo: `/trilha Python` ou `/trilha React`";
  }

  const trilha = buscarTrilha(args.trim());

  if (!trilha) {
    return `❌ Nenhuma trilha encontrada para **"${args}"**.\nTente termos como: Python, React, AWS, Docker, Java, Flutter...`;
  }

  return gerarPlanoDeEstudos(trilha);
}

module.exports = { run, buscarTrilha, gerarPlanoDeEstudos };
