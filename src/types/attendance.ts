export type AttendanceStatus = "presente" | "falta" | "atraso" | "justificado";

export interface Student {
  id: string;
  nome: string;
  matricula: string;
  turmaId: string;
  email: string;
  avatarColor: string;
}

export interface StudentAttendanceInput {
  alunoId: string;
  status: AttendanceStatus;
  minutosAtraso?: number;
  observacao?: string;
  atestadoId?: string;
}

export interface AttendanceRecord {
  id: string;
  turmaId: string;
  disciplina: string;
  data: string; // YYYY-MM-DD
  professorNome: string;
  alunoId: string;
  status: AttendanceStatus;
  minutosAtraso?: number;
  observacao?: string;
  atestadoId?: string;
  createdAt: string;
}

export interface ClassSession {
  id: string;
  codigoTurma: string;
  nomeTurma: string;
  curso: string;
  disciplinaPadrao: string;
  periodo: "Manhã" | "Tarde" | "Noite";
  sala: string;
}
