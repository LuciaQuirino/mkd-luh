import React from "react";
import CamposBasicos from "./components/CamposBasicos";
import VersoesTemplate from "./components/VersoesTemplate";
import Objetivo from "./components/Objetivo";
import Requisitos from "./components/Requisitos/Requisitos";

import './App.css';

export default function App() {
  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-start">
      <div
        className="card border border-secondary"
        style={{
          width: "100%",
          marginLeft: "1rem",
          marginRight: "6rem",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div className="card-body">
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
    </div>
  );
}
