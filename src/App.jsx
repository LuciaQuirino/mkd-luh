import { useEffect } from "react";
import CamposBasicos from "./components/CamposBasicos";
import VersoesTemplate from "./components/VersoesTemplate";
import Objetivo from "./components/Objetivo";
import Requisitos from "./components/Requisitos/Requisitos";
import ToolbarLateral from "./components/ToolbarLateral";
import { useTemplateStore } from "./context/TemplateContext";
import EasterEggHippo from "./components/EasterEggHippo";

import './App.css';

export default function App() {
  const { state, editarTemplate, adicionarTemplate } = useTemplateStore();
  const templateAtivo = Array.isArray(state.templates)
    ? state.templates.find((t) => t.id === state.ativo)
    : undefined;

  useEffect(() => {
    document.title = templateAtivo?.projeto
      ? `Markdown - ${templateAtivo.projeto}`
      : "Markdown editor";
  }, [templateAtivo?.projeto]);

  const templateMock = {
    nome: "",
    versao: "",
    data: new Date().toISOString().split("T")[0],
    autor: "",
    alteracoes: "",
    versoes: [],
    objetivo: "",
    projeto: "",
    escopoProjeto: "#",
    analiseRequisitos: "#",
    foraEscopo: [],
    times: [],
    requisitos: [],
    arquivado: false,
  };

  function handleEdit(dados) {
    if (!templateAtivo) {
      const id =
        crypto.randomUUID?.() || (Date.now() + Math.random()).toString(36);
      adicionarTemplate({ ...templateMock, ...dados, id });
    } else {
      editarTemplate(templateAtivo.id, dados);
    }
  }

  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-start">
      <div
        className="card border border-secondary"
        style={{
          width: "100%",
          height: "calc(100vh - 2rem)",
          margin: "1rem 15rem 1rem 1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="card-body"
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          <h1 className="h4 d-flex align-items-center">
            Markdown editor
            {((templateAtivo?.times && templateAtivo.times.length > 0) ||
              (templateMock.times && templateMock.times.length > 0)) && (
              <span
                className="ms-2 text-muted"
                style={{ fontSize: "1rem", fontWeight: 400 }}
              >
                (
                {templateAtivo &&
                templateAtivo.times &&
                templateAtivo.times.length > 0
                  ? templateAtivo.times.join(" - ")
                  : templateMock.times.join(" - ")}
                )
              </span>
            )}
          </h1>

          <CamposBasicos
            template={templateAtivo || templateMock}
            onEdit={handleEdit}
          />
          <hr />
          <VersoesTemplate
            template={templateAtivo || templateMock}
            onEdit={handleEdit}
          />
          <hr />
          <Objetivo
            template={templateAtivo || templateMock}
            onEdit={handleEdit}
          />
          <hr />
          <Requisitos
            template={templateAtivo || templateMock}
            onEdit={handleEdit}
          />
          <EasterEggHippo show={/domar/i.test(templateAtivo?.projeto || "")} />
        </div>
      </div>
      <ToolbarLateral
        arquivados={(state.templates || []).filter((t) => t.arquivado).length}
      />
    </div>
  );
}
