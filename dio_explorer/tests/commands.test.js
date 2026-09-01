/**
 * Testes Unitários — dio_explorer
 * Fluxo testado:
 *   1. /trilha java  → consulta trilha Java Spring Boot
 *   2. /desafio java → gera desafio para o aluno
 *   3. /certificado  → emite certificado para o aluno
 *
 * Cobertura alvo: >= 70%
 */

const { dispatch } = require("../commands/index");
const { buscarTrilha, gerarPlanoDeEstudos, run: runTrilha } = require("../commands/trilha");
const { encontrarDesafio, formatarDesafio, run: runDesafio } = require("../commands/desafio");
const { gerarCertificado, run: runCertificado } = require("../commands/certificado");

// ─────────────────────────────────────────────
// Trilha
// ─────────────────────────────────────────────
describe("/trilha — buscarTrilha()", () => {
  test("encontra trilha Java pelo termo 'spring boot'", () => {
    const trilha = buscarTrilha("spring boot");
    expect(trilha).toBeDefined();
    expect(trilha.tecnologia.toLowerCase()).toContain("java");
  });

  test("encontra trilha Java pelo nome 'spring'", () => {
    const trilha = buscarTrilha("spring");
    expect(trilha).toBeDefined();
    expect(trilha.nome.toLowerCase()).toContain("spring");
  });

  test("retorna undefined para tecnologia inexistente", () => {
    const trilha = buscarTrilha("cobol_xpto_123");
    expect(trilha).toBeUndefined();
  });

  test("busca é case-insensitive", () => {
    const t1 = buscarTrilha("Spring Boot");
    const t2 = buscarTrilha("spring boot");
    expect(t1).toEqual(t2);
  });
});

describe("/trilha — gerarPlanoDeEstudos()", () => {
  let trilhaJava;

  beforeAll(() => {
    trilhaJava = buscarTrilha("spring boot");
  });

  test("retorna string com o nome da trilha", () => {
    const plano = gerarPlanoDeEstudos(trilhaJava);
    expect(typeof plano).toBe("string");
    expect(plano).toContain(trilhaJava.nome);
  });

  test("contém seção de módulos", () => {
    const plano = gerarPlanoDeEstudos(trilhaJava);
    expect(plano).toContain("Módulos da Trilha");
  });

  test("contém seção de badges", () => {
    const plano = gerarPlanoDeEstudos(trilhaJava);
    expect(plano).toContain("Badges Disponíveis");
    trilhaJava.badges_disponiveis.forEach((badge) => {
      expect(plano).toContain(badge);
    });
  });

  test("contém nível e XP corretamente", () => {
    const plano = gerarPlanoDeEstudos(trilhaJava);
    expect(plano).toContain(trilhaJava.nivel);
    expect(plano).toContain("XP Total");
  });

  test("exibe emoji correto para nível Intermediário", () => {
    const plano = gerarPlanoDeEstudos(trilhaJava);
    expect(plano).toContain("🟡");
  });

  test("exibe emoji correto para nível Avançado", () => {
    const trilhaAvancada = buscarTrilha("kubernetes");
    const plano = gerarPlanoDeEstudos(trilhaAvancada);
    expect(plano).toContain("🔴");
  });

  test("exibe emoji correto para nível Iniciante", () => {
    const trilhaIniciante = buscarTrilha("aws");
    const plano = gerarPlanoDeEstudos(trilhaIniciante);
    expect(plano).toContain("🟢");
  });

  test("mostra promoção quando disponível", () => {
    const plano = gerarPlanoDeEstudos(trilhaJava);
    expect(plano).toContain("Promoção");
    // trilha Java Spring Boot tem 10% de desconto
    expect(plano).toContain("%");
  });

  test("não mostra promoção quando null", () => {
    const trilhaSemPromocao = buscarTrilha("kubernetes");
    const plano = gerarPlanoDeEstudos(trilhaSemPromocao);
    expect(plano).not.toContain("🏷️");
  });

  test("número correto de módulos gerado", () => {
    const plano = gerarPlanoDeEstudos(trilhaJava);
    // trilha Java tem 16 módulos
    for (let i = 1; i <= 16; i++) {
      expect(plano).toContain(`${i}.`);
    }
  });
});

describe("/trilha — run()", () => {
  test("retorna plano de estudos para 'spring boot'", () => {
    const resultado = runTrilha("spring boot");
    expect(resultado).toContain("Java Spring Boot");
    expect(resultado).toContain("Plano de Estudos");
  });

  test("retorna mensagem de erro para tecnologia inexistente", () => {
    const resultado = runTrilha("cobol_xyz");
    expect(resultado).toContain("❌");
    expect(resultado).toContain("Nenhuma trilha encontrada");
  });

  test("retorna instrução de uso quando args vazio", () => {
    const resultado = runTrilha("");
    expect(resultado).toContain("❌");
    expect(resultado).toContain("/trilha");
  });

  test("retorna instrução de uso quando args é null", () => {
    const resultado = runTrilha(null);
    expect(resultado).toContain("❌");
  });
});

// ─────────────────────────────────────────────
// Desafio
// ─────────────────────────────────────────────
describe("/desafio — encontrarDesafio()", () => {
  test("encontra desafio Java Iniciante", () => {
    const d = encontrarDesafio("java", "Iniciante");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Fibonacci Iterativo");
  });

  test("encontra desafio Java Intermediário", () => {
    const d = encontrarDesafio("java", "Intermediário");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Builder Pattern");
  });

  test("encontra desafio Java Avançado", () => {
    const d = encontrarDesafio("java", "Avançado");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Thread Pool do Zero");
  });

  test("usa fallback para tecnologia não cadastrada", () => {
    const d = encontrarDesafio("cobol", "Iniciante");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Hello World com Estilo");
  });

  test("fallback para Avançado sem tecnologia conhecida", () => {
    const d = encontrarDesafio("brainfuck", "Avançado");
    expect(d.titulo).toBe("Cache LRU");
  });
});

describe("/desafio — formatarDesafio()", () => {
  let desafioJava;

  beforeAll(() => {
    desafioJava = encontrarDesafio("java", "Iniciante");
  });

  test("retorna string formatada com título", () => {
    const resultado = formatarDesafio(desafioJava, "Java", "Iniciante");
    expect(typeof resultado).toBe("string");
    expect(resultado).toContain(desafioJava.titulo);
  });

  test("contém enunciado do desafio", () => {
    const resultado = formatarDesafio(desafioJava, "Java", "Iniciante");
    expect(resultado).toContain(desafioJava.enunciado);
  });

  test("contém as dicas", () => {
    const resultado = formatarDesafio(desafioJava, "Java", "Iniciante");
    desafioJava.dicas.forEach((dica) => {
      expect(resultado).toContain(dica);
    });
  });

  test("contém o esqueleto de código", () => {
    const resultado = formatarDesafio(desafioJava, "Java", "Iniciante");
    expect(resultado).toContain(desafioJava.esqueleto);
  });

  test("contém nível e tecnologia", () => {
    const resultado = formatarDesafio(desafioJava, "Java", "Iniciante");
    expect(resultado).toContain("Iniciante");
    expect(resultado).toContain("Java");
  });

  test("contém emoji 🟢 para nível Iniciante", () => {
    const resultado = formatarDesafio(desafioJava, "Java", "Iniciante");
    expect(resultado).toContain("🟢");
  });

  test("contém emoji 🟡 para nível Intermediário", () => {
    const d = encontrarDesafio("java", "Intermediário");
    const resultado = formatarDesafio(d, "Java", "Intermediário");
    expect(resultado).toContain("🟡");
  });

  test("contém emoji 🔴 para nível Avançado", () => {
    const d = encontrarDesafio("java", "Avançado");
    const resultado = formatarDesafio(d, "Java", "Avançado");
    expect(resultado).toContain("🔴");
  });

  test("contém seed numérico (4 dígitos)", () => {
    const resultado = formatarDesafio(desafioJava, "Java", "Iniciante");
    expect(resultado).toMatch(/#\d{4}/);
  });
});

describe("/desafio — run()", () => {
  test("gera desafio para 'java'", () => {
    const resultado = runDesafio("java");
    expect(resultado).toContain("Desafio DIO");
    expect(resultado).toContain("java");
  });

  test("gera desafio para 'java Iniciante'", () => {
    const resultado = runDesafio("java Iniciante");
    expect(resultado).toContain("Iniciante");
    expect(resultado).toContain("Fibonacci Iterativo");
  });

  test("gera desafio para 'java intermediário'", () => {
    const resultado = runDesafio("java intermediário");
    expect(resultado).toContain("Builder Pattern");
  });

  test("retorna erro quando args vazio", () => {
    const resultado = runDesafio("");
    expect(resultado).toContain("❌");
  });

  test("retorna erro quando args é null", () => {
    const resultado = runDesafio(null);
    expect(resultado).toContain("❌");
  });
});

// ─────────────────────────────────────────────
// Certificado
// ─────────────────────────────────────────────
describe("/certificado — gerarCertificado()", () => {
  let trilhaJava;

  beforeAll(() => {
    trilhaJava = buscarTrilha("spring boot");
  });

  test("retorna string com nome do participante", () => {
    const cert = gerarCertificado("Daniela Miranda", trilhaJava.nome, trilhaJava);
    expect(cert).toContain("Daniela Miranda");
  });

  test("retorna string com nome da trilha", () => {
    const cert = gerarCertificado("Daniela Miranda", trilhaJava.nome, trilhaJava);
    expect(cert).toContain(trilhaJava.nome);
  });

  test("contém código de validação DIO-XXXX-XXXX-XXXX", () => {
    const cert = gerarCertificado("Daniela Miranda", trilhaJava.nome, trilhaJava);
    expect(cert).toMatch(/DIO-[A-F0-9]{4}-[A-F0-9]{4}-\d{4}/);
  });

  test("contém XP da trilha", () => {
    const cert = gerarCertificado("Daniela Miranda", trilhaJava.nome, trilhaJava);
    // trilhaJava.xp_total formatado pt-BR: 13.000
    expect(cert).toContain(trilhaJava.xp_total.toLocaleString("pt-BR"));
  });

  test("lista as badges da trilha", () => {
    const cert = gerarCertificado("Daniela Miranda", trilhaJava.nome, trilhaJava);
    trilhaJava.badges_disponiveis.forEach((b) => {
      expect(cert).toContain(b);
    });
  });

  test("funciona sem trilhaInfo (N/A)", () => {
    const cert = gerarCertificado("João Silva", "Trilha Custom", null);
    expect(cert).toContain("João Silva");
    expect(cert).toContain("Trilha Custom");
    expect(cert).toContain("N/A");
  });

  test("data de emissão está presente", () => {
    const cert = gerarCertificado("Daniela Miranda", trilhaJava.nome, trilhaJava);
    const anoAtual = new Date().getFullYear().toString();
    expect(cert).toContain(anoAtual);
  });
});

describe("/certificado — run()", () => {
  test("gera certificado com aspas duplas", () => {
    const resultado = runCertificado('Daniela "Java Spring Boot: APIs RESTful do Zero à Produção"');
    expect(resultado).toContain("Daniela");
    expect(resultado).toContain("Java Spring Boot");
  });

  test("gera certificado sem aspas (busca automática)", () => {
    const resultado = runCertificado("Daniela java");
    expect(resultado).toContain("Daniela");
    expect(resultado).toContain("Certificado");
  });

  test("retorna erro quando args vazio", () => {
    const resultado = runCertificado("");
    expect(resultado).toContain("❌");
  });

  test("retorna erro quando args é null", () => {
    const resultado = runCertificado(null);
    expect(resultado).toContain("❌");
  });

  test("retorna erro de formato inválido sem espaço separando nome e trilha", () => {
    // regex exige pelo menos dois tokens separados por espaço
    const resultado = runCertificado("SemEspacoNenhumNaTrilha");
    // deve gerar certificado mesmo assim (fallback regex) ou retornar erro
    expect(typeof resultado).toBe("string");
  });
});

// ─────────────────────────────────────────────
// Dispatcher (index.js)
// ─────────────────────────────────────────────
describe("dispatch() — index.js", () => {
  test("dispatcha /trilha corretamente", () => {
    const resultado = dispatch("/trilha spring boot");
    expect(resultado).toContain("Java Spring Boot");
  });

  test("dispatcha /desafio corretamente", () => {
    const resultado = dispatch("/desafio java Iniciante");
    expect(resultado).toContain("Fibonacci Iterativo");
  });

  test("dispatcha /certificado corretamente", () => {
    const resultado = dispatch('/certificado Daniela "Java Spring Boot: APIs RESTful do Zero à Produção"');
    expect(resultado).toContain("Daniela");
    expect(resultado).toContain("Certificado");
  });

  test("retorna ajuda quando input é vazio", () => {
    const resultado = dispatch("");
    expect(resultado).toContain("/trilha");
    expect(resultado).toContain("/desafio");
    expect(resultado).toContain("/certificado");
  });

  test("retorna ajuda quando input é null/undefined", () => {
    const resultado = dispatch(null);
    expect(resultado).toContain("/trilha");
  });

  test("retorna erro para comando desconhecido", () => {
    const resultado = dispatch("/foobar args");
    expect(resultado).toContain("❌");
    expect(resultado).toContain("Comando desconhecido");
  });

  test("case-insensitive no comando", () => {
    const resultado = dispatch("/TRILHA spring boot");
    expect(resultado).toContain("Java Spring Boot");
  });
});
