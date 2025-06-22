import { Button, Card, Badge, Row, Col, Modal } from "react-bootstrap";
import { useTemplateStore } from "../../context/TemplateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxArchive, faBoxOpen, faTrash } from "@fortawesome/free-solid-svg-icons";

import "./EspacoTrabalhoModal.css";

export function TemplateCard({ template, ativo, onArquivar, onDesarquivar, onExcluir }) {
  return (
    <Card
      className={`mb-3 ${ativo ? "border-primary shadow-sm" : "border-light"}`}
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
            <FontAwesomeIcon icon={faBoxArchive} />
          </Button>
        ) : (
          <Button
            variant="outline-success"
            size="sm"
            title="Desarquivar"
            onClick={onDesarquivar}
            style={{ border: "none", boxShadow: "none" }}
          >
            <FontAwesomeIcon icon={faBoxOpen} />
          </Button>
        )}
        {/* Botão Excluir */}
        <Button
          variant="outline-danger"
          size="sm"
          title="Excluir"
          onClick={() => {
            if (window.confirm("Tem certeza que deseja excluir este template?")) {
              onExcluir();
            }
          }}
          style={{ border: "none", boxShadow: "none", marginLeft: 8 }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default function EspacoTrabalhoModal({ show, onClose }) {
  const {
    state,
    arquivarTemplate,
    desarquivarTemplate,
    removerTemplate,
  } = useTemplateStore();

  const ativo = state.templates.find(t => !t.arquivado);
  const arquivados = state.templates.filter((t) => t.arquivado);

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Espaço de Trabalho</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Coluna 1: Ativo */}
          <Col xs={12} md={6}>
            {ativo ? (
              <TemplateCard
                template={ativo}
                ativo={true}
                onArquivar={() => arquivarTemplate(ativo.id)}
                onDesarquivar={() => {}} // Não mostra esse botão!
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
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

