import React from "react";
import CamposBasicos from "./components/CamposBasicos";
import VersoesTemplate from "./components/VersoesTemplate";
import Objetivo from "./components/Objetivo";
import Requisitos from "./components/Requisitos/Requisitos";
import ToolbarLateral from "./components/ToolbarLateral";
import { useTemplateStore } from "./context/TemplateContext";

import './App.css';

export default function App() {
  const { state, editarTemplate } = useTemplateStore();
  const templateAtivo = state.templates.find(t => t.id === state.ativo);

  if (!templateAtivo) {
    return (
      <div className="text-center mt-5">
        Nenhum template ativo encontrado.<br />
        Crie um novo pelo Espaço de Trabalho.
      </div>
    );
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
          <h1 className="h4">Gerador de Markdown</h1>
          <CamposBasicos template={templateAtivo} editarTemplate={editarTemplate} />
          <hr />
          <VersoesTemplate template={templateAtivo} editarTemplate={editarTemplate} />
          <hr />
          <Objetivo template={templateAtivo} editarTemplate={editarTemplate} />
          <hr />
          <Requisitos template={templateAtivo} editarTemplate={editarTemplate} />
        </div>
      </div>
      <ToolbarLateral arquivados={state.templates.filter(t => t.arquivado).length} />
    </div>
  );
}
