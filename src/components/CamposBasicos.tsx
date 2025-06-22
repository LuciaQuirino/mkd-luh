import { Form } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

import "./CamposBasicos.css";

const timesDisponiveis = [
  "Digital Account",
  "B2C",
  "PIX",
  "EVA",
  "Merchant",
  "Bacen",
  "Payment Processor",
  "B2B",
];

export default function CamposBasicos({ template, onEdit }) {
  const options = timesDisponiveis.map((time) => ({
    value: time,
    label: time,
  }));

  return (
    <div className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>Times Disponíveis</Form.Label>
        <Select
          isMulti
          options={options}
          value={options.filter((opt) =>
            (template.times ?? []).includes(opt.value)
          )}
          onChange={(selected) =>
            onEdit({ times: selected.map((s) => s.value) })
          }
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <Form.Text className="text-muted">
          Use Ctrl ou Shift para selecionar vários
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          <FontAwesomeIcon icon={faThumbtack} className="me-2" /> Nome do Projeto
        </Form.Label>
        <Form.Control
          type="text"
          value={template.projeto}
          onChange={(e) => onEdit({ projeto: e.target.value })}
        />
      </Form.Group>

      <div className="row">
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>Escopo do Projeto</Form.Label>
            <Form.Control
              type="text"
              value={template.escopoProjeto}
              onChange={(e) =>
                onEdit({
                  escopoProjeto: e.target.value.startsWith("#")
                    ? e.target.value
                    : "#" + e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>Análise de Requisitos</Form.Label>
            <Form.Control
              type="text"
              value={template.analiseRequisitos}
              onChange={(e) => {
                const valor = e.target.value;
                onEdit({
                  analiseRequisitos: valor.startsWith("#")
                    ? valor
                    : "#" + valor,
                });
              }}
            />
          </Form.Group>
        </div>
      </div>
    </div>
  );
}
