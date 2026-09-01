---
name: certificado
description: Use quando o usuário invocar /certificado <nome> "<trilha>" — gera um certificado fictício em Markdown com nome do participante, trilha concluída, badges, XP e código de validação único.
metadata:
  argument-hint: "<seu-nome> \"<nome da trilha>\""
---

# Skill: /certificado

Quando ativada, siga os passos abaixo.

## 1. Extrair nome e trilha dos argumentos

O usuário chama assim:
- `/certificado Daniela "Python para Data Science e Machine Learning"`
- `/certificado "João Silva" React`

- **nome:** tudo antes das aspas (ou primeiro token)
- **trilha:** conteúdo entre aspas, ou o restante após o nome

Se os argumentos estiverem incompletos, peça nome e trilha ao usuário.

## 2. Buscar informações da trilha (opcional)

Use `read_file` para ler `Dio-Class/dio_explorer/data/trilhas_dio.json` e tente encontrar a trilha pelo nome ou tecnologia (busca case-insensitive).

- Se encontrar: use `xp_total`, `nivel`, `tecnologia`, `badges_disponiveis` e `numero_de_modulos` da trilha.
- Se não encontrar: use valores genéricos (nível "Concluído", XP "N/A", sem badges específicas).

## 3. Gerar código de validação único

Crie um código no formato: `DIO-XXXX-XXXX-NNNN`
- `XXXX-XXXX`: 8 caracteres hexadecimais derivados do nome + trilha (pode ser criativo/fictício, mas consistente)
- `NNNN`: 4 dígitos numéricos aleatórios

Exemplo: `DIO-A3F2-91BC-4728`

## 4. Emitir o certificado no seguinte formato Markdown

```
# 🎓 Certificado de Conclusão

---

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           🏅  DIGITAL INNOVATION ONE — DIO  🏅              ║
║                                                              ║
║                  CERTIFICADO DE CONCLUSÃO                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

---

## Certificamos que

# 🧑‍💻 <NOME DO PARTICIPANTE>

concluiu com êxito a trilha de aprendizado:

## 📚 <NOME DA TRILHA>

---

| Campo              | Detalhe                          |
|--------------------|----------------------------------|
| 🛠️ Tecnologia      | <tecnologia>                     |
| 📊 Nível           | <nivel>                          |
| ⭐ XP Conquistado  | <xp_total> XP                    |
| 📅 Data de Emissão | <data atual por extenso>         |
| 🔑 Código          | `DIO-XXXX-XXXX-NNNN`             |

---

## 🏅 Badges Conquistadas    ← omitir se não houver badges

- 🎖️ <badge 1>
- 🎖️ <badge 2>
- 🎖️ <badge 3>

---

## Declaração

> *Este certificado atesta que o(a) participante demonstrou dedicação,
> comprometimento e domínio dos conteúdos apresentados ao longo da trilha,
> desenvolvendo habilidades práticas e teóricas reconhecidas pela
> comunidade DIO.*

---

  ___________________________      ___________________________
 |                           |    |                           |
 |   <Nome do Participante>  |    |   IBM Bob                 |
 |   Participante            |    |   Assistente Oficial      |
 |___________________________|    |___________________________|

---

<sub>🔐 Código de validação: `DIO-XXXX-XXXX-NNNN` — Emitido em <data> via dio_explorer</sub>
<sub>📎 Verifique em: https://github.com/daniela-miranda-br/Dio-Class</sub>
```

## 5. Dica pós-certificado

Termine com uma mensagem motivacional curta e divertida do Bob, parabenizando o usuário e sugerindo o próximo passo (ex: `/trilha <próxima tecnologia>`).
