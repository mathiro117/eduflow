"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAttendance, MOCK_CLASSES, MOCK_STUDENTS } from "@/context/AttendanceContext";
import { useOccurrences } from "@/context/OccurrencesContext";
import { useCertificates } from "@/context/CertificatesContext";
import { StudentProfileModal } from "@/components/alunos/StudentProfileModal";
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  Clock,
  AlertTriangle,
  FileCheck,
  ArrowUpRight,
  School,
  Lock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AlunosPage() {
  const { currentUser } = useAuth();
  const { getStudentHistory } = useAttendance();
  const { getStudentOccurrenceCount } = useOccurrences();
  const { getStudentCertificates } = useCertificates();

  const [selectedTurma, setSelectedTurma] = useState<string>("todas");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Bloqueio de acesso para o perfil Aluno
  if (currentUser.role === "aluno") {
    return (
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Acesso Restrito à Equipe Pedagógica
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              A listagem global de alunos e turmas é reservada para Professores, Apoio e Coordenação. Você pode acessar seus dados individuais nos módulos dedicados:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
            <Link
              href="/frequencia"
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-red-300 hover:bg-red-50/40 text-xs font-bold text-slate-800 transition-all flex flex-col items-center gap-1.5"
            >
              <GraduationCap className="w-5 h-5 text-red-600" />
              Minha Frequência
            </Link>

            <Link
              href="/ocorrencias"
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-xs font-bold text-slate-800 transition-all flex flex-col items-center gap-1.5"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Minhas Ocorrências
            </Link>

            <Link
              href="/atestados"
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-xs font-bold text-slate-800 transition-all flex flex-col items-center gap-1.5"
            >
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Meus Atestados
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Filtragem dos alunos
  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesTurma =
      selectedTurma === "todas" ? true : student.turmaId === selectedTurma;

    const matchesSearch =
      student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTurma && matchesSearch;
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Topo do Módulo */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
              <Users className="w-3.5 h-3.5" />
              Gestão Unificada de Turmas • SENAI
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              Painel de Alunos & Prontuário 360°
            </h1>
            <p className="text-sm text-slate-500">
              Consulta consolidada de frequência, ocorrências de uniforme e atestados médicos por estudante.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            Total na base: <strong className="text-slate-900">{MOCK_STUDENTS.length} alunos cadastrados</strong>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          {/* Busca por Texto */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome do aluno, matrícula ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Filtro de Turma */}
          <div>
            <select
              value={selectedTurma}
              onChange={(e) => setSelectedTurma(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
            >
              <option value="todas">Todas as Turmas (Geral)</option>
              {MOCK_CLASSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nomeTurma}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Alunos em Cards Corporativos */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredStudents.map((student) => {
          // Estatísticas do Aluno calculadas em tempo real
          const history = getStudentHistory(student.id);
          const occurrencesCount = getStudentOccurrenceCount(student.id);
          const certificates = getStudentCertificates(student.id);

          const totalAulas = history.length;
          const presencas = history.filter((r) => r.status === "presente").length;
          const atrasos = history.filter((r) => r.status === "atraso").length;
          const justificados = history.filter((r) => r.status === "justificado").length;
          const faltas = history.filter((r) => r.status === "falta").length;

          const percentualPresenca =
            totalAulas > 0
              ? Math.round(((presencas + atrasos + justificados) / totalAulas) * 100)
              : 100;

          const isRegular = percentualPresenca >= 75;

          return (
            <div
              key={student.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              {/* Identificação do Aluno */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${student.avatarColor} text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs`}
                >
                  {student.nome.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-base">
                      {student.nome}
                    </span>
                    {student.id === "demo-aluno-1" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Aluno Demo
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    Turma: <strong className="text-slate-700">{student.turmaId}</strong> • Matrícula:{" "}
                    <span className="font-mono">{student.matricula}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{student.email}</div>
                </div>
              </div>

              {/* Indicadores & Badges Rápidos */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* % de Frequência Semafórico */}
                <div className="px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold">
                  {isRegular ? (
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{percentualPresenca}% Assiduidade</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-700">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>{percentualPresenca}% Em Risco</span>
                    </div>
                  )}
                </div>

                {/* Badge de Atrasos */}
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                    atrasos > 0
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}
                  title="Atrasos registrados na chamada ou portaria"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{atrasos} atraso(s)</span>
                </div>

                {/* Badge de Ocorrências com Reincidência */}
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                    occurrencesCount >= 2
                      ? "bg-red-100 border-red-300 text-red-800 animate-pulse"
                      : occurrencesCount === 1
                      ? "bg-orange-50 border-orange-200 text-orange-800"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}
                  title="Ocorrências disciplinares ou de uniforme"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    {occurrencesCount >= 2
                      ? `Reincidente (${occurrencesCount})`
                      : `${occurrencesCount} desvio(s)`}
                  </span>
                </div>

                {/* Badge de Atestados */}
                {certificates.length > 0 && (
                  <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>{certificates.length} atestado(s)</span>
                  </div>
                )}
              </div>

              {/* Botão de Ficha 360° */}
              <div className="shrink-0 self-end lg:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedStudentId(student.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-red-600 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <span>Ver Ficha 360°</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
            Nenhum estudante encontrado com o filtro "{searchTerm}".
          </div>
        )}
      </div>

      {/* Modal / Prontuário 360° */}
      {selectedStudentId && (
        <StudentProfileModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </main>
  );
}
