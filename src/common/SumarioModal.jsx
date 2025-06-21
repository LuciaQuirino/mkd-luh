import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

export default function SumarioModal({ show, onClose, requisitos, onSelecionar }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sumário de Requisitos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          {requisitos.length === 0 && (
            <div className="text-muted">Nenhum requisito cadastrado.</div>
          )}
          {requisitos.map((req, idx) => (
            <ListGroup.Item
              action
              key={idx}
              onClick={() => onSelecionar(idx)}
              style={{ cursor: "pointer" }}
            >
              {req.titulo}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
