import React, { useState } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { useTemplateStore } from "../context/TemplateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faTrash,
  faHashtag,
  faCalendar,
  faUser,
  faPen
} from "@fortawesome/free-solid-svg-icons";

export default function Versoes() {
  const { template, salvar } = useTemplateStore();
  const [versao, setVersao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [autor, setAutor] = useState("");
  const [alteracoes, setAlteracoes] = useState("");

  function adicionarVersao() {
    if (!versao || !data || !autor) return;
    const nova = { versao, data, autor, alteracoes };
    salvar({ versoes: [...template.versoes, nova] });
    setVersao("");
    setData(new Date().toISOString().split("T")[0]);
    setAutor("");
    setAlteracoes("");
  }

  function removerVersao(index: number) {
    const novas = [...template.versoes];
    novas.splice(index, 1);
    salvar({ versoes: novas });
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
            <Form.Label>
              <FontAwesomeIcon icon={faCalendar} className="me-1" /> Data
            </Form.Label>
            <Form.Control
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
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
            />
          </Form.Group>
        </div>
      </div>

      <div className="mb-3 text-end">
        <Button variant="outline-secondary" size="sm" onClick={adicionarVersao} className="no-border">
          <FontAwesomeIcon icon={faClockRotateLeft} className="me-1" /> Nova Versão
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
                <td>{v.data}</td>
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
