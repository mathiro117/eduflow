export type CertificateStatus = "pendente" | "aprovado" | "recusado";

export type CertificateType =
  | "atestado_medico"
  | "declaracao_comparecimento"
  | "odontologico"
  | "outros";

export interface MedicalCertificate {
  id: string;
  alunoId: string;
  alunoNome: string;
  matricula: string;
  turma: string;
  tipo: CertificateType;
  tipoLabel: string;
  cidOuMotivo: string;
  dataInicio: string; // YYYY-MM-DD
  dataFim: string; // YYYY-MM-DD
  diasAfastamento: number;
  observacaoAluno: string;
  nomeArquivoSimulado: string;
  tamanhoArquivo: string;
  dataEnvio: string; // ISO
  status: CertificateStatus;
  parecerEquipe?: string;
  motivoRecusa?: string;
  julgadoPor?: string;
  dataJulgamento?: string;
}

export interface SubmitCertificateInput {
  tipo: CertificateType;
  cidOuMotivo: string;
  dataInicio: string;
  dataFim: string;
  observacaoAluno: string;
  nomeArquivoSimulado?: string;
}
