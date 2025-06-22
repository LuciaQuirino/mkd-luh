import React, { createContext, useContext, useEffect, useState } from "react";
import type { MarkdownFormData, TemplatesState } from "../type";
import { STORAGE_KEY } from '../consts';

// Template base
const defaultTemplate: MarkdownFormData = {
  id: "1",
  nome: "Template principal",
  versao: "",
  data: new Date().toISOString().split("T")[0],
  autor: "",
  alteracoes: "",
  versoes: [],
  objetivo: "",
  projeto: "",
  escopoProjeto: "#",
  analiseRequisitos: "#",
  foraEscopo: [],
  times: [],
  requisitos: [],
  arquivado: false,
};

const defaultState: TemplatesState = {
  templates: [defaultTemplate],
  ativo: "1",
};

// Contexto: tipagem das funções novas
type TemplateContextType = {
  state: TemplatesState;
  adicionarTemplate: (t: MarkdownFormData) => void;
  editarTemplate: (id: string, dados: Partial<MarkdownFormData>) => void;
  removerTemplate: (id: string) => void;
  arquivarTemplate: (id: string) => void;
  desarquivarTemplate: (id: string) => void;
  limparTemplates: () => void;
  trocarTemplateAtivo: (id: string) => void;
  reordenarTemplates: (fromIdx: number, toIdx: number) => void;
  importarTemplates: (novos: MarkdownFormData[]) => void;
  exportarTemplates?: () => MarkdownFormData[];
};

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TemplatesState>(() => {
    const local = localStorage.getItem(STORAGE_KEY);
    return local ? JSON.parse(local) : defaultState;
  });

  useEffect(() => {
    try {
      const json = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, json);
    } catch (err) {
      console.error("Falha ao salvar no localStorage:", err, state);
    }
  }, [state]);

  function normalizarTemplate(t: Partial<MarkdownFormData>): MarkdownFormData {
    return {
      ...defaultTemplate, // Importa os campos padrão
      ...t,
      versoes: Array.isArray(t.versoes) ? t.versoes : [],
      foraEscopo: Array.isArray(t.foraEscopo) ? t.foraEscopo : [],
      times: Array.isArray(t.times) ? t.times : [],
      requisitos: Array.isArray(t.requisitos) ? t.requisitos : [],
      arquivado: t.arquivado ?? false,
    };
  }

  function importarTemplates(novos: MarkdownFormData[]) {
    setState((prev) => {
      const idsExistentes = new Set(prev.templates.map((t) => t.id));
      const novosTemplates = novos.filter((t) => !idsExistentes.has(t.id));
      if (novosTemplates.length === 0) return prev;

      // Define ativo se não houver nenhum
      const novoAtivo = prev.ativo ?? novosTemplates[0].id;

      return {
        ...prev,
        templates: [...prev.templates, ...novosTemplates],
        ativo: novoAtivo,
      };
    });
  }

  function exportarTemplates() {
    return state.templates;
  }

  // Funções CRUD
  function adicionarTemplate(template: MarkdownFormData) {
    setState(prev => ({
      ...prev,
      templates: [...prev.templates, template],
      ativo: template.id, // já ativa o novo
    }));
  }

  function editarTemplate(id: string, dados: Partial<MarkdownFormData>) {
    setState(prev => ({
      ...prev,
      templates: prev.templates.map(t =>
        t.id === id ? { ...t, ...dados } : t
      ),
    }));
  }

  function removerTemplate(id: string) {
    setState((prev) => {
      const templates = prev.templates.filter((t) => t.id !== id);
      // Se excluiu o ativo, reseta ativo para null
      const novoAtivo = prev.ativo === id ? null : prev.ativo;
      return {
        ...prev,
        templates,
        ativo: novoAtivo,
      };
    });
  }

  function limparTemplates() {
    setState({
      templates: [],
      ativo: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  }

  function arquivarTemplate(id: string) {
    setState((prev) => {
      const templates = prev.templates.map((t) =>
        t.id === id ? { ...t, arquivado: true } : t
      );
      return {
        ...prev,
        templates,
        ativo: null,
      };
    });
  }

  function desarquivarTemplate(id: string) {
    setState((prev) => {
      // Arquiva todos menos o novo ativo
      const templates = prev.templates.map((t) =>
        t.id === id ? { ...t, arquivado: false } : { ...t, arquivado: true }
      );
      return {
        ...prev,
        templates,
        ativo: id,
      };
    });
  }

  function trocarTemplateAtivo(id: string) {
    setState(prev => ({ ...prev, ativo: id }));
  }

  function reordenarTemplates(fromIdx: number, toIdx: number) {
    setState(prev => {
      const items = [...prev.templates];
      const [moved] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, moved);
      return { ...prev, templates: items };
    });
  }

  // Context value
  return (
    <TemplateContext.Provider
      value={{
        state,
        adicionarTemplate,
        editarTemplate,
        removerTemplate,
        arquivarTemplate,
        desarquivarTemplate,
        trocarTemplateAtivo,
        limparTemplates,
        reordenarTemplates,
        exportarTemplates,
        importarTemplates
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplateStore() {
  const context = useContext(TemplateContext);
  if (!context) throw new Error("useTemplateStore must be used within TemplateProvider");
  return context;
}
