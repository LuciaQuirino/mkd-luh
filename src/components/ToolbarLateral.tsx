import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faListUl,
  faLayerGroup,
  faClipboard,
  faTrash,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { useTemplateStore } from "../context/TemplateContext";
import SumarioModal from "../common/SumarioModal";
import EspacoTrabalhoModal from "./EspacoTrabalhoModal/EspacoTrabalhoModal";

function MenuButton({ icon, label, disabled = false, style = {}, onClick = () => {} }) {
  return (
    <Button
      variant="secondary"
      disabled={disabled}
      style={{
        background: "#23272F",
        border: "none",
        opacity: 0.9,
        color: disabled ? "#aaa" : "#fff",
        fontWeight: 400,
        fontSize: 16,
        borderRadius: 8,
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      tabIndex={-1}
      onClick={disabled ? undefined : onClick}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          style={{ marginRight: 8, opacity: 0.75 }}
        />
      )}
      {label}
    </Button>
  );
}

export default function ToolbarLateral({ arquivados = 0 }) {
  const [open, setOpen] = useState(false);
  const [showSumario, setShowSumario] = useState(false);
  const [showEspacoTrabalho, setShowEspacoTrabalho] = useState(false);

  const { state } = useTemplateStore();
  const templateAtivo = state.templates.find(t => t.id === state.ativo);

  function handleSelecionarRequisito(idx) {
    setShowSumario(false);
    setTimeout(() => {
      const el = document.getElementById(`requisito-${idx}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.dispatchEvent(new CustomEvent("abrirAccordion"));
      }
    }, 300);
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        bottom: 17,
        zIndex: 1100,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      {/* Botão flutuante */}
      <Button
        variant="dark"
        style={{
          borderRadius: "50%",
          width: 48,
          height: 48,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} size="lg" />
      </Button>

      {/* Menu suspenso */}
      {open && (
        <div
          style={{
            background: "#22272B",
            color: "#fff",
            borderRadius: 18,
            minWidth: 190,
            padding: "18px 18px 8px 18px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "stretch",
            marginTop: 6,
          }}
        >
          <MenuButton
            icon={faLayerGroup}
            label={
              <span>
                Espaço de Trabalho{" "}
                <span style={{ opacity: 0.7 }}>({state.templates.length})</span>
              </span>
            }
            onClick={() => setShowEspacoTrabalho(true)}
          />
          <MenuButton
            icon={faListUl}
            label="Sumário"
            onClick={() => setShowSumario(true)}
            disabled={!templateAtivo}
          />
          <MenuButton icon={faEye} label="Visualizar" disabled />
          <MenuButton icon={faClipboard} label="Copiar" disabled />
          <MenuButton
            icon={faTrash}
            label={<span style={{ color: "#e55353" }}>Limpar templates</span>}
            style={{ marginTop: 8, border: "none", background: "transparent" }}
            disabled
          />
        </div>
      )}

      <SumarioModal
        show={showSumario}
        onClose={() => setShowSumario(false)}
        requisitos={templateAtivo?.requisitos ?? []}
        onSelecionar={handleSelecionarRequisito}
      />

      {/* Aqui você coloca o modal de workspace quando criar */}
      {/* <EspacoTrabalhoModal show={showEspacoTrabalho} onClose={() => setShowEspacoTrabalho(false)} /> */}
    </div>
  );
}
