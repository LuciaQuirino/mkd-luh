import React, { createContext, useContext, useEffect, useState } from "react";
import type { MarkdownFormData } from "../type";
import { STORAGE_KEY } from '../consts';

// Estado inicial padrão
const defaultTemplate: MarkdownFormData = {
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
};

type TemplateContextType = {
  template: MarkdownFormData;
  setTemplate: React.Dispatch<React.SetStateAction<MarkdownFormData>>;
  limpar: () => void;
  salvar: (dados: Partial<MarkdownFormData>) => void;
};

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [template, setTemplate] = useState<MarkdownFormData>(() => {
    const local = localStorage.getItem(STORAGE_KEY);
    return local ? JSON.parse(local) : defaultTemplate;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
  }, [template]);

  function limpar() {
    setTemplate({ ...defaultTemplate });
    localStorage.removeItem(STORAGE_KEY);
  }

  function salvar(dados: Partial<MarkdownFormData>) {
    setTemplate((prev) => ({ ...prev, ...dados }));
  }

  return (
    <TemplateContext.Provider value={{ template, setTemplate, limpar, salvar }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplateStore() {
  const context = useContext(TemplateContext);
  if (!context) throw new Error("useTemplateStore must be used within TemplateProvider");
  return context;
}
