import React, { useRef, useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faCircleXmark,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useTemplateStore } from "../context/TemplateContext";

export default function Objetivo() {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    template: { objetivo, foraEscopo },
    setTemplate,
  } = useTemplateStore();

  const [itemForaDoEscopo, setItemForaDoEscopo] = useState("");

  function adicionarItem() {
    if (itemForaDoEscopo.trim() === "") return;
    setTemplate((prev) => ({
      ...prev,
      foraEscopo: [...(prev.foraEscopo || []), itemForaDoEscopo.trim()],
    }));
    setItemForaDoEscopo("");
    inputRef.current?.focus();
  }

  function removerItem(index: number) {
    setTemplate((prev) => ({
      ...prev,
      foraEscopo: (prev.foraEscopo || []).filter((_, i) => i !== index),
    }));
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
          value={objetivo || ""}
          onChange={(e) =>
            setTemplate((prev) => ({ ...prev, objetivo: e.target.value }))
          }
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
            onChange={(e) => setItemForaDoEscopo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                adicionarItem();
              }
            }}
            placeholder="Ex: Integração com sistema legado"
            style={{padding: '3px'}}
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

        {(foraEscopo || []).length > 0 && (
          <ListGroup className="mt-2">
            {foraEscopo.map((item, idx) => (
              <ListGroup.Item
                key={idx}
                className="d-flex justify-content-between align-items-center py-1"
                style={{ fontSize: "0.97em" }}
              >
                {item}
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => removerItem(idx)}
                  style={{ minWidth: 28, padding: 0, border: 'none !important' }}
                  aria-label={`Remover ${item}`}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form.Group>
    </div>
  );
}
