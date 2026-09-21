"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CertificateStatus,
  CertificateType,
  MedicalCertificate,
  SubmitCertificateInput,
} from "@/types/certificates";
import { useAttendance } from "./AttendanceContext";

export const CERTIFICATE_TYPE_LABELS: Record<CertificateType, string> = {
  atestado_medico: "Atestado Médico Clínico",
  declaracao_comparecimento: "Declaração de Comparecimento",
  odontologico: "Atestado Odontológico",
  outros: "Outra Justificativa Legal",
};

const INITIAL_CERTIFICATES: MedicalCertificate[] = [
  {
    id: "cert-demo-1",
    alunoId: "demo-aluno-1",
    alunoNome: "Lucas da Silva",
    matricula: "SN-2026-0042",
    turma: "DS-2026-01",
    tipo: "atestado_medico",
    tipoLabel: "Atestado Médico Clínico",
    cidOuMotivo: "J06.9 - Infecção aguda das vias aéreas superiores (Gripe forte)",
    dataInicio: "2026-09-21",
    dataFim: "2026-09-22",
    diasAfastamento: 2,
    observacaoAluno: "Estive na UPA Leopoldina pela manhã com febre e recebi recomendação de repouso por 48h.",
    nomeArquivoSimulado: "atestado_upa_leopoldina_21set.pdf",
    tamanhoArquivo: "1.4 MB",
    dataEnvio: "2026-09-21T09:40:00Z",
    status: "pendente",
  },
  {
    id: "cert-demo-2",
    alunoId: "demo-aluno-1",
    alunoNome: "Lucas da Silva",
    matricula: "SN-2026-0042",
    turma: "DS-2026-01",
    tipo: "odontologico",
    tipoLabel: "Atestado Odontológico",
    cidOuMotivo: "K01.1 - Procedimento cirúrgico odontológico (Extração)",
    dataInicio: "2026-09-10",
    dataFim: "2026-09-10",
    diasAfastamento: 1,
    observacaoAluno: "Cirurgia de extração dentária agendada.",
    nomeArquivoSimulado: "declaracao_clinica_odonto.pdf",
    tamanhoArquivo: "850 KB",
    dataEnvio: "2026-09-10T11:00:00Z",
    status: "aprovado",
    parecerEquipe: "Documento homologado pelo ambulatório escolar. Falta abonada.",
    julgadoPor: "Coordenação Geral",
    dataJulgamento: "2026-09-10T14:20:00Z",
  },
  {
    id: "cert-demo-3",
    alunoId: "std-ds-2",
    alunoNome: "Beatriz Oliveira",
    matricula: "SN-2026-0043",
    turma: "DS-2026-01",
    tipo: "declaracao_comparecimento",
    tipoLabel: "Declaração de Comparecimento",
    cidOuMotivo: "Comparecimento em exame laboratorial de rotina",
    dataInicio: "2026-09-21",
    dataFim: "2026-09-21",
    diasAfastamento: 1,
    observacaoAluno: "Exames de sangue em jejum no laboratório Fleury.",
    nomeArquivoSimulado: "comprovante_laboratorio.pdf",
    tamanhoArquivo: "620 KB",
    dataEnvio: "2026-09-21T10:15:00Z",
    status: "pendente",
  },
];

interface CertificatesContextType {
  certificates: MedicalCertificate[];
  submitCertificate: (
    input: SubmitCertificateInput,
    alunoId: string,
    alunoNome: string,
    matricula: string,
    turma: string
  ) => MedicalCertificate;
  approveCertificate: (id: string, parecer: string, julgadoPor: string) => void;
  rejectCertificate: (id: string, motivoRecusa: string, julgadoPor: string) => void;
  getStudentCertificates: (alunoId: string) => MedicalCertificate[];
  getDashboardCertificateStats: () => {
    totalCertificados: number;
    pendentes: number;
    aprovados: number;
    recusados: number;
  };
}

const CertificatesContext = createContext<CertificatesContextType | undefined>(undefined);

const STORAGE_KEY = "facilita_senai_medical_certificates";

export function CertificatesProvider({ children }: { children: React.ReactNode }) {
  const [certificates, setCertificates] = useState<MedicalCertificate[]>(INITIAL_CERTIFICATES);
  const [isLoaded, setIsLoaded] = useState(false);
  const { justifyAbsence } = useAttendance();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCertificates(parsed);
        }
      } catch (err) {
        console.error("Erro ao carregar atestados:", err);
      }
    }
    setIsLoaded(true);
  }, []);

  const submitCertificate = (
    input: SubmitCertificateInput,
    alunoId: string,
    alunoNome: string,
    matricula: string,
    turma: string
  ): MedicalCertificate => {
    const d1 = new Date(input.dataInicio);
    const d2 = new Date(input.dataFim);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newCert: MedicalCertificate = {
      id: `cert-${Date.now()}`,
      alunoId,
      alunoNome,
      matricula,
      turma,
      tipo: input.tipo,
      tipoLabel: CERTIFICATE_TYPE_LABELS[input.tipo],
      cidOuMotivo: input.cidOuMotivo,
      dataInicio: input.dataInicio,
      dataFim: input.dataFim,
      diasAfastamento: diffDays > 0 ? diffDays : 1,
      observacaoAluno: input.observacaoAluno,
      nomeArquivoSimulado: input.nomeArquivoSimulado || "documento_atestado_medico.pdf",
      tamanhoArquivo: "1.2 MB",
      dataEnvio: new Date().toISOString(),
      status: "pendente",
    };

    const updated = [newCert, ...certificates];
    setCertificates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newCert;
  };

  const approveCertificate = (id: string, parecer: string, julgadoPor: string) => {
    const target = certificates.find((c) => c.id === id);
    if (!target) return;

    // Ação em cascata na frequência escolar: abona as faltas no AttendanceContext!
    justifyAbsence(
      target.alunoId,
      target.dataInicio,
      target.dataFim,
      target.id,
      target.cidOuMotivo
    );

    const now = new Date().toISOString();
    const updated = certificates.map((cert) => {
      if (cert.id === id) {
        return {
          ...cert,
          status: "aprovado" as CertificateStatus,
          parecerEquipe: parecer || "Atestado deferido e homologado. Faltas abonadas no sistema.",
          julgadoPor,
          dataJulgamento: now,
        };
      }
      return cert;
    });

    setCertificates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const rejectCertificate = (id: string, motivoRecusa: string, julgadoPor: string) => {
    const now = new Date().toISOString();
    const updated = certificates.map((cert) => {
      if (cert.id === id) {
        return {
          ...cert,
          status: "recusado" as CertificateStatus,
          motivoRecusa: motivoRecusa || "Documento ilegível ou em desacordo com as normas.",
          julgadoPor,
          dataJulgamento: now,
        };
      }
      return cert;
    });

    setCertificates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getStudentCertificates = (alunoId: string): MedicalCertificate[] => {
    return certificates
      .filter((c) => c.alunoId === alunoId)
      .sort((a, b) => (a.dataEnvio < b.dataEnvio ? 1 : -1));
  };

  const getDashboardCertificateStats = () => {
    const totalCertificados = certificates.length;
    const pendentes = certificates.filter((c) => c.status === "pendente").length;
    const aprovados = certificates.filter((c) => c.status === "aprovado").length;
    const recusados = certificates.filter((c) => c.status === "recusado").length;

    return {
      totalCertificados,
      pendentes,
      aprovados,
      recusados,
    };
  };

  return (
    <CertificatesContext.Provider
      value={{
        certificates,
        submitCertificate,
        approveCertificate,
        rejectCertificate,
        getStudentCertificates,
        getDashboardCertificateStats,
      }}
    >
      {children}
    </CertificatesContext.Provider>
  );
}

export function useCertificates(): CertificatesContextType {
  const context = useContext(CertificatesContext);
  if (!context) {
    throw new Error("useCertificates deve ser utilizado dentro de um CertificatesProvider");
  }
  return context;
}
