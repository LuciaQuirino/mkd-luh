import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faListUl,
  faFileExport,
  faFileImport,
  faBoxArchive,
  faClipboard,
  faTrash,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { useTemplateStore } from "../context/TemplateContext";
import SumarioModal from "../common/SumarioModal";

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

export default function ToolbarFlutuante() {
  const [open, setOpen] = useState(false);
  const [showSumario, setShowSumario] = useState(false);

  const { template } = useTemplateStore();

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
            icon={faListUl}
            label="Sumário"
            onClick={() => setShowSumario(true)}
          />
          <MenuButton icon={faEye} label="Visualizar" disabled />
          <MenuButton icon={faFileExport} label="Exportar JSON" disabled />
          <MenuButton icon={faFileImport} label="Importar JSON" disabled />
          <MenuButton icon={faBoxArchive} label="Arquivar" disabled />
          <MenuButton
            icon={faBoxArchive}
            label={
              <span>
                Arquivados <span style={{ opacity: 0.8 }}>(0)</span>
              </span>
            }
            disabled
          />
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
        requisitos={template.requisitos}
        onSelecionar={handleSelecionarRequisito}
      />
    </div>
  );
}
