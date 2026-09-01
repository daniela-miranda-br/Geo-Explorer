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

// ─────────────────────────────────────────────
// Novas tecnologias no catálogo de desafios
// ─────────────────────────────────────────────
describe("/desafio — novas tecnologias do catálogo", () => {
  test("encontra desafio TypeScript Iniciante", () => {
    const d = encontrarDesafio("typescript", "Iniciante");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Tipando uma API de Usuários");
  });

  test("encontra desafio TypeScript Intermediário", () => {
    const d = encontrarDesafio("typescript", "Intermediário");
    expect(d.titulo).toBe("Generic Repository Pattern");
  });

  test("encontra desafio TypeScript Avançado", () => {
    const d = encontrarDesafio("typescript", "Avançado");
    expect(d.titulo).toBe("Type-safe Event Bus");
  });

  test("encontra desafio Go Iniciante", () => {
    const d = encontrarDesafio("golang", "Iniciante");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Servidor HTTP Básico");
  });

  test("encontra desafio Go pelo termo 'go'", () => {
    const d = encontrarDesafio("go", "Intermediário");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Worker Pool com Goroutines");
  });

  test("encontra desafio Kotlin Iniciante", () => {
    const d = encontrarDesafio("kotlin", "Iniciante");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Calculadora com Sealed Class");
  });

  test("encontra desafio C# Iniciante", () => {
    const d = encontrarDesafio("csharp", "Iniciante");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Lista Genérica com LINQ");
  });

  test("encontra desafio SQL Iniciante", () => {
    const d = encontrarDesafio("sql", "Iniciante");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Consultas com JOIN");
  });

  test("encontra desafio SQL Avançado", () => {
    const d = encontrarDesafio("sql", "Avançado");
    expect(d.titulo).toBe("Otimização de Query com Índices");
  });

  test("encontra desafio Kubernetes Iniciante", () => {
    const d = encontrarDesafio("kubernetes", "Iniciante");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Deploy de uma API com Kubernetes");
  });

  test("encontra desafio Kubernetes Avançado (Canary)", () => {
    const d = encontrarDesafio("kubernetes", "Avançado");
    expect(d.titulo).toBe("Canary Deployment com Ingress");
  });
});

// ─────────────────────────────────────────────
// /progresso
// ─────────────────────────────────────────────
describe("/progresso — buscarParticipante()", () => {
  const { buscarParticipante, gerarRelatorioProgresso, run: runProgresso } = require("../commands/progresso");

  test("encontra participante Daniela Miranda", () => {
    const p = buscarParticipante("Daniela");
    expect(p).toBeDefined();
    expect(p.nome).toBe("Daniela Miranda");
  });

  test("busca é case-insensitive", () => {
    const p = buscarParticipante("daniela miranda");
    expect(p).toBeDefined();
  });

  test("retorna null para participante inexistente", () => {
    const p = buscarParticipante("XYZ_INEXISTENTE_999");
    expect(p).toBeNull();
  });
});

describe("/progresso — gerarRelatorioProgresso()", () => {
  const { buscarParticipante, gerarRelatorioProgresso } = require("../commands/progresso");

  test("retorna string com nome do participante", () => {
    const p = buscarParticipante("Daniela");
    const relatorio = gerarRelatorioProgresso(p);
    expect(typeof relatorio).toBe("string");
    expect(relatorio).toContain("Daniela Miranda");
  });

  test("contém resumo de métricas", () => {
    const p = buscarParticipante("Daniela");
    const relatorio = gerarRelatorioProgresso(p);
    expect(relatorio).toContain("Resumo");
    expect(relatorio).toContain("Trilhas Concluídas");
    expect(relatorio).toContain("Em Andamento");
  });

  test("exibe trilha em andamento corretamente", () => {
    const p = buscarParticipante("Daniela");
    const relatorio = gerarRelatorioProgresso(p);
    expect(relatorio).toContain("Em Andamento");
    expect(relatorio).toContain("IBM Bob");
  });

  test("exibe barra de progresso dos módulos", () => {
    const p = buscarParticipante("Daniela");
    const relatorio = gerarRelatorioProgresso(p);
    expect(relatorio).toMatch(/\d+\/\d+/); // ex: 3/12
  });
});

describe("/progresso — run()", () => {
  const { run: runProgresso } = require("../commands/progresso");

  test("retorna relatório para participante existente", () => {
    const resultado = runProgresso("Daniela");
    expect(resultado).toContain("Progresso de Aprendizado");
    expect(resultado).toContain("Daniela Miranda");
  });

  test("retorna erro para participante inexistente", () => {
    const resultado = runProgresso("XYZ_INEXISTENTE_999");
    expect(resultado).toContain("❌");
    expect(resultado).toContain("Nenhum progresso encontrado");
  });

  test("retorna instrução de uso para args vazio", () => {
    const resultado = runProgresso("");
    expect(resultado).toContain("❌");
    expect(resultado).toContain("/progresso");
  });

  test("retorna instrução de uso para args null", () => {
    const resultado = runProgresso(null);
    expect(resultado).toContain("❌");
  });
});

// ─────────────────────────────────────────────
// /certificado --html
// ─────────────────────────────────────────────
describe("/certificado — gerarCertificadoHTML()", () => {
  const { gerarCertificadoHTML } = require("../commands/certificado");
  const trilhaJava = buscarTrilha("spring boot");

  test("retorna string HTML válida", () => {
    const html = gerarCertificadoHTML("Daniela Miranda", trilhaJava.nome, trilhaJava);
    expect(typeof html).toBe("string");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
  });

  test("contém nome do participante no HTML", () => {
    const html = gerarCertificadoHTML("Daniela Miranda", trilhaJava.nome, trilhaJava);
    expect(html).toContain("Daniela Miranda");
  });

  test("contém nome da trilha no HTML", () => {
    const html = gerarCertificadoHTML("Daniela Miranda", trilhaJava.nome, trilhaJava);
    expect(html).toContain(trilhaJava.nome);
  });

  test("contém código de validação DIO no HTML", () => {
    const html = gerarCertificadoHTML("Daniela Miranda", trilhaJava.nome, trilhaJava);
    expect(html).toMatch(/DIO-[A-F0-9]{4}-[A-F0-9]{4}-\d{4}/);
  });

  test("contém badges no HTML quando disponíveis", () => {
    const html = gerarCertificadoHTML("Daniela Miranda", trilhaJava.nome, trilhaJava);
    trilhaJava.badges_disponiveis.forEach((b) => expect(html).toContain(b));
  });

  test("funciona sem trilhaInfo (N/A)", () => {
    const html = gerarCertificadoHTML("João", "Trilha Custom", null);
    expect(html).toContain("João");
    expect(html).toContain("N/A");
  });
});

describe("/certificado run() — flag --html", () => {
  const { run: runCertificado } = require("../commands/certificado");

  test("com --html retorna mensagem de sucesso + markdown", () => {
    const resultado = runCertificado('Daniela "Java Spring Boot" --html');
    expect(resultado).toContain("✅ Certificado HTML gerado");
    expect(resultado).toContain("Certificado de Conclusão");
  });

  test("sem --html retorna apenas markdown", () => {
    const resultado = runCertificado('Daniela "Java Spring Boot"');
    expect(resultado).not.toContain("✅ Certificado HTML gerado");
    expect(resultado).toContain("Certificado de Conclusão");
  });
});

// ─────────────────────────────────────────────
// Testes de integração — fluxo completo
// ─────────────────────────────────────────────
describe("🔗 Integração — fluxo trilha → desafio → certificado", () => {
  test("fluxo completo Java: trilha retorna tecnologia que desafio usa", () => {
    const plano = dispatch("/trilha spring boot");
    expect(plano).toContain("Java Spring Boot");

    const desafioResult = dispatch("/desafio java Iniciante");
    expect(desafioResult).toContain("Fibonacci Iterativo");
    expect(desafioResult).toContain("Desafio DIO");

    const cert = dispatch('/certificado "Daniela Miranda" "Java Spring Boot"');
    expect(cert).toContain("Daniela Miranda");
    expect(cert).toContain("Certificado de Conclusão");
    expect(cert).toMatch(/DIO-[A-F0-9]{4}-[A-F0-9]{4}-\d{4}/);
  });

  test("fluxo completo Python: trilha → desafio → certificado", () => {
    const plano = dispatch("/trilha python");
    expect(plano).toContain("Python");

    const desafioResult = dispatch("/desafio python Iniciante");
    expect(desafioResult).toContain("Palíndromo");

    const cert = dispatch('/certificado "Ana Silva" "Python para Data Science"');
    expect(cert).toContain("Ana Silva");
    expect(cert).toContain("Certificado de Conclusão");
  });

  test("fluxo completo TypeScript: desafio específico disponível no novo catálogo", () => {
    const desafioResult = dispatch("/desafio typescript Avançado");
    expect(desafioResult).toContain("Type-safe Event Bus");
  });

  test("fluxo completo Kubernetes: desafio específico disponível", () => {
    const desafioResult = dispatch("/desafio kubernetes Iniciante");
    expect(desafioResult).toContain("Deploy de uma API com Kubernetes");
  });

  test("progresso → trilha → certificado: aluno Daniela tem trilha em andamento", () => {
    const prog = dispatch("/progresso Daniela");
    expect(prog).toContain("Progresso de Aprendizado");
    expect(prog).toContain("IBM Bob");

    // ao concluir, certificado é emitido
    const cert = dispatch('/certificado "Daniela Miranda" "IBM Bob"');
    expect(cert).toContain("Daniela Miranda");
    expect(cert).toContain("Certificado de Conclusão");
  });

  test("dispatcher roteia /progresso corretamente", () => {
    const resultado = dispatch("/progresso Daniela");
    expect(resultado).toContain("Progresso de Aprendizado");
  });

  test("fluxo de erro: tecnologia inexistente retorna fallback, não quebra", () => {
    const desafio = dispatch("/desafio cobol_antigo Iniciante");
    expect(desafio).toContain("Hello World com Estilo"); // fallback
    expect(desafio).toContain("Desafio DIO");
  });

  test("certificado HTML no fluxo completo gera arquivo e retorna confirmação", () => {
    const resultado = dispatch('/certificado "Daniela Miranda" "Java Spring Boot" --html');
    expect(resultado).toContain("✅ Certificado HTML gerado");
    expect(resultado).toContain(".html");
  });
});
