import { useState, useRef, useEffect } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import type { Requisito } from "../../type";
import StoryCard from "./UserStory/UserStory";

import "./Requisitos.css";

const accordionListeners = {};

function handleAbrirAccordion(idx, el, setOpenIdx) {
  setOpenIdx(idx);
  setTimeout(() => {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    el.classList.add('destacar-requisito');
    setTimeout(() => el.classList.remove('destacar-requisito'), 1200);
  }, 300);
}

export default function Requisitos({ template, onEdit }) {
  const [openIdx, setOpenIdx] = useState(template.requisitos.length > 0 ? 0 : null);
  const [novoIdx, setNovoIdx] = useState<number | null>(null);

  const [storyOpenIdx, setStoryOpenIdx] = useState<{ [reqIdx: number]: number | null }>({});

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
        if (!accordionListeners[idx]) {
          accordionListeners[idx] = () =>
            handleAbrirAccordion(idx, el, setOpenIdx);
          el.addEventListener("abrirAccordion", accordionListeners[idx]);
        }
      }
    });

    return () => {
      template.requisitos.forEach((_, idx) => {
        const el = document.getElementById(`requisito-${idx}`);
        if (el && accordionListeners[idx]) {
          el.removeEventListener("abrirAccordion", accordionListeners[idx]);
          delete accordionListeners[idx];
        }
      });
    };
  }, [template.requisitos.length]);

  useEffect(() => {
    if (novoIdx !== null && itemsRef.current[novoIdx]) {
      itemsRef.current[novoIdx].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      itemsRef.current[novoIdx].classList.add("destacar-requisito");
      setTimeout(
        () => () => {
          if (itemsRef.current[novoIdx]) {
            itemsRef.current[novoIdx]!.classList.remove("destacar-requisito");
          }
        },
        1200
      );
      setNovoIdx(null);
    }
  }, [template.requisitos.length]);


  function toggleAccordion(idx) {
    setOpenIdx(openIdx === idx ? null : idx);

    setTimeout(() => {
      itemsRef.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setStoryOpenIdx((old) => ({
        ...old,
        [idx]: 0,
      }));

      itemsRef.current[idx]?.classList.add("destacar-requisito");
      setTimeout(
        () => itemsRef.current[idx]?.classList.remove("destacar-requisito"),
        1000
      );
    }, 350);
  }

  function salvarTitulo(idx) {
    const requisitos = [...template.requisitos];
    requisitos[idx] = { ...requisitos[idx], titulo: tituloTemp };
    onEdit({ requisitos });
    setEditandoTituloIdx(null);
  }

  // Função para extrair o RFxx do título do requisito
  function getReqId(titulo: string) {
    return titulo.split(" ")[0] || "RF00";
  }

  function editarStory(idx, sIdx, newStory) {
    const requisitos = [...template.requisitos];
    requisitos[idx].stories[sIdx] = newStory;
    onEdit({ requisitos });
  }

  function getNovoRequisitoTitulo(requisitos: Requisito[]) {
    const next = (requisitos.length + 1).toString().padStart(2, "0");
    return `RF${next} - Nome do requisito`;
  }

  function adicionarRequisito() {
    const novoTitulo = getNovoRequisitoTitulo(template.requisitos);
    const novoIdx = template.requisitos.length;

    onEdit({
      requisitos: [
        ...template.requisitos,
        { titulo: novoTitulo.trim(), stories: [] },
      ],
    });

    setNovoIdx(novoIdx);
    setOpenIdx(novoIdx);
  }

  function removerRequisito(idx) {
    onEdit({
      requisitos: template.requisitos.filter((_, i) => i !== idx),
    });
  }

  function adicionarStory(idx) {
    const novoStoryIdx = template.requisitos[idx].stories.length; // o novo índice
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
    onEdit({ requisitos });

    // Aguarde o update antes de abrir a nova story
    setTimeout(() => {
      setStoryOpenIdx((old) => ({
        ...old,
        [idx]: novoStoryIdx,
      }));
      // Faça scroll automático se quiser
      setTimeout(() => {
        // Encontre o card da nova story e dê scroll
        const storyDiv = document.getElementById(
          `story-${idx}-${novoStoryIdx}`
        );
        if (storyDiv) {
          storyDiv.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }, 100);
  }

  function removerStory(idx, storyIdx) {
    const requisitos = [...template.requisitos];
    requisitos[idx].stories.splice(storyIdx, 1);
    onEdit({ requisitos });
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
                <span className="d-flex align-items-center w-100 justify-content-between">
                  <span className="d-flex align-items-center">
                    <span className="me-2">{req.titulo}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="ms-1"
                      style={{
                        color: "#fff",
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
                  {/* SVG caret branco */}
                  <span
                    className="accordion-caret"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginLeft: 16,
                      transition: "transform 0.2s",
                      transform:
                        openIdx === idx ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
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

              {/* Aqui começa o scroll das stories */}
              <div className="stories-scroll">
                {req.stories.length === 0 && (
                  <div className="text-muted">Nenhuma story adicionada.</div>
                )}
                {req.stories.map((story, sIdx) => (
                  <StoryCard
                    key={sIdx}
                    story={story}
                    index={sIdx}
                    reqIdx={idx}
                    open={storyOpenIdx[idx] === sIdx}
                    setOpen={(open) => {
                      setStoryOpenIdx((old) => ({
                        ...old,
                        [idx]: open ? sIdx : null,
                      }));
                    }}
                    onChange={(newStory) => editarStory(idx, sIdx, newStory)}
                    onRemove={() => removerStory(idx, sIdx)}
                  />
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
