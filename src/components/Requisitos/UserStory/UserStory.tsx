import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import type { UserStory } from "../../../type";
import StoryRegrasModal from "./StoryRegrasModal";

import "./UserStory.css";

type Props = {
  story: UserStory;
  index: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  onChange: (story: UserStory) => void;
  onRemove: () => void;
  reqIdx: number;
}

export default function StoryCard({ story, onChange, onRemove, index, open, setOpen, reqIdx }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [tempRegras, setTempRegras] = useState(story.regrasHTML);

  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (story.autoOpen && open) {
      onChange({ ...story, autoOpen: false });
    }
  }, [story.autoOpen, open]);

  useEffect(() => {
    if (open && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      cardRef.current.classList.add("destacar-requisito");
      setTimeout(
        () => cardRef.current?.classList.remove("destacar-requisito"),
        1000
      );
    }
  }, [open]);

  function abreModal() {
    setTempRegras(story.regrasHTML);
    setShowModal(true);
  }

  function salvaModal() {
    onChange({ ...story, regrasHTML: tempRegras });
    setShowModal(false);
  }

  return (
    <Card className={`mb-2 p-0 story-card${open ? " open" : ""}`} ref={cardRef}>
      <Card.Header
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
        className="d-flex justify-content-between align-items-center story-card-header"
        id={`story-${reqIdx}-${index}`}
      >
        <div>
          <FontAwesomeIcon
            icon={open ? faChevronDown : faChevronRight}
            className="me-2"
          />
          <span className="fw-bold">
            {story.userStory
              ? story.userStory.slice(0, 48)
              : `Story #${index + 1}`}
          </span>
        </div>
        <Button
          className="no-border btn-action"
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
                onChange={(e) =>
                  onChange({ ...story, introducao: e.target.value })
                }
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Sistema</Form.Label>
                  <Form.Control
                    type="text"
                    value={story.sistema}
                    onChange={(e) =>
                      onChange({ ...story, sistema: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Caminho</Form.Label>
                  <Form.Control
                    type="text"
                    value={story.caminho}
                    onChange={(e) =>
                      onChange({ ...story, caminho: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-2">
              <StoryRegrasModal story={story} onChange={onChange} />
            </div>

            <Form.Group>
              <Form.Check
                label="Possui funcionalidade associada"
                checked={!!story.temFuncionalidade}
                onChange={(e) =>
                  onChange({ ...story, temFuncionalidade: e.target.checked })
                }
              />
            </Form.Group>

            {story.temFuncionalidade && (
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Nome da Funcionalidade</Form.Label>
                    <Form.Control
                      type="text"
                      value={story.funcName}
                      onChange={(e) =>
                        onChange({ ...story, funcName: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Caminho no Menu</Form.Label>
                    <Form.Control
                      type="text"
                      value={story.path}
                      onChange={(e) =>
                        onChange({ ...story, path: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      type="text"
                      value={story.descFunc}
                      onChange={(e) =>
                        onChange({ ...story, descFunc: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
}
