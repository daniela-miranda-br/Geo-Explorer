#!/usr/bin/env node
/**
 * dio_explorer — MCP Server
 *
 * Expõe os três comandos do dio_explorer como ferramentas MCP:
 *   • trilha     — busca e retorna o plano de estudos de uma trilha DIO
 *   • desafio    — gera um desafio de código para uma tecnologia/nível
 *   • certificado — emite um certificado fictício DIO
 *
 * Transporte: stdio (padrão MCP local)
 * Para uso remoto via HTTPS, configure um proxy HTTP na frente deste processo.
 *
 * Registro no mcp.json:
 *   {
 *     "mcpServers": {
 *       "dio-explorer": {
 *         "command": "node",
 *         "args": ["/caminho/para/Dio-Class/dio_explorer/mcp/build/index.js"]
 *       }
 *     }
 *   }
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Permite importar os módulos CJS existentes (commands/*.js) a partir do ESM
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Caminho para os comandos CJS do dio_explorer
const commandsPath = resolve(__dirname, "../../commands");

const trilhaCmd   = require(`${commandsPath}/trilha.js`);
const desafioCmd  = require(`${commandsPath}/desafio.js`);
const certCmd     = require(`${commandsPath}/certificado.js`);

// ─────────────────────────────────────────────
// Instância do servidor MCP
// ─────────────────────────────────────────────
const server = new McpServer({
  name: "dio-explorer",
  version: "1.0.0",
});

// ─────────────────────────────────────────────
// Tool: trilha
// ─────────────────────────────────────────────
server.registerTool(
  "trilha",
  {
    description:
      "Busca uma trilha de aprendizado DIO pela tecnologia e retorna o plano de estudos " +
      "completo com módulos, badges, XP e informações da trilha. " +
      "Exemplos de tecnologia: Java, Python, React, Docker, AWS, Flutter, Go, Rust.",
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe(
          "Nome da tecnologia ou termo de busca (ex: 'java', 'spring boot', 'python', 'react')"
        ),
    }),
  },
  async ({ tecnologia }) => {
    try {
      const resultado: string = trilhaCmd.run(tecnologia);
      return {
        content: [{ type: "text" as const, text: resultado }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Erro ao buscar trilha: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ─────────────────────────────────────────────
// Tool: desafio
// ─────────────────────────────────────────────
server.registerTool(
  "desafio",
  {
    description:
      "Gera um desafio de código aleatório com enunciado, dicas e esqueleto baseado na " +
      "tecnologia e nível escolhidos. Tecnologias suportadas: javascript, python, java, " +
      "react, docker. Níveis: Iniciante, Intermediário, Avançado.",
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe("Tecnologia alvo do desafio (ex: 'java', 'python', 'javascript', 'react')"),
      nivel: z
        .enum(["Iniciante", "Intermediário", "Avançado"])
        .optional()
        .describe("Nível de dificuldade. Se omitido, será sorteado aleatoriamente."),
    }),
  },
  async ({ tecnologia, nivel }) => {
    try {
      const args = nivel ? `${tecnologia} ${nivel}` : tecnologia;
      const resultado: string = desafioCmd.run(args);
      return {
        content: [{ type: "text" as const, text: resultado }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Erro ao gerar desafio: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ─────────────────────────────────────────────
// Tool: certificado
// ─────────────────────────────────────────────
server.registerTool(
  "certificado",
  {
    description:
      "Emite um certificado fictício DIO para um participante que concluiu uma trilha. " +
      "O certificado inclui código de validação único, XP conquistado e badges. " +
      "A trilha é buscada automaticamente no catálogo DIO pelo nome fornecido.",
    inputSchema: z.object({
      nome: z
        .string()
        .describe("Nome completo do participante (ex: 'Daniela Miranda')"),
      trilha: z
        .string()
        .describe(
          "Nome ou tecnologia da trilha concluída (ex: 'Java Spring Boot', 'Python', 'React')"
        ),
    }),
  },
  async ({ nome, trilha }) => {
    try {
      const args = `${nome} "${trilha}"`;
      const resultado: string = certCmd.run(args);
      return {
        content: [{ type: "text" as const, text: resultado }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Erro ao gerar certificado: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ─────────────────────────────────────────────
// Recurso: lista de trilhas disponíveis
// ─────────────────────────────────────────────
server.registerResource(
  "trilhas-disponiveis",
  "dio://trilhas",
  {
    description: "Lista completa de todas as trilhas de aprendizado disponíveis no catálogo DIO",
    mimeType: "application/json",
  },
  async () => {
    try {
      const { readFileSync } = await import("fs");
      const dataPath = resolve(__dirname, "../../data/trilhas_dio.json");
      const raw = readFileSync(dataPath, "utf-8");
      const { trilhas } = JSON.parse(raw);

      const resumo = trilhas.map((t: {
        id: number;
        nome: string;
        tecnologia: string;
        nivel: string;
        xp_total: number;
        numero_de_modulos: number;
      }) => ({
        id: t.id,
        nome: t.nome,
        tecnologia: t.tecnologia,
        nivel: t.nivel,
        xp_total: t.xp_total,
        numero_de_modulos: t.numero_de_modulos,
      }));

      return {
        contents: [
          {
            uri: "dio://trilhas",
            mimeType: "application/json",
            text: JSON.stringify(resumo, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri: "dio://trilhas",
            mimeType: "text/plain",
            text: `Erro ao carregar trilhas: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// ─────────────────────────────────────────────
// Inicialização
// ─────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[dio-explorer-mcp] Servidor iniciado via stdio.");
  console.error("[dio-explorer-mcp] Ferramentas disponíveis: trilha | desafio | certificado");
  console.error("[dio-explorer-mcp] Recurso disponível: dio://trilhas");
}

main().catch((error) => {
  console.error("[dio-explorer-mcp] Erro fatal:", error);
  process.exit(1);
});
