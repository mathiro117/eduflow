"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CreateOccurrenceInput,
  Occurrence,
  OccurrenceCategory,
  OccurrenceSeverity,
} from "@/types/occurrences";
import { MOCK_STUDENTS } from "./AttendanceContext";

export const CATEGORY_LABELS: Record<OccurrenceCategory, string> = {
  uniforme: "Uniforme / Vestimenta Inadequada",
  calcado_epi: "Calçado / EPI Inadequado para Laboratório",
  atraso_reiterado: "Atraso Reiterado / Saída Não Autorizada",
  celular_equipamento: "Uso Indevido de Celular / Equipamento",
  outros: "Outro Desvio Disciplinar",
};

const INITIAL_OCCURRENCES: Occurrence[] = [
  {
    id: "occ-demo-1",
    alunoId: "demo-aluno-1",
    alunoNome: "Lucas da Silva",
    turma: "DS-2026-01",
    matricula: "SN-2026-0042",
    categoria: "uniforme",
    categoriaLabel: "Uniforme / Vestimenta Inadequada",
    severidade: "leve",
    medidaAdotada: "Orientação verbal em sala",
    observacao: "Aluno compareceu sem a camiseta oficial do SENAI. Informou que a peça estava no varal secando.",
    registradoPor: "Mariana Silva",
    registradorRole: "Apoio / Inspetoria",
    dataHora: "2026-09-18T08:15:00Z",
    status: "regularizada",
  },
  {
    id: "occ-demo-2",
    alunoId: "std-ds-5",
    alunoNome: "Matheus Rodrigues",
    turma: "DS-2026-01",
    matricula: "SN-2026-0046",
    categoria: "calcado_epi",
    categoriaLabel: "Calçado / EPI Inadequado para Laboratório",
    severidade: "alta",
    medidaAdotada: "Encaminhamento à Coordenação/Vida Escolar",
    observacao: "Aluno tentou adentrar a oficina mecânica trajando bermuda e calçado aberto tipo sandália.",
    registradoPor: "Prof. Carlos Mendes",
    registradorRole: "Docente / Instrutor",
    dataHora: "2026-09-19T13:40:00Z",
    status: "pendente",
  },
  {
    id: "occ-demo-3",
    alunoId: "std-ds-5",
    alunoNome: "Matheus Rodrigues",
    turma: "DS-2026-01",
    matricula: "SN-2026-0046",
    categoria: "celular_equipamento",
    categoriaLabel: "Uso Indevido de Celular / Equipamento",
    severidade: "media",
    medidaAdotada: "Notificação aos responsáveis",
    observacao: "Utilização de fones de ouvido durante instrução técnica de segurança na bancada.",
    registradoPor: "Mariana Silva",
    registradorRole: "Apoio / Inspetoria",
    dataHora: "2026-09-20T09:30:00Z",
    status: "em_analise",
  },
];

interface OccurrencesContextType {
  occurrences: Occurrence[];
  createOccurrence: (
    input: CreateOccurrenceInput,
    registradoPor: string,
    registradorRole: string
  ) => Occurrence;
  getStudentOccurrenceCount: (alunoId: string) => number;
  getStudentOccurrences: (alunoId: string) => Occurrence[];
  getDashboardOccurrenceStats: () => {
    totalOcorrencias: number;
    pendentes: number;
    emAnalise: number;
    regularizadas: number;
  };
}

const OccurrencesContext = createContext<OccurrencesContextType | undefined>(undefined);

const STORAGE_KEY = "facilita_senai_occurrences";

export function OccurrencesProvider({ children }: { children: React.ReactNode }) {
  const [occurrences, setOccurrences] = useState<Occurrence[]>(INITIAL_OCCURRENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOccurrences(parsed);
        }
      } catch (err) {
        console.error("Erro ao carregar ocorrências:", err);
      }
    }
    setIsLoaded(true);
  }, []);

  const createOccurrence = (
    input: CreateOccurrenceInput,
    registradoPor: string,
    registradorRole: string
  ): Occurrence => {
    const student = MOCK_STUDENTS.find((s) => s.id === input.alunoId);
    const categoryLabel =
      input.categoria === "outros" && input.categoriaCustomizada
        ? input.categoriaCustomizada
        : CATEGORY_LABELS[input.categoria];

    const newOcc: Occurrence = {
      id: `occ-${Date.now()}`,
      alunoId: input.alunoId,
      alunoNome: student ? student.nome : "Aluno Não Identificado",
      turma: student ? student.turmaId : "N/D",
      matricula: student ? student.matricula : "N/D",
      categoria: input.categoria,
      categoriaLabel: categoryLabel,
      severidade: input.severidade,
      medidaAdotada: input.medidaAdotada,
      observacao: input.observacao,
      registradoPor,
      registradorRole,
      dataHora: new Date().toISOString(),
      status: "pendente",
    };

    const updated = [newOcc, ...occurrences];
    setOccurrences(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newOcc;
  };

  const getStudentOccurrenceCount = (alunoId: string): number => {
    return occurrences.filter((o) => o.alunoId === alunoId).length;
  };

  const getStudentOccurrences = (alunoId: string): Occurrence[] => {
    return occurrences
      .filter((o) => o.alunoId === alunoId)
      .sort((a, b) => (a.dataHora < b.dataHora ? 1 : -1));
  };

  const getDashboardOccurrenceStats = () => {
    const totalOcorrencias = occurrences.length;
    const pendentes = occurrences.filter((o) => o.status === "pendente").length;
    const emAnalise = occurrences.filter((o) => o.status === "em_analise").length;
    const regularizadas = occurrences.filter((o) => o.status === "regularizada").length;

    return {
      totalOcorrencias,
      pendentes,
      emAnalise,
      regularizadas,
    };
  };

  return (
    <OccurrencesContext.Provider
      value={{
        occurrences,
        createOccurrence,
        getStudentOccurrenceCount,
        getStudentOccurrences,
        getDashboardOccurrenceStats,
      }}
    >
      {children}
    </OccurrencesContext.Provider>
  );
}

export function useOccurrences(): OccurrencesContextType {
  const context = useContext(OccurrencesContext);
  if (!context) {
    throw new Error("useOccurrences deve ser utilizado dentro de um OccurrencesProvider");
  }
  return context;
}
