import { useRef, useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faCircleXmark,
  faPlus,
  faXmark,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

export default function Objetivo({ template, onEdit }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [itemForaDoEscopo, setItemForaDoEscopo] = useState("");
  const [editandoIdx, setEditandoIdx] = useState(null);
  const [itemEditado, setItemEditado] = useState("");

  function adicionarItem() {
    if (itemForaDoEscopo.trim() === "") return;
    onEdit({
      foraEscopo: [...(template.foraEscopo || []), itemForaDoEscopo.trim()],
    });
    setItemForaDoEscopo("");
    inputRef.current?.focus();
  }

  function removerItem(index) {
    onEdit({
      foraEscopo: (template.foraEscopo || []).filter((_, i) => i !== index),
    });
    if (editandoIdx === index) cancelarEdicao();
  }

  function iniciarEdicao(idx, valor) {
    setEditandoIdx(idx);
    setItemEditado(valor);
  }

  function salvarEdicao(idx) {
    if (itemEditado.trim() === "") {
      cancelarEdicao();
      return;
    }
    const novaLista = [...(template.foraEscopo || [])];
    novaLista[idx] = itemEditado.trim();
    onEdit({ foraEscopo: novaLista });
    setEditandoIdx(null);
    setItemEditado("");
  }

  function cancelarEdicao() {
    setEditandoIdx(null);
    setItemEditado("");
  }

  return (
    <div className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>
          <FontAwesomeIcon icon={faBullseye} className="me-2 text-primary" />
          Objetivo
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={template.objetivo || ""}
          onChange={e => onEdit({ objetivo: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          <FontAwesomeIcon icon={faCircleXmark} className="me-2 text-danger" />
          Itens fora do escopo <small>(Digite e pressione Enter)</small>
        </Form.Label>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            ref={inputRef}
            value={itemForaDoEscopo}
            onChange={e => setItemForaDoEscopo(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                adicionarItem();
              }
            }}
            placeholder="Ex: Integração com sistema legado"
            style={{ padding: '3px' }}
          />
          <Button
            variant="outline-primary"
            onClick={adicionarItem}
            size="sm"
            aria-label="Adicionar item fora do escopo"
            className="no-border"
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>

        {(template.foraEscopo || []).length > 0 && (
          <ListGroup className="mt-2">
            {template.foraEscopo.map((item, idx) =>
              editandoIdx === idx ? (
                <ListGroup.Item
                  key={idx}
                  className="d-flex justify-content-between align-items-center py-1"
                  style={{ fontSize: "0.97em", background: "#f8fafc" }}
                >
                  <Form.Control
                    size="sm"
                    value={itemEditado}
                    autoFocus
                    onChange={e => setItemEditado(e.target.value)}
                    onBlur={() => salvarEdicao(idx)}
                    onKeyDown={e => {
                      if (e.key === "Enter") salvarEdicao(idx);
                      if (e.key === "Escape") cancelarEdicao();
                    }}
                    style={{ maxWidth: 320, display: "inline-block" }}
                  />
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removerItem(idx)}
                    style={{ minWidth: 28, padding: 0, border: 'none !important' }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </Button>
                </ListGroup.Item>
              ) : (
                <ListGroup.Item
                  key={idx}
                  className="d-flex justify-content-between align-items-center py-1"
                  style={{ fontSize: "0.97em" }}
                >
                  <span
                    onClick={() => iniciarEdicao(idx, item)}
                    style={{ cursor: "pointer", userSelect: "text" }}
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") iniciarEdicao(idx, item);
                    }}
                    title="Editar item"
                    className="d-flex align-items-center"
                  >
                    {item}
                    <FontAwesomeIcon
                      icon={faPen}
                      className="ms-2 text-muted"
                      style={{ fontSize: 13, opacity: 0.7, transition: "opacity 0.2s" }}
                    />
                  </span>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removerItem(idx)}
                    style={{ minWidth: 28, padding: 0, border: 'none !important' }}
                    aria-label={`Remover ${item}`}
                    className="no-border"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </Button>
                </ListGroup.Item>
              )
            )}
          </ListGroup>
        )}
      </Form.Group>
    </div>
  );
}
