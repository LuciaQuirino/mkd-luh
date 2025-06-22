import React, { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faListUl,
  faLayerGroup,
  faClipboard,
  faUpload,
  faFileExport,
  faTrash,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { useTemplateStore } from "../context/TemplateContext";
import SumarioModal from "../common/SumarioModal";
import EspacoTrabalhoModal from "./EspacoTrabalhoModal/EspacoTrabalhoModal";
import VisualizarModal from "./VisualizarModal";
import { gerarMarkdownDoTemplate } from "../common/Helpers";

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
        fontSize: 12,
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
  const { limparTemplates, importarTemplates, state } = useTemplateStore();
  const [open, setOpen] = useState(false);
  const [showSumario, setShowSumario] = useState(false);
  const [showEspacoTrabalho, setShowEspacoTrabalho] = useState(false);

  const [showVisualizar, setShowVisualizar] = useState(false);

  const templateAtivo = state.templates.find((t) => t.id === state.ativo);

  function getMarkdownAtivo() {
    if (!templateAtivo) return "Nenhum template ativo!";
    return gerarMarkdownDoTemplate(templateAtivo);
  }

  async function handleLimparTemplates() {
    const result = await Swal.fire({
      title: "Limpar tudo?",
      text: "Todos os templates serão apagados. Essa ação é irreversível!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, limpar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      limparTemplates();
      Swal.fire("Pronto!", "Templates limpos.", "success");
    }
  }

  // Importar do arquivo
  function handleImportarTodos(e) {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then((text) => {
      let templates;
      try {
        templates = JSON.parse(text);
      } catch {
        return alert("Arquivo inválido.");
      }
      if (!Array.isArray(templates)) return alert("O arquivo não é uma lista.");
      importarTemplates(templates);
      Swal.fire("Pronto!", "Templates importados!", "success");
    });
  }

  // Exportar para arquivo
  function handleExportarTodos() {
    const blob = new Blob([JSON.stringify(state.templates, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meus-templates.json";
    a.click();
    URL.revokeObjectURL(url);
  }

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
              <small>
                Espaço de Trabalho{" "}
                <small style={{ opacity: 0.7 }}>
                  ({state.templates.length})
                </small>
              </small>
            }
            onClick={() => setShowEspacoTrabalho(true)}
          />
          <MenuButton
            icon={faListUl}
            label="Sumário"
            onClick={() => setShowSumario(true)}
            disabled={!templateAtivo}
          />
          <MenuButton
            icon={faEye}
            label="Visualizar"
            onClick={() => setShowVisualizar(true)}
            disabled={!templateAtivo}
          />
          <MenuButton
            icon={faClipboard}
            label="Copiar"
            onClick={() => {
              const markdown = gerarMarkdownDoTemplate(templateAtivo);
              navigator.clipboard.writeText(markdown).then(() =>
                Swal.fire({
                  toast: true,
                  position: "top-end",
                  icon: "success",
                  title: "Markdown copiado!",
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true,
                })
              );
            }}
            disabled={!templateAtivo}
          />
          <input
            type="file"
            accept="application/json"
            id="input-importar-todos"
            style={{ display: "none" }}
            onChange={handleImportarTodos}
          />
          <MenuButton
            icon={faUpload}
            label="Importar espaço de trabalho"
            onClick={() =>
              document.getElementById("input-importar-todos")?.click()
            }
            disabled={false}
          />
          <MenuButton
            icon={faFileExport}
            label="Exportar espaço de trabalho"
            onClick={handleExportarTodos}
            disabled={state.templates.length === 0}
          />
          <MenuButton
            icon={faTrash}
            label={
              <small style={{ color: "#e55353" }}>
                Limpar espaço de trabalho
              </small>
            }
            style={{
              color: "rgb(229, 83, 83)",
              marginTop: 8,
              border: "none",
              background: "transparent",
            }}
            onClick={handleLimparTemplates}
            disabled={state.templates.length === 0}
          />
        </div>
      )}

      <SumarioModal
        show={showSumario}
        onClose={() => setShowSumario(false)}
        requisitos={templateAtivo?.requisitos ?? []}
        onSelecionar={handleSelecionarRequisito}
      />

      <EspacoTrabalhoModal
        show={showEspacoTrabalho}
        onClose={() => setShowEspacoTrabalho(false)}
      />

      <VisualizarModal
        show={showVisualizar}
        onClose={() => setShowVisualizar(false)}
        markdown={getMarkdownAtivo()}
      />
    </div>
  );
}
