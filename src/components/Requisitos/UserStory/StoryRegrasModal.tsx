import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ReactSimpleWysiwyg from "react-simple-wysiwyg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import "./UserStory.css";

export default function StoryRegrasModal({ story, onChange }) {
  const [showModal, setShowModal] = useState(false);
  const [tempRegras, setTempRegras] = useState(story.regrasHTML || "");

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
          <div className="editor-wrapper">
            <ReactSimpleWysiwyg
              value={tempRegras}
              onChange={(e) => setTempRegras(e.target.value)}
              style={{
                minHeight: 350,
                maxHeight: 500,
                fontSize: 14,
                background: "#fff",
                overflowY: "auto",
                padding: 0,
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
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={salvaModal}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
