import { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { formatarDataBR } from "../common/Helpers";

import {
  faClockRotateLeft,
  faTrash,
  faHashtag,
  faCalendar,
  faUser,
  faPen
} from "@fortawesome/free-solid-svg-icons";

export default function Versoes({ template, onEdit }) {
  const [versao, setVersao] = useState("1.0.0");
  const [data, setData] = useState<Date | null>(new Date());
  const [autor, setAutor] = useState("");
  const [alteracoes, setAlteracoes] = useState("");

  useEffect(() => {
    if (template.data) {
      setData(new Date(template.data));
    }
  }, [template.data]);

  function adicionarVersao() {
    if (!versao || !data || !autor) return;
    
    const nova = {
      versao,
      data: data instanceof Date ? data.toISOString().split("T")[0] : "",
      autor,
      alteracoes
    };

    onEdit({ versoes: [...template.versoes, nova] });
    setVersao("");
    setData(data);
    setAutor("");
    setAlteracoes("");
  }

  function removerVersao(index: number) {
    const novas = [...template.versoes];
    novas.splice(index, 1);
    onEdit({ versoes: novas });
  }

  return (
    <div className="mb-4">
      <div className="row">
        <div className="col-md-3">
          <Form.Group className="mb-2">
            <Form.Label>
              <FontAwesomeIcon icon={faHashtag} className="me-1" /> Versão
            </Form.Label>
            <Form.Control
              type="text"
              value={versao}
              onChange={(e) => setVersao(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group className="mb-2">
            <Form.Label className="me-1 d-flex align-items-center">
              <FontAwesomeIcon icon={faCalendar} className="me-1" /> Data
            </Form.Label>
            <DatePicker
              className="form-control"
              selected={data}
              onChange={(date) => setData(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione a data"
              showYearDropdown
              scrollableYearDropdown
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group className="mb-2">
            <Form.Label>
              <FontAwesomeIcon icon={faUser} className="me-1" /> Autor
            </Form.Label>
            <Form.Control
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group className="mb-2">
            <Form.Label>
              <FontAwesomeIcon icon={faPen} className="me-1" /> Alterações
            </Form.Label>
            <Form.Control
              type="text"
              value={alteracoes}
              onChange={(e) => setAlteracoes(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  adicionarVersao();
                }
              }}
            />
          </Form.Group>
        </div>
      </div>

      <div className="mb-3 text-end">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={adicionarVersao}
          className="no-border"
        >
          <FontAwesomeIcon icon={faClockRotateLeft} className="me-1" /> Nova
          Versão
        </Button>
      </div>

      {template.versoes.length > 0 && (
        <Table size="sm" bordered>
          <thead>
            <tr>
              <th>Versão</th>
              <th>Data</th>
              <th>Autor</th>
              <th>Alterações</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {template.versoes.map((v, index) => (
              <tr key={index}>
                <td>{v.versao}</td>
                <td>{formatarDataBR(v.data)}</td>
                <td>{v.autor}</td>
                <td>{v.alteracoes}</td>
                <td className="text-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="no-border"
                    onClick={() => removerVersao(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
