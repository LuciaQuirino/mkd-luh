import { useState,useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ReactSimpleWysiwyg from "react-simple-wysiwyg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import "./UserStory.css";

export default function StoryRegrasModal({ story, onChange }) {
  const [showModal, setShowModal] = useState(false);
  const [tempRegras, setTempRegras] = useState(story.regrasHTML || "");
  const [status, setStatus] = useState("idle"); 

  useEffect(() => {
    if (tempRegras === story.regrasHTML) return;

    setStatus("saving");

    const timeout = setTimeout(() => {
      onChange({ ...story, regrasHTML: tempRegras });
      setStatus("saved");

      setTimeout(() => setStatus("idle"), 2000);
    }, 600);

    return () => clearTimeout(timeout);
  }, [tempRegras]);

  function abreModal() {
    setTempRegras(story.regrasHTML || "");
    setShowModal(true);
  }

  function salvaModal() {
    onChange({ ...story, regrasHTML: tempRegras });
    setShowModal(false);
  }

  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  return (
    <div className="mb-2">
      <Form.Label>Regras de Negócio</Form.Label>
      <Button
        variant={"outline-secondary"}
        size="sm"
        onClick={abreModal}
        className="ms-1 no-border"
      >
        <FontAwesomeIcon icon={faPen} className="me-1" />
        {story.regrasHTML ? "Editar Regras" : "Adicionar Regras"}
      </Button>
      <Modal
        show={showModal}
        onHide={salvaModal}
        size="xl"
        centered
        dialogClassName="modal-alta-regras"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Regras de Negócio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <ReactSimpleWysiwyg
              value={tempRegras}
              onChange={(e) => setTempRegras(e.target.value)}
              style={{
                minHeight: 300,
                fontSize: 14,
                background: "#fff",
                padding: 8,
              }}
              toolbar={{
                bold: true,
                italic: true,
                underline: true,
                unorderedList: true,
                orderedList: true,
                link: true,
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div
            style={{
              fontSize: 14,
              color:
                status === "saved" || status === "idle" ? "#28a745" : "#333",
            }}
          >
            {status === "saving" && "Salvando..."}
            {status === "saved" && "Salvo ✓"}
            {status === "idle" && "Pronto"}
          </div>
          <Button className="btn-sm no-border" variant="outline-secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
