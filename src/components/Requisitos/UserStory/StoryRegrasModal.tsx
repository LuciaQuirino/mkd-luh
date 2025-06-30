import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

import {
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faTable,
  faTrash,
  faUndo,
  faRedo,
  faArrowDown,
  faArrowRight,
  faMinus,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./UserStory.css";

export default function StoryRegrasModal({ story, onChange }) {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("idle");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: story.regrasHTML || "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setStatus("saving");

      clearTimeout(editor._saveTimeout);
      editor._saveTimeout = setTimeout(() => {
        onChange({ ...story, regrasHTML: html });
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      }, 600);
    },
  });

  function abreModal() {
    setShowModal(true);
    if (editor) {
      editor.commands.setContent(story.regrasHTML || "");
    }
  }

  function fechaModal() {
    setShowModal(false);
  }

  function isInsideTable(editor) {
    return (
      editor?.state?.selection?.$anchor?.parent?.type?.name === "tableCell" ||
      editor?.state?.selection?.$anchor?.parent?.type?.name === "tableHeader" ||
      editor?.state?.selection?.$anchor?.parent?.type?.name === "tableRow"
    );
  }

  return (
    <div className="mb-2">
      <Form.Label>Regras de Negócio</Form.Label>
      <Button
        size="sm"
        variant="light"
        onClick={abreModal}
        className={`btn-regras ms-2 ${
          story.regrasHTML ? "editando" : "adicionando"
        }`}
      >
        <FontAwesomeIcon icon={faPen} className="me-1" />
        {story.regrasHTML ? "Editar Regras" : "Adicionar Regras"}
      </Button>

      <Modal
        show={showModal}
        onHide={fechaModal}
        size="xl"
        centered
        dialogClassName="modal-alta-regras"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Regras de Negócio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editor && (
            <>
              <div className="tiptap-toolbar mb-2">
                {/* BÁSICO */}
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className={editor.isActive("bold") ? "is-active" : ""}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  title="Negrito"
                >
                  <FontAwesomeIcon icon={faBold} />
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className={editor.isActive("italic") ? "is-active" : ""}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  title="Itálico"
                >
                  <FontAwesomeIcon icon={faItalic} />
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className={editor.isActive("underline") ? "is-active" : ""}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  title="Sublinhado"
                >
                  <FontAwesomeIcon icon={faUnderline} />
                </Button>
                {!editor.isActive("table") && (
                  <>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className={
                        editor.isActive("bulletList") ? "is-active" : ""
                      }
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      title="Lista não ordenada"
                    >
                      <FontAwesomeIcon icon={faListUl} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className={
                        editor.isActive("orderedList") ? "is-active" : ""
                      }
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                      title="Lista ordenada"
                    >
                      <FontAwesomeIcon icon={faListOl} />
                    </Button>
                  </>
                )}

                {/* INSERIR TABELA */}
                {!editor.isActive("table") && (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                  title="Inserir tabela"
                >
                  <FontAwesomeIcon icon={faTable} />
                </Button>
                )}

                {/* COMANDOS CONTEXTUAIS DE TABELA */}
                {editor.isActive("table") && (
                  <>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().addColumnAfter().run()
                      }
                      title="Adicionar coluna à direita"
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => editor.chain().focus().addRowAfter().run()}
                      title="Adicionar linha abaixo"
                    >
                      <FontAwesomeIcon icon={faArrowDown} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().deleteColumn().run()
                      }
                      title="Remover coluna"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => editor.chain().focus().deleteRow().run()}
                      title="Remover linha"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                  </>
                )}

                {/* UNDO/REDO */}
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => editor.chain().focus().undo().run()}
                  title="Desfazer"
                >
                  <FontAwesomeIcon icon={faUndo} />
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => editor.chain().focus().redo().run()}
                  title="Refazer"
                >
                  <FontAwesomeIcon icon={faRedo} />
                </Button>
              </div>

              <EditorContent
                editor={editor}
                className="editor-wrapper-tiptap"
              />
            </>
          )}
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
          <Button
            className="btn-sm no-border"
            variant="outline-secondary"
            onClick={fechaModal}
          >
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
