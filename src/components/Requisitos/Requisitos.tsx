import { useState, useRef, useEffect } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import type { Requisito } from "../../type";
import StoryCard from "./UserStory/UserStory";

export default function Requisitos({ template, editarTemplate }) {
  const [openIdx, setOpenIdx] = useState(template.requisitos.length > 0 ? 0 : null);

  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [editandoTituloIdx, setEditandoTituloIdx] = useState<number | null>(
    null
  );
  const [tituloTemp, setTituloTemp] = useState("");

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, template.requisitos.length);

    template.requisitos.forEach((_, idx) => {
      const el = document.getElementById(`requisito-${idx}`);
      if (el) {
        el.addEventListener("abrirAccordion", () => {
          setOpenIdx(idx);
          setTimeout(() => {
            window.scrollBy({ top: -80, behavior: "smooth" });
          }, 300);
        });
      }
    });

    // cleanup
    return () => {
      template.requisitos.forEach((_, idx) => {
        const el = document.getElementById(`requisito-${idx}`);
        if (el) el.removeEventListener("abrirAccordion", () => setOpenIdx(idx));
      });
    };
  }, [template.requisitos.length]);

  function toggleAccordion(idx) {
    setOpenIdx(openIdx === idx ? null : idx);
  }

  function salvarTitulo(idx) {
    const requisitos = [...template.requisitos];
    requisitos[idx] = { ...requisitos[idx], titulo: tituloTemp };
    editarTemplate(template.id, { requisitos });
    setEditandoTituloIdx(null);
  }

  // Função para extrair o RFxx do título do requisito
  function getReqId(titulo: string) {
    return titulo.split(" ")[0] || "RF00";
  }

  function editarStory(idx, sIdx, newStory) {
    const requisitos = [...template.requisitos];
    requisitos[idx].stories[sIdx] = newStory;
    editarTemplate(template.id, { requisitos });
  }

  function getNovoRequisitoTitulo(requisitos: Requisito[]) {
    const next = (requisitos.length + 1).toString().padStart(2, "0");
    return `RF${next} - Nome do requisito`;
  }

  function adicionarRequisito() {
    const novoTitulo = getNovoRequisitoTitulo(template.requisitos);
    editarTemplate(template.id, {
      requisitos: [
        ...template.requisitos,
        { titulo: novoTitulo.trim(), stories: [] },
      ],
    });
  }

  function removerRequisito(idx) {
    editarTemplate(template.id, {
      requisitos: template.requisitos.filter((_, i) => i !== idx),
    });
  }

  function adicionarStory(idx) {
    const requisitos = template.requisitos.map((req, i) =>
      i === idx
        ? {
            ...req,
            stories: [
              ...req.stories,
              {
                userStory: `${getReqId(req.titulo)}_US${(req.stories.length + 1)
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
    editarTemplate(template.id, { requisitos });
  }

  function removerStory(idx, storyIdx) {
    const requisitos = [...template.requisitos];
    requisitos[idx].stories.splice(storyIdx, 1);
    editarTemplate(template.id, { requisitos });
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

      <Accordion
        activeKey={openIdx !== null ? String(openIdx) : null}
        alwaysOpen
      >
        {template.requisitos.map((req, idx) => (
          <Accordion.Item
            eventKey={String(idx)}
            key={idx}
            id={`requisito-${idx}`}
            ref={(el) => {
              itemsRef.current[idx] = el;
            }}
          >
            <Accordion.Header onClick={() => toggleAccordion(idx)}>
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
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="d-flex align-items-center">
                  <span className="me-2">{req.titulo}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    className="ms-1"
                    style={{
                      color: "#888",
                      cursor: "pointer",
                      padding: "2px 5px",
                      borderRadius: "3px",
                      outline: "none",
                    }}
                    title="Editar título"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditandoTituloIdx(idx);
                      setTituloTemp(req.titulo);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setEditandoTituloIdx(idx);
                        setTituloTemp(req.titulo);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </span>
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
