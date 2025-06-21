import React from "react";
import CamposBasicos from "./components/CamposBasicos";
import VersoesTemplate from "./components/VersoesTemplate";
import Objetivo from "./components/Objetivo";
import Requisitos from "./components/Requisitos/Requisitos";
import ToolbarLateral from "./components/ToolbarLateral";

import './App.css';

export default function App() {
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
          <CamposBasicos />
          <hr />
          <VersoesTemplate />
          <hr />
          <Objetivo />
          <hr />
          <Requisitos />
        </div>
      </div>
      <ToolbarLateral arquivados={0} />
    </div>
  );
}
