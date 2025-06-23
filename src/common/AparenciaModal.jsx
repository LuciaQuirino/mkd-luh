import { Modal, Button, Form } from "react-bootstrap";
import { useTheme } from "../context/ThemeContext";

const FONTES = [
  { label: "Padrão", value: "" },
  { label: "Roboto", value: "Roboto, Arial, sans-serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Serifada", value: "Georgia, serif" }
];

export default function AparenciaModal({ show, onClose }) {
  const { theme, setTheme, resetTheme } = useTheme();

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Personalizar aparência</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Fundo do app</Form.Label>
          <Form.Control
            type="color"
            value={theme.bg}
            onChange={e => setTheme(t => ({ ...t, bg: e.target.value }))}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fundo dos cards</Form.Label>
          <Form.Control
            type="color"
            value={theme.card}
            onChange={e => setTheme(t => ({ ...t, card: e.target.value }))}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fonte dos títulos</Form.Label>
          <Form.Select
            value={theme.fonte}
            onChange={e => setTheme(t => ({ ...t, fonte: e.target.value }))}
          >
            {FONTES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={resetTheme}>Resetar</Button>
        <Button variant="primary" onClick={onClose}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
}
