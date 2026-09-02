/**
 * Slash Command: /certificado
 * Uso: /certificado <nome> "<trilha>" [--html]
 * Descrição: Gera um certificado fictício em Markdown com o nome do usuário
 *            e a trilha concluída, incluindo código de validação único.
 *            Com --html, salva um arquivo HTML animado em docs/certificados/
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
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
 |   ${nome.padEnd(25)}|    |   IBM Bob                 |
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
    /* ── Keyframes ─────────────────────────────────────────── */
    @keyframes fadeInDown {
      from { opacity:0; transform:translateY(-24px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity:0; } to { opacity:1; }
    }
    @keyframes shimmer {
      0%   { background-position:-400px 0; }
      100% { background-position: 400px 0; }
    }
    @keyframes popIn {
      0%  { opacity:0; transform:scale(0.7); }
      70% { transform:scale(1.08); }
      100%{ opacity:1; transform:scale(1); }
    }
    @keyframes borderGlow {
      0%,100%{ opacity:0.3; } 50%{ opacity:0.9; }
    }
    /* Bob walking ── legs */
    @keyframes legL {
      0%,100%{ transform:rotate(25deg); }
      50%    { transform:rotate(-25deg); }
    }
    @keyframes legR {
      0%,100%{ transform:rotate(-25deg); }
      50%    { transform:rotate(25deg); }
    }
    /* Bob walking across screen */
    @keyframes bobWalk {
      0%   { left:-120px; }
      100% { left:calc(100% + 20px); }
    }
    /* Bob body bounce */
    @keyframes bobBounce {
      0%,100%{ transform:translateY(0); }
      50%    { transform:translateY(-5px); }
    }
    /* Arm wave */
    @keyframes armWave {
      0%,100%{ transform:rotate(-15deg); }
      50%    { transform:rotate(30deg); }
    }
    /* Speech bubble pop */
    @keyframes bubblePop {
      0%  { opacity:0; transform:scale(0.5) translateY(10px); }
      60% { transform:scale(1.05) translateY(-2px); }
      100%{ opacity:1; transform:scale(1) translateY(0); }
    }
    /* Stars sparkle */
    @keyframes starSpin {
      0%  { transform:rotate(0deg) scale(1); opacity:1; }
      100%{ transform:rotate(360deg) scale(0); opacity:0; }
    }
    @keyframes starFly {
      0%  { transform:translate(0,0) scale(1); opacity:1; }
      100%{ transform:translate(var(--dx),var(--dy)) scale(0); opacity:0; }
    }

    /* ── Base ─────────────────────────────────────────────── */
    *{ box-sizing:border-box; margin:0; padding:0; }
    body{
      font-family:'Segoe UI',system-ui,sans-serif;
      background:#0f172a;
      display:flex;
      justify-content:center;
      align-items:center;
      min-height:100vh;
      padding:2rem 2rem 120px;
      position:relative;
      overflow-x:hidden;
    }

    /* ── Mute button ──────────────────────────────────────── */
    #mute-btn{
      position:fixed;
      top:16px; right:16px;
      background:rgba(255,255,255,0.1);
      border:1px solid rgba(255,255,255,0.25);
      color:#fff;
      font-size:1.2rem;
      width:40px; height:40px;
      border-radius:50%;
      cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition:background 0.2s;
      z-index:100;
    }
    #mute-btn:hover{ background:rgba(255,255,255,0.2); }

    /* ── Certificate card ─────────────────────────────────── */
    .cert{
      background:#fff;
      width:100%; max-width:820px;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 25px 60px rgba(0,0,0,0.6);
      animation:fadeInUp 0.7s ease both;
      position:relative; z-index:10;
    }
    .cert-header{
      background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#7c3aed 100%);
      color:#fff;
      text-align:center;
      padding:3rem 2rem 2rem;
      position:relative;
      animation:fadeInDown 0.6s ease both;
    }
    .cert-header::before{
      content:'';
      position:absolute; inset:8px;
      border:2px solid rgba(255,255,255,0.3);
      border-radius:10px;
      pointer-events:none;
      animation:borderGlow 3s ease-in-out infinite;
    }
    .cert-logo{
      font-size:2.8rem; margin-bottom:0.5rem;
      display:inline-block;
      animation:popIn 0.6s 0.3s ease both;
    }
    .cert-org{
      font-size:0.75rem; letter-spacing:0.3em;
      text-transform:uppercase; opacity:0.8;
      margin-bottom:0.75rem;
      animation:fadeIn 0.6s 0.4s ease both;
    }
    .cert-title{
      font-size:1.6rem; font-weight:800;
      letter-spacing:0.1em; text-transform:uppercase;
      background:linear-gradient(90deg,#fff 25%,#a5b4fc 50%,#fff 75%);
      background-size:400px 100%;
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text;
      animation:fadeIn 0.6s 0.5s ease both, shimmer 3s 1s linear infinite;
    }
    .cert-body{ padding:2.5rem 3rem; animation:fadeIn 0.7s 0.5s ease both; }
    .cert-atesta{ text-align:center; color:#64748b; font-size:1rem; margin-bottom:0.75rem; }
    .cert-nome{
      text-align:center; font-size:2.2rem; font-weight:800;
      color:#0f172a; margin-bottom:0.75rem; letter-spacing:-0.02em;
      animation:popIn 0.5s 0.7s ease both;
    }
    .cert-concluiu{ text-align:center; color:#64748b; margin-bottom:0.5rem; }
    .cert-trilha{
      text-align:center; font-size:1.2rem; font-weight:700;
      color:#1d4ed8; margin-bottom:2rem;
      animation:fadeInUp 0.5s 0.8s ease both;
    }
    .cert-grid{
      display:grid; grid-template-columns:1fr 1fr;
      gap:1rem; margin-bottom:2rem;
    }
    .cert-item{
      background:#f8fafc; border:1px solid #e2e8f0;
      border-radius:10px; padding:1rem 1.25rem;
      transition:transform 0.2s ease, box-shadow 0.2s ease;
    }
    .cert-item:hover{ transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.08); }
    .cert-item-label{
      font-size:0.7rem; text-transform:uppercase;
      letter-spacing:0.1em; color:#94a3b8; margin-bottom:0.25rem;
    }
    .cert-item-value{ font-size:0.95rem; font-weight:600; color:#1e293b; }
    .cert-nivel-badge{
      display:inline-block;
      background:${cor}22; color:${cor}; border:1px solid ${cor}55;
      padding:0.2rem 0.75rem; border-radius:999px;
      font-size:0.85rem; font-weight:700;
    }
    .cert-codigo{
      font-family:monospace; background:#f1f5f9;
      border:1px solid #cbd5e1; padding:0.2rem 0.5rem;
      border-radius:4px; font-size:0.85rem; color:#475569;
    }
    .badges{ margin-bottom:2rem; }
    .badges h3{
      font-size:0.9rem; color:#475569; margin-bottom:0.75rem;
      text-transform:uppercase; letter-spacing:0.05em;
    }
    .badges-list{ display:flex; flex-wrap:wrap; gap:0.5rem; }
    .badge{
      background:#fef3c7; border:1px solid #fcd34d; color:#92400e;
      padding:0.35rem 0.75rem; border-radius:999px;
      font-size:0.82rem; font-weight:600;
      animation:popIn 0.4s ease both;
    }
    .cert-declaracao{
      background:#f8fafc; border-left:4px solid #1d4ed8;
      padding:1rem 1.25rem; color:#475569; font-style:italic;
      font-size:0.88rem; line-height:1.6;
      border-radius:0 8px 8px 0; margin-bottom:2rem;
    }
    .cert-assinaturas{
      display:grid; grid-template-columns:1fr 1fr;
      gap:2rem; margin-bottom:2rem;
    }
    .assinatura{ text-align:center; padding-top:1rem; border-top:2px solid #1e293b; }
    .assinatura-nome{ font-weight:700; color:#1e293b; font-size:0.95rem; }
    .assinatura-cargo{ color:#94a3b8; font-size:0.8rem; }
    .cert-footer{
      background:#f8fafc; border-top:1px solid #e2e8f0;
      padding:1rem 3rem;
      display:flex; justify-content:space-between; align-items:center;
      font-size:0.75rem; color:#94a3b8;
    }
    .cert-footer a{ color:#1d4ed8; text-decoration:none; }

    /* ── Bob character ────────────────────────────────────── */
    #bob-wrap{
      position:fixed;
      bottom:18px;
      left:-300px;
      width:240px;
      z-index:50;
      animation:bobWalk 22s linear infinite;
      animation-delay:1.2s;
    }
    #bob-inner{
      position:relative;
      display:flex; flex-direction:column; align-items:center;
      animation:bobBounce 0.6s ease-in-out infinite;
    }

    /* speech bubble */
    .bob-bubble{
      position:absolute;
      bottom:100%; left:50%;
      transform:translateX(-50%);
      background:#fff;
      border:2px solid #1d4ed8;
      border-radius:12px;
      padding:6px 14px;
      font-size:0.7rem;
      font-weight:700;
      color:#1d4ed8;
      white-space:nowrap;
      margin-bottom:8px;
      animation:bubblePop 0.5s 1.6s ease both;
    }
    .bob-bubble::after{
      content:'';
      position:absolute;
      top:100%; left:50%;
      transform:translateX(-50%);
      border:6px solid transparent;
      border-top-color:#1d4ed8;
    }

    /* Bob image — fundo já é escuro, sem blend mode necessário */
    #bob-img{
      width:160px;
      height:auto;
      display:block;
      object-fit:contain;
      filter:drop-shadow(0 0 20px rgba(99,102,241,0.6));
      border-radius:8px;
    }

    /* stars container */
    #stars{
      position:fixed; inset:0;
      pointer-events:none; z-index:5;
      overflow:hidden;
    }
    .star{
      position:absolute;
      font-size:1.2rem;
      animation:starFly 1.4s ease-out forwards;
    }

    @media(max-width:600px){
      .cert-grid,.cert-assinaturas{ grid-template-columns:1fr; }
      .cert-body{ padding:1.5rem; }
      .cert-nome{ font-size:1.5rem; }
    }
  </style>
</head>
<body>

  <!-- Mute button -->
  <button id="mute-btn" title="Mutar / Desmutar">🔊</button>

  <!-- Stars layer -->
  <div id="stars"></div>

  <!-- Bob character -->
  <div id="bob-wrap">
    <div id="bob-inner">
      <div class="bob-bubble">Parabéns, ${nome}! 🎉</div>
      <img id="bob-img"
           src="../ibm-bob-dark-bg-1x1.PNG"
           alt="IBM Bob" />
    </div>
  </div>

  <!-- Certificate -->
  <div class="cert">
    <div class="cert-header">
      <div class="cert-logo">🏅</div>
      <div class="cert-org">Digital Innovation One — DIO</div>
      <div class="cert-title">Certificado de Conclusão</div>
    </div>
    <div class="cert-parabens" style="
      background:linear-gradient(90deg,#1d4ed8,#7c3aed);
      color:#fff;
      text-align:center;
      padding:0.9rem 1rem;
      font-size:1.15rem;
      font-weight:800;
      letter-spacing:0.05em;
      animation:fadeInDown 0.5s 0.9s ease both;
    ">🎉 Parabéns, ${nome}! Você concluiu a trilha com sucesso! 🏆</div>
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

  <script>
    /* ── Web Audio fanfare ──────────────────────────────────── */
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let ctx, gainNode, muted = false;

    function note(freq, start, dur, vol=0.35) {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type  = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      g.gain.setValueAtTime(0, ctx.currentTime + start);
      g.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.connect(g);
      g.connect(gainNode);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    }

    // Fanfare: "We Are The Champions" intro motif (royal fanfare feel)
    const FANFARE = [
      // bar 1 — rising fanfare
      [523, 0.0,  0.18], [523, 0.2,  0.12], [659, 0.35, 0.18],
      [784, 0.55, 0.25], [784, 0.82, 0.12], [880, 0.96, 0.30],
      // bar 2 — triumphant chord hits
      [1047,1.30, 0.22], [784, 1.30, 0.22], [523, 1.30, 0.22],
      [1047,1.58, 0.15], [784, 1.58, 0.15],
      // bar 3 — descending resolve
      [880, 1.78, 0.18], [784, 1.98, 0.18], [698, 2.18, 0.18],
      [659, 2.38, 0.35],
      // bar 4 — big finish
      [523, 2.80, 0.12], [659, 2.95, 0.12], [784, 3.10, 0.12],
      [1047,3.25, 0.50], [784, 3.25, 0.50], [523, 3.25, 0.50],
      // loop gap silence then repeat
    ];

    function playFanfare() {
      if (!ctx) { ctx = new AudioCtx(); gainNode = ctx.createGain(); gainNode.connect(ctx.destination); }
      gainNode.gain.value = muted ? 0 : 0.4;
      FANFARE.forEach(([f, s, d]) => note(f, s, d));
      // loop: re-trigger after 5.5 s
      setTimeout(() => { if (!muted) playFanfare(); }, 5500);
    }

    /* ── Mute toggle ──────────────────────────────────────── */
    const muteBtn = document.getElementById('mute-btn');
    muteBtn.addEventListener('click', () => {
      muted = !muted;
      if (gainNode) gainNode.gain.value = muted ? 0 : 0.4;
      muteBtn.textContent = muted ? '🔇' : '🔊';
    });

    /* ── Stars burst ─────────────────────────────────────── */
    const starsEl = document.getElementById('stars');
    const EMOJIS  = ['⭐','🌟','✨','🎉','🎊','🏅','💫'];
    function burst() {
      for (let i = 0; i < 14; i++) {
        const s  = document.createElement('span');
        s.className = 'star';
        s.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        const x  = Math.random() * 100;
        const y  = Math.random() * 80;
        const dx = (Math.random() - 0.5) * 160 + 'px';
        const dy = (Math.random() - 0.5) * 160 + 'px';
        s.style.cssText = 'left:' + x + 'vw;top:' + y + 'vh;--dx:' + dx + ';--dy:' + dy;
        s.style.animationDelay = (Math.random() * 0.6) + 's';
        starsEl.appendChild(s);
        setTimeout(() => s.remove(), 2200);
      }
    }

    /* ── Start everything on first interaction ───────────── */
    let started = false;
    function start() {
      if (started) return;
      started = true;
      playFanfare();
      burst();
      // repeat bursts periodically
      setInterval(burst, 4000);
    }
    // auto-start after short delay (works in most browsers on page load)
    setTimeout(start, 800);
    document.addEventListener('click', start, { once: true });
  </script>
</body>
</html>`;
}

function salvarHTML(nome, nomeTrilha, html) {
  if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true });
  }
  // Sanitiza mantendo espaços entre palavras, depois troca por hífen
  const nomeSanitizado = nome
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // remove acentos
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const trilhaSanitizada = nomeTrilha
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
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
      '  `/certificado "Daniela Miranda" "Java Spring Boot"`',
      '  `/certificado "Daniela Miranda" "Java Spring Boot" --html`  ← salva arquivo HTML',
    ].join("\n");
  }

  const exportHTML = args.includes("--html");
  const argsLimpos = args.replace("--html", "").trim();

  // Suporta: "Nome Completo" "Trilha" | "Nome" Trilha | Nome "Trilha" | Nome Trilha
  const matchAmbosComAspas = argsLimpos.match(/^"([^"]+)"\s+"([^"]+)"$/);
  const matchNomeComAspas   = argsLimpos.match(/^"([^"]+)"\s+(.+)$/);
  const matchTrilhaComAspas = argsLimpos.match(/^(.+?)\s+"([^"]+)"$/);
  const matchSemAspas       = argsLimpos.match(/^(.+?)\s+(.+)$/);

  const match = matchAmbosComAspas || matchNomeComAspas || matchTrilhaComAspas || matchSemAspas;

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

    try {
      const cmd =
        process.platform === "win32"
          ? `start "" "${filePath}"`
          : process.platform === "darwin"
          ? `open "${filePath}"`
          : `xdg-open "${filePath}"`;
      execSync(cmd, { stdio: "ignore" });
    } catch (_) {
      // Silently ignore if browser can't be opened
    }

    return (
      `✅ Certificado HTML gerado e aberto no navegador!\n\n` +
      `📄 **Arquivo:** \`${filePath}\`\n\n` +
      gerarCertificado(nome, nomeTrilha, trilhaInfo)
    );
  }

  return gerarCertificado(nome, nomeTrilha, trilhaInfo);
}

module.exports = { run, gerarCertificado, gerarCertificadoHTML, salvarHTML };
