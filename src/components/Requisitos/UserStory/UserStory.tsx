import React, { useState } from "react";
import { Form, Button, Row, Col, Card, Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import type { UserStory } from "../../../type";

type Props = {
  story: UserStory;
  onChange: (story: UserStory) => void;
  onRemove: () => void;
  index: number;
};

export default function StoryCard({ story, onChange, onRemove, index }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="mb-2">
      <Card.Header
        style={{ cursor: "pointer" }}
        onClick={() => setOpen((o) => !o)}
        className="d-flex justify-content-between align-items-center"
      >
        <div>
          <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} className="me-2" />
          <span className="fw-bold">
            {story.userStory
              ? story.userStory.slice(0, 48)
              : `Story #${index + 1}`}
          </span>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          tabIndex={-1}
          title="Remover Story"
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </Card.Header>
      <Collapse in={open}>
        <div>
          <Card.Body>
            <Row className="mb-2">
              <Col>
                <Form.Group>
                  <Form.Label>User Story</Form.Label>
                  <Form.Control
                    type="text"
                    value={story.userStory}
                    onChange={(e) =>
                      onChange({ ...story, userStory: e.target.value })
                    }
                    placeholder="Como usuário, quero..."
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-2">
              <Form.Label>Introdução</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={story.introducao}
                onChange={(e) => onChange({ ...story, introducao: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Sistema</Form.Label>
                  <Form.Control
                    type="text"
                    value={story.sistema}
                    onChange={(e) => onChange({ ...story, sistema: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Caminho</Form.Label>
                  <Form.Control
                    type="text"
                    value={story.caminho}
                    onChange={(e) => onChange({ ...story, caminho: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-2">
              <Form.Label>Regras de Negócio (HTML permitido)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={story.regrasHTML}
                onChange={(e) => onChange({ ...story, regrasHTML: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Função</Form.Label>
                  <Form.Control
                    type="text"
                    value={story.funcName}
                    onChange={(e) => onChange({ ...story, funcName: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Path</Form.Label>
                  <Form.Control
                    type="text"
                    value={story.path}
                    onChange={(e) => onChange({ ...story, path: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Descrição da Função</Form.Label>
                  <Form.Control
                    type="text"
                    value={story.descFunc}
                    onChange={(e) => onChange({ ...story, descFunc: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Check
                label="Possui funcionalidade associada"
                checked={!!story.temFuncionalidade}
                onChange={(e) =>
                  onChange({ ...story, temFuncionalidade: e.target.checked })
                }
              />
            </Form.Group>
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
}
