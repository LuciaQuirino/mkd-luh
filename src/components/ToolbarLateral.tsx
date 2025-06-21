import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faBoxArchive,
  faFileExport,
  faFileImport,
  faClipboard,
  faTrash,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";

export default function ToolbarFlutuante({ arquivados = 0 }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 40,
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
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
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
          <MenuButton icon={faListUl} label="Sumário" disabled />
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
          <MenuButton
            icon={faClipboard}
            label="Copiar"
            disabled
          />
          <MenuButton
            icon={faTrash}
            label={<span style={{ color: "#e55353" }}>Limpar templates</span>}
            style={{ marginTop: 8, border: "none", background: "transparent" }}
            disabled
          />
          <div
            style={{
              fontSize: 11,
              color: "#ccc",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Desenvolvido por Lúcia Quirino
          </div>
        </div>
      )}
    </div>
  );
}

type MenuButtonProps = {
  icon: any;
  label: any;
  disabled?: boolean;
  style?: React.CSSProperties;
};

// Botão de menu estilizado
function MenuButton({ icon, label, disabled = false, style = {} }: MenuButtonProps) {
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
    >
      {icon && (
        <FontAwesomeIcon icon={icon} style={{ marginRight: 8, opacity: 0.75 }} />
      )}
      {label}
    </Button>
  );
}
