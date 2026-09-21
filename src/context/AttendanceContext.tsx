"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AttendanceRecord,
  AttendanceStatus,
  ClassSession,
  Student,
  StudentAttendanceInput,
} from "@/types/attendance";

export const MOCK_CLASSES: ClassSession[] = [
  {
    id: "DS-2026-01",
    codigoTurma: "DS-2026-01",
    nomeTurma: "DS-2026-01 - Técnico em Desenvolvimento de Sistemas",
    curso: "Técnico em Desenvolvimento de Sistemas",
    disciplinaPadrao: "Desenvolvimento Web & Cloud",
    periodo: "Tarde",
    sala: "Laboratório 04",
  },
  {
    id: "MEC-2026-02",
    codigoTurma: "MEC-2026-02",
    nomeTurma: "MEC-2026-02 - Técnico em Mecatrônica Industrial",
    curso: "Técnico em Mecatrônica",
    disciplinaPadrao: "Automação & Robótica",
    periodo: "Manhã",
    sala: "Oficina 02",
  },
];

export const MOCK_STUDENTS: Student[] = [
  // Turma DS-2026-01
  {
    id: "demo-aluno-1",
    nome: "Lucas da Silva",
    matricula: "SN-2026-0042",
    turmaId: "DS-2026-01",
    email: "aluno@demo.com",
    avatarColor: "bg-emerald-600",
  },
  {
    id: "std-ds-2",
    nome: "Beatriz Oliveira",
    matricula: "SN-2026-0043",
    turmaId: "DS-2026-01",
    email: "beatriz.oliveira@aluno.senai.br",
    avatarColor: "bg-indigo-600",
  },
  {
    id: "std-ds-3",
    nome: "Gabriel Santos",
    matricula: "SN-2026-0044",
    turmaId: "DS-2026-01",
    email: "gabriel.santos@aluno.senai.br",
    avatarColor: "bg-rose-600",
  },
  {
    id: "std-ds-4",
    nome: "Helena Fernandes",
    matricula: "SN-2026-0045",
    turmaId: "DS-2026-01",
    email: "helena.f@aluno.senai.br",
    avatarColor: "bg-violet-600",
  },
  {
    id: "std-ds-5",
    nome: "Matheus Rodrigues",
    matricula: "SN-2026-0046",
    turmaId: "DS-2026-01",
    email: "matheus.r@aluno.senai.br",
    avatarColor: "bg-cyan-600",
  },
  {
    id: "std-ds-6",
    nome: "Rafaela Martins",
    matricula: "SN-2026-0047",
    turmaId: "DS-2026-01",
    email: "rafaela.m@aluno.senai.br",
    avatarColor: "bg-amber-600",
  },
  {
    id: "std-ds-7",
    nome: "Vinicius Costa",
    matricula: "SN-2026-0048",
    turmaId: "DS-2026-01",
    email: "vinicius.c@aluno.senai.br",
    avatarColor: "bg-teal-600",
  },
  {
    id: "std-ds-8",
    nome: "Yasmin Souza",
    matricula: "SN-2026-0049",
    turmaId: "DS-2026-01",
    email: "yasmin.s@aluno.senai.br",
    avatarColor: "bg-fuchsia-600",
  },

  // Turma MEC-2026-02
  {
    id: "std-mec-1",
    nome: "Arthur Lima",
    matricula: "SN-2026-0110",
    turmaId: "MEC-2026-02",
    email: "arthur.lima@aluno.senai.br",
    avatarColor: "bg-blue-600",
  },
  {
    id: "std-mec-2",
    nome: "Camila Ribeiro",
    matricula: "SN-2026-0111",
    turmaId: "MEC-2026-02",
    email: "camila.r@aluno.senai.br",
    avatarColor: "bg-pink-600",
  },
  {
    id: "std-mec-3",
    nome: "Diego Almeida",
    matricula: "SN-2026-0112",
    turmaId: "MEC-2026-02",
    email: "diego.a@aluno.senai.br",
    avatarColor: "bg-lime-600",
  },
];

const INITIAL_RECORDS: AttendanceRecord[] = [
  // Histórico anterior para o Lucas ter dados no histórico pessoal
  {
    id: "rec-hist-1",
    turmaId: "DS-2026-01",
    disciplina: "Desenvolvimento Web & Cloud",
    data: "2026-09-18",
    professorNome: "Prof. Carlos Mendes",
    alunoId: "demo-aluno-1",
    status: "presente",
    createdAt: "2026-09-18T14:10:00Z",
  },
  {
    id: "rec-hist-2",
    turmaId: "DS-2026-01",
    disciplina: "Banco de Dados & SQL",
    data: "2026-09-19",
    professorNome: "Prof. Carlos Mendes",
    alunoId: "demo-aluno-1",
    status: "presente",
    createdAt: "2026-09-19T14:05:00Z",
  },
  {
    id: "rec-hist-3",
    turmaId: "DS-2026-01",
    disciplina: "Arquitetura de Software",
    data: "2026-09-20",
    professorNome: "Prof. Carlos Mendes",
    alunoId: "demo-aluno-1",
    status: "atraso",
    minutosAtraso: 15,
    observacao: "Atraso no trem da Linha 9 - Esmeralda",
    createdAt: "2026-09-20T14:20:00Z",
  },
];

interface AttendanceContextType {
  classes: ClassSession[];
  students: Student[];
  records: AttendanceRecord[];
  getStudentsByTurma: (turmaId: string) => Student[];
  getRecordsForTurmaAndDate: (turmaId: string, date: string) => AttendanceRecord[];
  getStudentHistory: (alunoId: string) => AttendanceRecord[];
  saveAttendance: (
    turmaId: string,
    data: string,
    disciplina: string,
    professorNome: string,
    entries: StudentAttendanceInput[]
  ) => void;
  justifyAbsence: (
    alunoId: string,
    dataInicio: string,
    dataFim: string,
    atestadoId: string,
    motivo: string
  ) => number;
  getDashboardAttendanceStats: () => {
    totalAtrasosHoje: number;
    totalFaltasHoje: number;
    totalPresencasHoje: number;
  };
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const STORAGE_KEY = "facilita_senai_attendance_records";

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords(parsed);
        }
      } catch (err) {
        console.error("Erro ao carregar registros de frequência:", err);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveAttendance = (
    turmaId: string,
    data: string,
    disciplina: string,
    professorNome: string,
    entries: StudentAttendanceInput[]
  ) => {
    // Remove registros antigos da mesma turma e data (sobrescreve com a nova chamada)
    const filtered = records.filter(
      (r) => !(r.turmaId === turmaId && r.data === data)
    );

    const now = new Date().toISOString();
    const newRecords: AttendanceRecord[] = entries.map((entry) => ({
      id: `att-${Date.now()}-${entry.alunoId}`,
      turmaId,
      disciplina,
      data,
      professorNome,
      alunoId: entry.alunoId,
      status: entry.status,
      minutosAtraso: entry.minutosAtraso,
      observacao: entry.observacao,
      atestadoId: entry.atestadoId,
      createdAt: now,
    }));

    const updated = [...filtered, ...newRecords];
    setRecords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const justifyAbsence = (
    alunoId: string,
    dataInicio: string,
    dataFim: string,
    atestadoId: string,
    motivo: string
  ) => {
    let count = 0;
    const updated = records.map((rec) => {
      if (
        rec.alunoId === alunoId &&
        rec.data >= dataInicio &&
        rec.data <= dataFim &&
        rec.status === "falta"
      ) {
        count++;
        return {
          ...rec,
          status: "justificado" as AttendanceStatus,
          atestadoId,
          observacao: `Atestado deferido pela Coordenação: ${motivo}`,
        };
      }
      return rec;
    });

    if (count === 0) {
      const student = MOCK_STUDENTS.find((s) => s.id === alunoId);
      if (student) {
        const justifiedRec: AttendanceRecord = {
          id: `att-just-${Date.now()}`,
          turmaId: student.turmaId,
          disciplina: "Desenvolvimento Web (Falta Abonada)",
          data: dataInicio,
          professorNome: "Secretaria / Vida Escolar",
          alunoId,
          status: "justificado",
          atestadoId,
          observacao: `Falta abonada por atestado médico: ${motivo}`,
          createdAt: new Date().toISOString(),
        };
        updated.push(justifiedRec);
        count = 1;
      }
    }

    setRecords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return count;
  };

  const getStudentsByTurma = (turmaId: string) => {
    return MOCK_STUDENTS.filter((s) => s.turmaId === turmaId);
  };

  const getRecordsForTurmaAndDate = (turmaId: string, date: string) => {
    return records.filter((r) => r.turmaId === turmaId && r.data === date);
  };

  const getStudentHistory = (alunoId: string) => {
    return records
      .filter((r) => r.alunoId === alunoId)
      .sort((a, b) => (a.data < b.data ? 1 : -1));
  };

  const getDashboardAttendanceStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = records.filter((r) => r.data === today);
    const targetRecords = todayRecords.length > 0 ? todayRecords : records;

    const totalAtrasosHoje = targetRecords.filter((r) => r.status === "atraso").length;
    const totalFaltasHoje = targetRecords.filter((r) => r.status === "falta").length;
    const totalPresencasHoje = targetRecords.filter((r) => r.status === "presente").length;

    return {
      totalAtrasosHoje,
      totalFaltasHoje,
      totalPresencasHoje,
    };
  };

  return (
    <AttendanceContext.Provider
      value={{
        classes: MOCK_CLASSES,
        students: MOCK_STUDENTS,
        records,
        getStudentsByTurma,
        getRecordsForTurmaAndDate,
        getStudentHistory,
        saveAttendance,
        justifyAbsence,
        getDashboardAttendanceStats,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance(): AttendanceContextType {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance deve ser utilizado dentro de um AttendanceProvider");
  }
  return context;
}
