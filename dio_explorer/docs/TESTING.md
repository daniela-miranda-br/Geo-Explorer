# 🧪 Guia de Testes — dio_explorer

## Visão Geral

O projeto usa **Jest** como framework de testes. A suite cobre os três comandos e o dispatcher com **56 testes unitários** organizados por responsabilidade.

```
tests/
└── commands.test.js   ← única suite, 56 testes, ~0.74s de execução
```

---

## Executando os Testes

```bash
# Dentro de Dio-Class/dio_explorer/
cd Dio-Class/dio_explorer

# Executar testes com cobertura (saída no terminal)
npm test

# Executar sem cobertura (mais rápido)
npx jest

# Executar em modo watch (re-executa ao salvar)
npx jest --watch

# Executar um describe específico
npx jest -t "/trilha"

# Executar um teste específico
npx jest -t "encontra trilha Java pelo termo"
```

---

## Cobertura de Código

### Resultado atual

```
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines
----------------|---------|----------|---------|---------|------------------
certificado.js  |  100.00 |   95.00  |  100.00 |  100.00 | 123
desafio.js      |   90.90 |   80.00  |  100.00 |   93.10 | 181-182
index.js        |   88.88 |   70.00  |  100.00 |   88.23 | 52-53
trilha.js       |  100.00 |   93.75  |  100.00 |  100.00 | 32
----------------|---------|----------|---------|---------|------------------
TOTAL           |   95.09 |   86.36  |  100.00 |   95.83 |
```

**Meta configurada: 70%** em linhas, funções e statements. Resultado: **95%+** em todas as métricas.

### Linhas não cobertas (intencionais)

| Arquivo | Linhas | Motivo |
|---|---|---|
| `index.js` | 52-53 | Bloco `if (require.main === module)` — executado apenas via CLI, não via `require()` |
| `desafio.js` | 181-182 | Ramo `else` de `resolverNivel()` quando nenhum alias casa — comportamento não-determinístico (sorteio) |
| `certificado.js` | 123 | Ramo `else` do segundo regex — situação extremamente rara de input mal-formado |
| `trilha.js` | 32 | Ramo `else` do emoji de nível — apenas para nível desconhecido (`"⚪"`) |

---

## Organização dos Testes

### Estrutura por describe

```
commands.test.js
│
├── /trilha — buscarTrilha()          (4 testes)
├── /trilha — gerarPlanoDeEstudos()   (10 testes)
├── /trilha — run()                   (4 testes)
│
├── /desafio — encontrarDesafio()     (5 testes)
├── /desafio — formatarDesafio()      (9 testes)
├── /desafio — run()                  (5 testes)
│
├── /certificado — gerarCertificado() (7 testes)
├── /certificado — run()              (5 testes)
│
└── dispatch() — index.js             (7 testes)
```

### Princípios aplicados

**1. Testar o comportamento, não a implementação**

```javascript
// ✅ Correto — testa o que o usuário recebe
test("contém seção de badges", () => {
  const plano = gerarPlanoDeEstudos(trilhaJava);
  expect(plano).toContain("Badges Disponíveis");
  trilhaJava.badges_disponiveis.forEach((badge) => {
    expect(plano).toContain(badge);
  });
});

// ❌ Evitar — testa detalhes de implementação
test("badges são mapeados com .map()", () => { ... });
```

**2. Um `expect` por comportamento distinto**

```javascript
test("contém nível e XP corretamente", () => {
  const plano = gerarPlanoDeEstudos(trilhaJava);
  expect(plano).toContain(trilhaJava.nivel);    // testa nível
  expect(plano).toContain("XP Total");           // testa label do XP
});
```

**3. `beforeAll` para setup compartilhado por describe**

```javascript
describe("/trilha — gerarPlanoDeEstudos()", () => {
  let trilhaJava;

  beforeAll(() => {
    trilhaJava = buscarTrilha("spring boot");  // carrega uma vez, reutiliza em todos os testes do bloco
  });
  // ...
});
```

**4. Cobrir todos os ramos de erro**

```javascript
test("retorna instrução de uso quando args vazio", () => {
  expect(runTrilha("")).toContain("❌");
});
test("retorna instrução de uso quando args é null", () => {
  expect(runTrilha(null)).toContain("❌");
});
```

**5. Não testar detalhes aleatórios com valor fixo**

```javascript
// ✅ Correto — testa o formato sem fixar o valor
test("contém seed numérico (4 dígitos)", () => {
  const resultado = formatarDesafio(desafioJava, "Java", "Iniciante");
  expect(resultado).toMatch(/#\d{4}/);  // regex, não valor hardcoded
});

// ✅ Correto — usa o próprio objeto como referência
test("contém XP da trilha", () => {
  const cert = gerarCertificado("Daniela", trilhaJava.nome, trilhaJava);
  expect(cert).toContain(trilhaJava.xp_total.toLocaleString("pt-BR"));  // dinâmico
});
```

---

## Configuração do Jest (`package.json`)

```json
{
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "commands/**/*.js"
    ],
    "coverageThreshold": {
      "global": {
        "lines": 70,
        "functions": 70,
        "branches": 60,
        "statements": 70
      }
    }
  }
}
```

**Por que `branches: 60` e não `70`?**
Branches incluem os ramos de código não-determinísticos (sorteios aleatórios) que são intencionalmente difíceis de cobrir com testes unitários síncronos. O threshold menor reflete essa realidade sem comprometer a qualidade.

---

## Adicionando Novos Testes

### Ao adicionar um novo comando

1. Crie um novo `describe` no `tests/commands.test.js`
2. Exporte as funções internas do comando (`module.exports = { run, funcaoInterna }`)
3. Teste ao menos: happy path, args vazio, args inválido e ramos de formatação

### Ao adicionar uma nova tecnologia em `desafio.js`

```javascript
describe("/desafio — encontrarDesafio() — kotlin", () => {
  test("encontra desafio Kotlin Iniciante", () => {
    const d = encontrarDesafio("kotlin", "Iniciante");
    expect(d).toBeDefined();
    expect(d.titulo).toBe("Nome do Desafio que Você Adicionou");
  });
});
```

### Ao adicionar uma nova trilha em `trilhas_dio.json`

Os testes existentes **não precisam de alteração** — eles buscam por termo específico, não por índice. A nova trilha será encontrada automaticamente pelo `buscarTrilha()`.

---

## Relatório de Cobertura HTML

Para gerar o relatório HTML navegável:

```bash
npx jest --coverage --coverageReporters=html
# Abrir coverage/lcov-report/index.html no browser
```

O relatório mostra linha a linha quais trechos foram ou não executados.
