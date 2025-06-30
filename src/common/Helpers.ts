import TurndownService from 'turndown';

const turndown = new TurndownService();

export function gerarMarkdownDoTemplate(template) {
  if (!template) return '';

  turndown.addRule("heading", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function (content, node) {
      var hLevel = Number(node.nodeName.charAt(1));
      var prefix = "#".repeat(hLevel);
      return `\n\n${prefix} ${content}\n\n`;
    },
  });

  const timesSelecionados = (template.times || []).map(i => `[${i}]`).join(' - ');

  const historicoVersoes =
  (template.versoes || []).length > 0
    ? `
| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
${template.versoes
  .map(
    (v) =>
      `| ${v.versao || '-'} | ${v.data || '-'} | ${v.autor || '-'} | ${v.alteracoes || '-'} |`
  )
  .join('\n')}
`
    : '*Nenhuma versão cadastrada*';

  const foraEscopo =
    (template.foraEscopo || []).length > 0
      ? (template.foraEscopo || []).map((e) => `- ${e}`).join("\n")
      : "*Nenhum item fora do escopo*";

  turndown.addRule("table", {
    filter: ["table"],
    replacement: function (content, node) {
      let rows = Array.from(node.querySelectorAll("tr"));

      if (!rows.length) return "";

      const headers = Array.from(rows.shift().querySelectorAll("th, td")).map(
        (cell) => `**${cell.textContent.trim()}**`
      );

      const separator = headers.map(() => "---");

      const body = rows.map((row) =>
        Array.from(row.querySelectorAll("td, th"))
          .map((cell) => cell.textContent.trim())
          .join(" | ")
      );

      return `
${headers.join(" | ")}
${separator.join(" | ")}
${body.join("\n")}
`;
    },
  });

  // REQUISITOS
  let requisitosMd = '';
  (template.requisitos || []).forEach((requisito, i) => {
    requisitosMd += `\n\n**${requisito.titulo || `Requisito ${i + 1}`}**\n\n`;
    (requisito.stories || []).forEach((story, j) => {
      const regrasMarkdown = story.regrasHTML
        ? turndown.turndown(story.regrasHTML).trim()
        : "";

        requisitosMd += `

**${story.userStory || "-"}**

${story.introducao || ""}
- **Sistema:** ${story.sistema || "-"}
- **Caminho:** ${story.caminho || "-"}
${regrasMarkdown ? `- **Regras:**\n\n\n${regrasMarkdown}` : ""}
`;

if (story.temFuncionalidade) {
  requisitosMd += `
**Funcionalidade**
| Nome da Funcionalidade | Caminho no Menu do Sistema/Perfil | Descrição |
|------------------------|------------------------------------|-----------|
| ${story.funcName || ""} | ${story.path || ""} | ${story.descFunc || ""} |
`;
}

// espaçamento extra
requisitosMd += '\n\n\n';


    });
  });

  if (!requisitosMd.trim()) requisitosMd = "*Nenhum requisito cadastrado*";

  return `
# ${timesSelecionados ? timesSelecionados : ''} ${template.projeto || ''}

**Escopo do Projeto:** ${template.escopoProjeto || '-'}  
**Análise de Requisitos:** ${template.analiseRequisitos || '-'}

## Controle de Versões

${historicoVersoes}

## Objetivo

${template.objetivo || '*'}

## Itens fora do escopo

${foraEscopo}

## Requisitos
${requisitosMd}
  `.trim();
}

export function getStorageUsage() {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    total += key.length + (value ? value.length : 0);
  }
  // 1 char = 2 bytes em UTF-16, mas browsers geralmente contam como 1 byte para localStorage (ASCII/UTF-8)
  // Se quiser estimar mais justo: totalBytes = total * 2;
  return {
    bytes: total,
    kb: (total / 1024).toFixed(2),
    mb: (total / (1024 * 1024)).toFixed(2),
    percent: ((total / (5 * 1024 * 1024)) * 100).toFixed(1), // Limite de 5MB
  };
}

export function formatarDataBR(date) {
  if (!date) return "";
  // Se vier string ISO: "2025-06-21"
  if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`;
  }
  // Se for Date:
  if (date instanceof Date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }
  return date; // fallback (caso já esteja em BR)
}
