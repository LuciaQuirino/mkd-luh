import React from "react";
import { Modal, Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./VisualizarModal.css";

export default function VisualizarModal({ show, onClose, markdown }) {
  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Visualização do Template</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 700, overflowY: "auto" }}>
        <div className="markdown-preview">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
