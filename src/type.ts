// Tipos principais usados no gerador de markdown

export type UserStory = {
  userStory: string;
  introducao: string;
  sistema: string;
  caminho: string;
  regrasHTML: string;
  funcName: string;
  path: string;
  descFunc: string;
  temFuncionalidade?: boolean;
  autoOpen?: boolean;
};

export type Requisito = {
  titulo: string;
  stories: UserStory[];
};

export type Versao = {
  versao: string;
  data: string;
  autor: string;
  alteracoes: string;
};

export type TemplatesState = {
  templates: MarkdownFormData[];
  ativo: string | null; 
};

export type MarkdownFormData = {
  id: string;
  nome?: string;
  versao: string;
  data: string;
  autor: string;
  alteracoes: string;
  versoes: Versao[];
  objetivo: string;
  projeto: string;
  escopoProjeto: string;
  analiseRequisitos: string;
  foraEscopo: string[];
  times: string[];
  requisitos: Requisito[];
  arquivado?: boolean;
};
