import { useRef, useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faCircleXmark,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function Objetivo({ template, editarTemplate }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [itemForaDoEscopo, setItemForaDoEscopo] = useState("");

  function adicionarItem() {
    if (itemForaDoEscopo.trim() === "") return;
    editarTemplate(template.id, {
      foraEscopo: [...(template.foraEscopo || []), itemForaDoEscopo.trim()]
    });
    setItemForaDoEscopo("");
    inputRef.current?.focus();
  }

  function removerItem(index) {
    editarTemplate(template.id, {
      foraEscopo: (template.foraEscopo || []).filter((_, i) => i !== index)
    });
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
          onChange={(e) =>
            editarTemplate(template.id, { objetivo: e.target.value })
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
            {template.foraEscopo.map((item, idx) => (
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

