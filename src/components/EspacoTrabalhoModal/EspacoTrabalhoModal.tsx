import { useState } from "react";
import { Button, Card, Badge, Row, Col, Modal } from "react-bootstrap";
import { useTemplateStore } from "../../context/TemplateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStorageUsage } from "../../common/Helpers";
import {
  faArrowRight,
  faArrowLeft,
  faTrash,
  faFileExport,
  faFileImport,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import "./EspacoTrabalhoModal.css";

export function TemplateCard({
  template,
  ativo,
  onArquivar,
  onDesarquivar,
  onExcluir,
}) {
  function handleExport(template) {
    const dataStr = JSON.stringify(template, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `template-${template.projeto || template.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card
      className={`mb-3 ${
        ativo ? "border-primary shadow-sm" : "border-secondary"
      }`}
      style={{
        background: ativo ? "#e9f5ff" : "#fff",
        borderWidth: ativo ? 2 : 1,
        minHeight: 110,
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
        padding: 0,
      }}
    >
      <Card.Body style={{ padding: "1rem 1.2rem 0.6rem 1.2rem" }}>
        <Card.Title as="h6" className="mb-2" style={{ fontWeight: 600 }}>
          {template.nome || template.projeto || "Sem nome"}
          {ativo && (
            <Badge bg="primary" className="ms-2">
              Ativo
            </Badge>
          )}
        </Card.Title>
        <div className="mb-1">
          <strong>Projeto:</strong>{" "}
          <span className="text-muted">
            {template.projeto || (
              <span className="fst-italic">Não definido</span>
            )}
          </span>
        </div>
        <div className="mb-1">
          <strong>Escopo:</strong>{" "}
          <span className="text-muted">
            {template.escopoProjeto || (
              <span className="fst-italic">Não definido</span>
            )}
          </span>
        </div>
        <div className="mb-1">
          <strong>Análise de Requisitos:</strong>{" "}
          <span className="text-muted">
            {template.analiseRequisitos || (
              <span className="fst-italic">Não definido</span>
            )}
          </span>
        </div>
        <div>
          <strong>Times:</strong>{" "}
          {(template.times?.length ? template.times : ["Sem time"]).map(
            (time, idx) => (
              <Badge
                key={idx}
                bg="info"
                className="me-1"
                style={{ fontWeight: 500, fontSize: 13 }}
              >
                {time}
              </Badge>
            )
          )}
        </div>
      </Card.Body>
      <hr style={{ margin: 0, borderColor: "#e2e8f0", opacity: 0.6 }} />
      <Card.Footer
        className="bg-transparent border-0 d-flex justify-content-end align-items-center pt-2 pb-1"
        style={{ minHeight: 38, paddingRight: 16, paddingLeft: 16 }}
      >
        {/* Botão Arquivar/Desarquivar */}
        {!template.arquivado ? (
          <Button
            variant="outline-warning"
            size="sm"
            title="Arquivar"
            onClick={onArquivar}
            style={{ border: "none", boxShadow: "none" }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        ) : (
          <Button
            variant="outline-success"
            size="sm"
            title="Desarquivar"
            onClick={onDesarquivar}
            style={{ border: "none", boxShadow: "none" }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        )}
        {/* Botão Excluir */}
        <Button
          variant="outline-danger"
          size="sm"
          title="Excluir"
          onClick={async () => {
            const result = await Swal.fire({
              title: "Excluir template?",
              text: "Esta ação não pode ser desfeita!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Sim, excluir",
              cancelButtonText: "Cancelar",
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              focusCancel: true,
              customClass: {
                popup: "swal2-border-radius",
              },
            });
            if (result.isConfirmed) {
              onExcluir();
              Swal.fire("Excluído!", "O template foi removido.", "success");
            }
          }}
          style={{ border: "none", boxShadow: "none", marginLeft: 8 }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          title="Exportar"
          onClick={() => handleExport(template)}
          style={{ border: "none", boxShadow: "none", marginLeft: 8 }}
        >
          <FontAwesomeIcon icon={faFileExport} />
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default function EspacoTrabalhoModal({ show, onClose }) {
  const storage = getStorageUsage();
  const [busca, setBusca] = useState("");
  const {
    state,
    arquivarTemplate,
    desarquivarTemplate,
    removerTemplate,
    adicionarTemplate,
  } = useTemplateStore();

  function matchBusca(tpl) {
    const q = busca.toLowerCase();
    // Busca por nome, projeto, escopo, análise e times
    return (
      (tpl.nome || "").toLowerCase().includes(q) ||
      (tpl.projeto || "").toLowerCase().includes(q) ||
      (tpl.escopoProjeto || "").toLowerCase().includes(q) ||
      (tpl.analiseRequisitos || "").toLowerCase().includes(q) ||
      (tpl.times || []).some((time) => time.toLowerCase().includes(q))
    );
  }

  const ativo = state.templates.find((t) => !t.arquivado);
  const arquivados = state.templates.filter(
    (t) => t.arquivado && matchBusca(t)
  );

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        let data = JSON.parse(ev.target.result);

        const existe = state.templates.some(
          (tpl) =>
            tpl.id === data.id ||
            (tpl.projeto === data.projeto &&
              tpl.escopoProjeto === data.escopoProjeto &&
              tpl.data === data.data)
        );
        if (existe) {
          Swal.fire(
            "Importação bloqueada",
            "Este template já está cadastrado!",
            "warning"
          );
          return;
        }

        // 💡 Se vier bugado, tenta extrair só os campos válidos:
        if (
          typeof data === "object" &&
          data !== null &&
          Object.keys(data).length > 25
        ) {
          // Provavelmente veio em formato array-like, vamos filtrar as keys válidas:
          const camposValidos = [
            "id",
            "nome",
            "versao",
            "data",
            "autor",
            "alteracoes",
            "versoes",
            "objetivo",
            "projeto",
            "escopoProjeto",
            "analiseRequisitos",
            "foraEscopo",
            "times",
            "requisitos",
            "arquivado",
          ];
          let novo = {};
          for (let key of camposValidos) {
            if (data[key] !== undefined) novo[key] = data[key];
          }
          data = novo;
        }

        // Se não tem id, gera um novo
        if (!data.id)
          data.id =
            crypto.randomUUID?.() || (Date.now() + Math.random()).toString(36);

        // Aqui você pode validar campos obrigatórios, se quiser...

        // Adiciona no store
        adicionarTemplate(data);
        Swal.fire("Sucesso!", "Template importado com sucesso.", "success");
      } catch (err) {
        Swal.fire("Erro!", "Arquivo inválido.", "error");
      }
    };
    reader.readAsText(file);

    // Limpa input para permitir importar o mesmo arquivo novamente
    e.target.value = "";
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Espaço de Trabalho</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ minHeight: "420px", maxHeight: "70vh", overflow: "hidden" }}
      >
        <Row>
          {/* Coluna 1: Ativo */}
          <Col xs={12} md={6}>
            <h6 className="mb-3">Ativo</h6>
            {ativo ? (
              <TemplateCard
                template={ativo}
                ativo={true}
                onArquivar={() => {
                  if (state.templates.length >= 10) {
                    Swal.fire({
                      icon: "warning",
                      title: "Limite atingido!",
                      text: "Você atingiu o limite de 10 templates no espaço de trabalho. Limpe algum arquivado para continuar.",
                      confirmButtonText: "Ok",
                    });
                    return;
                  }
                  arquivarTemplate(ativo.id);
                  Swal.fire({
                    icon: "success",
                    title: "Template arquivado!",
                    toast: true,
                    position: "top-end",
                    timer: 1200,
                    showConfirmButton: false,
                    timerProgressBar: true,
                  });
                }}
                onDesarquivar={() => {}}
                onExcluir={() => removerTemplate(ativo.id)}
              />
            ) : (
              <div className="text-muted p-4 text-center">
                Nenhum template ativo.
              </div>
            )}
          </Col>
          {/* Coluna 2: Arquivados */}
          <Col xs={12} md={6}>
            <h6 className="mb-3">Arquivados</h6>
            <div className="content-filter d-flex">
              <div className="mb-4 col-md-10">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar por nome, escopo, time..."
                  value={busca}
                  autoFocus
                  onChange={(e) => setBusca(e.target.value)}
                  style={{ maxWidth: 420 }}
                />
              </div>

              <Button
                className="col-md-2"
                variant="outline-secondary"
                size="sm"
                title="Importar"
                style={{ border: "none", boxShadow: "none", marginLeft: 8 }}
                onClick={() =>
                  document.getElementById("import-template-input")?.click()
                }
              >
                <FontAwesomeIcon icon={faFileImport} />
                <input
                  id="import-template-input"
                  type="file"
                  accept="application/json"
                  style={{ display: "none" }}
                  onChange={handleImport}
                />
              </Button>
            </div>

            <div className="scroll-coluna">
              {arquivados.length === 0 ? (
                <div className="text-muted p-4 text-center">
                  Nenhum template arquivado.
                </div>
              ) : (
                arquivados.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    ativo={false}
                    onArquivar={() => {}}
                    onDesarquivar={() => desarquivarTemplate(tpl.id)}
                    onExcluir={() => removerTemplate(tpl.id)}
                  />
                ))
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Espaço usado: {storage.mb} MB ({storage.percent}% de 5MB)
        </small>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
