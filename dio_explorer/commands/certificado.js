/**
 * Slash Command: /certificado
 * Uso: /certificado <nome> "<trilha>" [--html]
 * Descrição: Gera um certificado fictício em Markdown com o nome do usuário
 *            e a trilha concluída, incluindo código de validação único.
 *            Com --html, salva um arquivo HTML estilizado em docs/certificados/
 */

const fs = require("fs");
const path = require("path");
const { buscarTrilha } = require("./trilha");

const CERT_DIR = path.resolve(__dirname, "../docs/certificados");

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
<sub>📎 Verifique em: https://github.com/daniela-miranda-br/Geo-Explorer</sub>
`.trim();
}

function gerarCertificadoHTML(nome, nomeTrilha, trilhaInfo) {
  const codigo = gerarCodigoValidacao(nome, nomeTrilha);
  const hoje = formatarData(new Date());
  const xp = trilhaInfo ? trilhaInfo.xp_total.toLocaleString("pt-BR") : "N/A";
  const tecnologia = trilhaInfo ? trilhaInfo.tecnologia : nomeTrilha;
  const nivel = trilhaInfo ? trilhaInfo.nivel : "Concluído";
  const badges = trilhaInfo ? trilhaInfo.badges_disponiveis : [];

  const nivelCor = { Iniciante: "#22c55e", Intermediário: "#f59e0b", Avançado: "#ef4444" };
  const cor = nivelCor[nivel] || "#6b7280";

  const badgesHTML =
    badges.length > 0
      ? `<div class="badges">
          <h3>🏅 Badges Conquistadas</h3>
          <div class="badges-list">
            ${badges.map((b) => `<span class="badge">🎖️ ${b}</span>`).join("")}
          </div>
        </div>`
      : "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificado DIO — ${nome}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .cert {
      background: #ffffff;
      width: 100%;
      max-width: 820px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
    }
    .cert-header {
      background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #7c3aed 100%);
      color: white;
      text-align: center;
      padding: 3rem 2rem 2rem;
      position: relative;
    }
    .cert-header::before {
      content: '';
      position: absolute;
      inset: 8px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 10px;
      pointer-events: none;
    }
    .cert-logo { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .cert-org {
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      opacity: 0.8;
      margin-bottom: 0.75rem;
    }
    .cert-title {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .cert-body { padding: 2.5rem 3rem; }
    .cert-atesta {
      text-align: center;
      color: #64748b;
      font-size: 1rem;
      margin-bottom: 0.75rem;
    }
    .cert-nome {
      text-align: center;
      font-size: 2.2rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
    }
    .cert-concluiu {
      text-align: center;
      color: #64748b;
      margin-bottom: 0.5rem;
    }
    .cert-trilha {
      text-align: center;
      font-size: 1.2rem;
      font-weight: 700;
      color: #1d4ed8;
      margin-bottom: 2rem;
    }
    .cert-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 1.5rem 0;
    }
    .cert-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .cert-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1rem 1.25rem;
    }
    .cert-item-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
      margin-bottom: 0.25rem;
    }
    .cert-item-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
    }
    .cert-nivel-badge {
      display: inline-block;
      background: ${cor}22;
      color: ${cor};
      border: 1px solid ${cor}55;
      padding: 0.2rem 0.75rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 700;
    }
    .cert-codigo {
      font-family: monospace;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
      color: #475569;
    }
    .badges { margin-bottom: 2rem; }
    .badges h3 {
      font-size: 0.9rem;
      color: #475569;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badges-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .badge {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      color: #92400e;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 600;
    }
    .cert-declaracao {
      background: #f8fafc;
      border-left: 4px solid #1d4ed8;
      padding: 1rem 1.25rem;
      color: #475569;
      font-style: italic;
      font-size: 0.88rem;
      line-height: 1.6;
      border-radius: 0 8px 8px 0;
      margin-bottom: 2rem;
    }
    .cert-assinaturas {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .assinatura {
      text-align: center;
      padding-top: 1rem;
      border-top: 2px solid #1e293b;
    }
    .assinatura-nome { font-weight: 700; color: #1e293b; font-size: 0.95rem; }
    .assinatura-cargo { color: #94a3b8; font-size: 0.8rem; }
    .cert-footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 1rem 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .cert-footer a { color: #1d4ed8; text-decoration: none; }
    @media (max-width: 600px) {
      .cert-grid, .cert-assinaturas { grid-template-columns: 1fr; }
      .cert-body { padding: 1.5rem; }
      .cert-nome { font-size: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="cert">
    <div class="cert-header">
      <div class="cert-logo">🏅</div>
      <div class="cert-org">Digital Innovation One — DIO</div>
      <div class="cert-title">Certificado de Conclusão</div>
    </div>
    <div class="cert-body">
      <p class="cert-atesta">Certificamos que</p>
      <div class="cert-nome">${nome}</div>
      <p class="cert-concluiu">concluiu com êxito a trilha de aprendizado:</p>
      <div class="cert-trilha">${nomeTrilha}</div>

      <div class="cert-grid">
        <div class="cert-item">
          <div class="cert-item-label">🛠️ Tecnologia</div>
          <div class="cert-item-value">${tecnologia}</div>
        </div>
        <div class="cert-item">
          <div class="cert-item-label">📊 Nível</div>
          <div class="cert-item-value"><span class="cert-nivel-badge">${nivel}</span></div>
        </div>
        <div class="cert-item">
          <div class="cert-item-label">⭐ XP Conquistado</div>
          <div class="cert-item-value">${xp} XP</div>
        </div>
        <div class="cert-item">
          <div class="cert-item-label">📅 Data de Emissão</div>
          <div class="cert-item-value">${hoje}</div>
        </div>
      </div>

      <div class="cert-item" style="margin-bottom:1.5rem">
        <div class="cert-item-label">🔑 Código de Validação</div>
        <div class="cert-item-value"><span class="cert-codigo">${codigo}</span></div>
      </div>

      ${badgesHTML}

      <div class="cert-declaracao">
        Este certificado atesta que o(a) participante demonstrou dedicação, comprometimento e
        domínio dos conteúdos apresentados ao longo da trilha, desenvolvendo habilidades práticas
        e teóricas reconhecidas pela comunidade DIO.
      </div>

      <div class="cert-assinaturas">
        <div class="assinatura">
          <div class="assinatura-nome">${nome}</div>
          <div class="assinatura-cargo">Participante</div>
        </div>
        <div class="assinatura">
          <div class="assinatura-nome">IBM Bob</div>
          <div class="assinatura-cargo">Assistente Oficial</div>
        </div>
      </div>
    </div>
    <div class="cert-footer">
      <span>🔐 Código: <strong>${codigo}</strong></span>
      <a href="https://github.com/daniela-miranda-br/Geo-Explorer" target="_blank">
        📎 Verificar autenticidade
      </a>
    </div>
  </div>
</body>
</html>`;
}

function salvarHTML(nome, nomeTrilha, html) {
  if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true });
  }
  const nomeSanitizado = nome.replace(/[^a-zA-Z0-9\sÀ-ÿ]/g, "").trim().replace(/\s+/g, "-");
  const trilhaSanitizada = nomeTrilha.replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "-").slice(0, 40);
  const nomeArquivo = `${nomeSanitizado}-${trilhaSanitizada}.html`;
  const filePath = path.join(CERT_DIR, nomeArquivo);
  fs.writeFileSync(filePath, html, "utf-8");
  return filePath;
}

function run(args) {
  if (!args || args.trim() === "") {
    return [
      "❌ Uso correto: `/certificado <nome> \"<trilha>\"` ou `/certificado <nome> \"<trilha>\" --html`",
      "Exemplos:",
      '  `/certificado Daniela "Python para Data Science e Machine Learning"`',
      '  `/certificado Daniela "Java Spring Boot" --html`  ← salva arquivo HTML',
    ].join("\n");
  }

  const exportHTML = args.includes("--html");
  const argsLimpos = args.replace("--html", "").trim();

  const match = argsLimpos.match(/^(.+?)\s+"(.+)"$/) || argsLimpos.match(/^(.+?)\s+(.+)$/);

  if (!match) {
    return `❌ Formato inválido. Use: \`/certificado <nome> "<trilha>"\``;
  }

  const nome = match[1].trim();
  const trilhaArg = match[2].trim();
  const trilhaInfo = buscarTrilha(trilhaArg);
  const nomeTrilha = trilhaInfo ? trilhaInfo.nome : trilhaArg;

  if (exportHTML) {
    const html = gerarCertificadoHTML(nome, nomeTrilha, trilhaInfo);
    const filePath = salvarHTML(nome, nomeTrilha, html);
    return (
      `✅ Certificado HTML gerado com sucesso!\n\n` +
      `📄 **Arquivo:** \`${filePath}\`\n\n` +
      `Abra o arquivo no seu navegador para visualizar o certificado estilizado.\n\n` +
      gerarCertificado(nome, nomeTrilha, trilhaInfo)
    );
  }

  return gerarCertificado(nome, nomeTrilha, trilhaInfo);
}

module.exports = { run, gerarCertificado, gerarCertificadoHTML, salvarHTML };
