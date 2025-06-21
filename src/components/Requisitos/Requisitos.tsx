import React, { useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { useTemplateStore } from "../../context/TemplateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { UserStory, Requisito } from "../../type";
import StoryCard from "./UserStory/UserStory";

export default function Requisitos() {
  const { template, setTemplate } = useTemplateStore();

  const [editandoTituloIdx, setEditandoTituloIdx] = useState<number | null>(
    null
  );
  const [tituloTemp, setTituloTemp] = useState("");

  function salvarTitulo(idx: number) {
    setTemplate((prev) => {
      const requisitos = [...prev.requisitos];
      requisitos[idx] = { ...requisitos[idx], titulo: tituloTemp };
      return { ...prev, requisitos };
    });
    setEditandoTituloIdx(null);
  }

  // Função para extrair o RFxx do título do requisito
  function getReqId(titulo: string) {
    return titulo.split(" ")[0] || "RF00";
  }

  function editarStory(idx: number, sIdx: number, newStory: UserStory) {
    setTemplate((prev) => {
      const requisitos = [...prev.requisitos];
      requisitos[idx].stories[sIdx] = newStory;
      return { ...prev, requisitos };
    });
  }

  function getNovoRequisitoTitulo(requisitos: Requisito[]) {
    const next = (requisitos.length + 1).toString().padStart(2, "0");
    return `RF${next} - Nome do requisito`;
  }

  function adicionarRequisito() {
    const novoTitulo = getNovoRequisitoTitulo(template.requisitos);
    setTemplate((prev) => ({
      ...prev,
      requisitos: [
        ...prev.requisitos,
        { titulo: novoTitulo.trim(), stories: [] },
      ],
    }));
  }

  function removerRequisito(idx: number) {
    setTemplate((prev) => ({
      ...prev,
      requisitos: prev.requisitos.filter((_, i) => i !== idx),
    }));
  }

  function adicionarStory(idx: number) {
    setTemplate((prev) => {
      // Clona o array de requisitos
      const requisitos = prev.requisitos.map((req, i) =>
        i === idx
          ? {
              ...req,
              stories: [
                ...req.stories,
                {
                  userStory: `${getReqId(req.titulo)}_US${(
                    req.stories.length + 1
                  )
                    .toString()
                    .padStart(2, "0")}`,
                  introducao: "",
                  sistema: "",
                  caminho: "",
                  regrasHTML: "",
                  funcName: "",
                  path: "",
                  descFunc: "",
                  temFuncionalidade: false,
                },
              ],
            }
          : req
      );
      return { ...prev, requisitos };
    });
  }

  function removerStory(idx: number, storyIdx: number) {
    setTemplate((prev) => {
      const requisitos = [...prev.requisitos];
      requisitos[idx].stories.splice(storyIdx, 1);
      return { ...prev, requisitos };
    });
  }

  return (
    <div>
      <Form.Group className="mb-3 d-flex gap-2">
        <Button
          className="btn btn-sm"
          onClick={adicionarRequisito}
          variant="outline-primary"
          size="sm"
        >
          <FontAwesomeIcon icon={faPlus} /> Adicionar requisito
        </Button>
      </Form.Group>

      <Accordion alwaysOpen>
        {template.requisitos.map((req, idx) => (
          <Accordion.Item eventKey={String(idx)} key={idx}>
            <Accordion.Header>
              {editandoTituloIdx === idx ? (
                <Form.Control
                  value={tituloTemp}
                  autoFocus
                  size="sm"
                  onChange={(e) => setTituloTemp(e.target.value)}
                  onBlur={() => salvarTitulo(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      salvarTitulo(idx);
                    }
                    if (e.key === "Escape") {
                      setEditandoTituloIdx(null);
                    }
                  }}
                  style={{ maxWidth: 300, display: "inline-block" }}
                  onClick={(e) => e.stopPropagation()} // <- Evita abrir o accordion!
                />
              ) : (
                <span
                  onDoubleClick={(e) => {
                    e.stopPropagation(); // <- Impede o accordion de abrir!
                    setEditandoTituloIdx(idx);
                    setTituloTemp(req.titulo);
                  }}
                  style={{ cursor: "pointer" }}
                  title="Clique duplo para editar"
                >
                  {req.titulo}
                </span>
              )}
            </Accordion.Header>

            <Accordion.Body>
              <div className="d-flex justify-content-end mb-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removerRequisito(idx)}
                  tabIndex={-1}
                  aria-label="Remover requisito"
                  className="no-border"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span className="ms-1">Remover requisito</span>
                </Button>
              </div>

              <Button
                type="button"
                variant="outline-success"
                size="sm"
                className="mb-2 no-border"
                onClick={() => adicionarStory(idx)}
              >
                <FontAwesomeIcon icon={faPlus} /> Adicionar Story
              </Button>
              {req.stories.length === 0 && (
                <div className="text-muted">Nenhuma story adicionada.</div>
              )}
              {req.stories.map((story, sIdx) => (
                <StoryCard
                  key={sIdx}
                  story={story}
                  index={sIdx}
                  onChange={(newStory) => editarStory(idx, sIdx, newStory)}
                  onRemove={() => removerStory(idx, sIdx)}
                />
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
