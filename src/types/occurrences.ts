export type OccurrenceCategory =
  | "uniforme"
  | "calcado_epi"
  | "atraso_reiterado"
  | "celular_equipamento"
  | "outros";

export type OccurrenceSeverity = "leve" | "media" | "alta";

export type OccurrenceStatus = "pendente" | "em_analise" | "regularizada";

export interface Occurrence {
  id: string;
  alunoId: string;
  alunoNome: string;
  turma: string;
  matricula: string;
  categoria: OccurrenceCategory;
  categoriaLabel: string;
  severidade: OccurrenceSeverity;
  medidaAdotada: string;
  observacao: string;
  registradoPor: string;
  registradorRole: string;
  dataHora: string; // ISO string
  status: OccurrenceStatus;
}

export interface CreateOccurrenceInput {
  alunoId: string;
  categoria: OccurrenceCategory;
  severidade: OccurrenceSeverity;
  medidaAdotada: string;
  observacao: string;
  categoriaCustomizada?: string;
}
