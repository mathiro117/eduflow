"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAttendance } from "@/context/AttendanceContext";
import { AttendanceStatus, StudentAttendanceInput } from "@/types/attendance";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Save,
  Check,
  Calendar,
  Layers,
  Search,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

const MINUTE_PRESETS = [5, 10, 15, 20, 30];

export function AttendanceTeacherView() {
  const { currentUser } = useAuth();
  const {
    classes,
    getStudentsByTurma,
    getRecordsForTurmaAndDate,
    saveAttendance,
  } = useAttendance();

  // Estados dos filtros
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>("DS-2026-01");
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Estado da chamada corrente para cada aluno
  const [attendanceEntries, setAttendanceEntries] = useState<
    Record<string, { status: AttendanceStatus; minutosAtraso?: number; observacao?: string }>
  >({});

  // Feedback de salvamento
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedClass = classes.find((c) => c.id === selectedTurmaId) || classes[0];
  const students = getStudentsByTurma(selectedTurmaId);

  // Carrega ou inicializa a chamada ao mudar turma ou data
  useEffect(() => {
    const existingRecords = getRecordsForTurmaAndDate(selectedTurmaId, selectedDate);
    const initialMap: Record<
      string,
      { status: AttendanceStatus; minutosAtraso?: number; observacao?: string }
    > = {};

    students.forEach((student) => {
      const found = existingRecords.find((r) => r.alunoId === student.id);
      if (found) {
        initialMap[student.id] = {
          status: found.status,
          minutosAtraso: found.minutosAtraso,
          observacao: found.observacao,
        };
      } else {
        // Padrão: presente para facilitar a rotina
        initialMap[student.id] = {
          status: "presente",
        };
      }
    });

    setAttendanceEntries(initialMap);
    setSaveSuccess(false);
  }, [selectedTurmaId, selectedDate]);

  // Ação Rápida: Marcar todos como presentes
  const handleMarkAllPresent = () => {
    setAttendanceEntries((prev) => {
      const updated = { ...prev };
      students.forEach((s) => {
        updated[s.id] = {
          status: "presente",
        };
      });
      return updated;
    });
  };

  // Alterar status de um aluno individual
  const handleStatusChange = (alunoId: string, status: AttendanceStatus) => {
    setAttendanceEntries((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        status,
        minutosAtraso: status === "atraso" ? prev[alunoId]?.minutosAtraso || 10 : undefined,
      },
    }));
  };

  // Alterar minutos de atraso
  const handleMinutesChange = (alunoId: string, minutes: number) => {
    setAttendanceEntries((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        minutosAtraso: minutes,
      },
    }));
  };

  // Alterar observação
  const handleObservationChange = (alunoId: string, obs: string) => {
    setAttendanceEntries((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        observacao: obs,
      },
    }));
  };

  // Salvar chamada
  const handleSave = () => {
    const inputs: StudentAttendanceInput[] = Object.entries(attendanceEntries).map(
      ([alunoId, data]) => ({
        alunoId,
        status: data.status,
        minutosAtraso: data.minutosAtraso,
        observacao: data.observacao,
      })
    );

    saveAttendance(
      selectedTurmaId,
      selectedDate,
      selectedClass.disciplinaPadrao,
      currentUser.name,
      inputs
    );

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  // Estatísticas em tempo real da tela
  const totalStudents = students.length;
  const countPresentes = Object.values(attendanceEntries).filter((e) => e.status === "presente").length;
  const countAtrasos = Object.values(attendanceEntries).filter((e) => e.status === "atraso").length;
  const countFaltas = Object.values(attendanceEntries).filter((e) => e.status === "falta").length;

  const filteredStudents = students.filter(
    (s) =>
      s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast de Sucesso Flutuante */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="font-bold text-sm">Chamada Registrada com Sucesso!</div>
            <div className="text-xs text-slate-300">
              Os dados foram sincronizados e as métricas do painel foram atualizadas.
            </div>
          </div>
        </div>
      )}

      {/* Topo do Módulo: Cabeçalho & Seletores */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Diário de Classe Digital
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              Frequência e Registro de Atraso
            </h1>
            <p className="text-sm text-slate-500">
              Docente responsável: <strong>{currentUser.name}</strong> • Sala: {selectedClass.sala}
            </p>
          </div>

          {/* Botão de Salvar no Topo */}
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Salvar Chamada
          </button>
        </div>

        {/* Seletores de Turma e Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Turma
            </label>
            <div className="relative">
              <select
                value={selectedTurmaId}
                onChange={(e) => setSelectedTurmaId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nomeTurma}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Data da Aula
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Disciplina / Unidade Curricular
            </label>
            <div className="px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 truncate">
              {selectedClass.disciplinaPadrao} ({selectedClass.periodo})
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Ações Rápidas & Contadores Semafóricos */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Contadores Semafóricos */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{countPresentes} Presentes</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{countAtrasos} Atrasos</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            <XCircle className="w-4 h-4 text-red-600" />
            <span>{countFaltas} Faltas</span>
          </div>
          <span className="text-xs text-slate-400 pl-1">
            Total: {totalStudents} alunos
          </span>
        </div>

        {/* Botão Ação Rápida */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            Marcar Todos como Presentes
          </button>
        </div>
      </div>

      {/* Campo de Busca Rápida */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filtrar por nome ou matrícula do aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:outline-none shadow-xs"
        />
      </div>

      {/* Lista de Estudantes da Chamada */}
      <div className="space-y-3">
        {filteredStudents.map((student, index) => {
          const currentEntry = attendanceEntries[student.id] || { status: "presente" };
          const isAtraso = currentEntry.status === "atraso";
          const isFalta = currentEntry.status === "falta";
          const isPresente = currentEntry.status === "presente";

          return (
            <div
              key={student.id}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-150 ${
                isFalta
                  ? "border-red-200 bg-red-50/20"
                  : isAtraso
                  ? "border-amber-200 bg-amber-50/20"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Identificação do Aluno */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl ${student.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    {student.nome.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {student.nome}
                      </span>
                      {student.id === "demo-aluno-1" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Aluno Demo
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      Matrícula: <span className="font-mono">{student.matricula}</span> • Nº {index + 1}
                    </div>
                  </div>
                </div>

                {/* Botões Semafóricos de Alternância de Status */}
                <div className="flex items-center gap-1.5 self-start lg:self-auto bg-slate-100 p-1 rounded-xl">
                  {/* Presente */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, "presente")}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isPresente
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Presente
                  </button>

                  {/* Atraso */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, "atraso")}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isAtraso
                        ? "bg-amber-500 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Atraso
                  </button>

                  {/* Falta */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, "falta")}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isFalta
                        ? "bg-red-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Falta
                  </button>
                </div>
              </div>

              {/* Seção Condicional Expandida quando for ATRASO */}
              {isAtraso && (
                <div className="mt-4 pt-3.5 border-t border-amber-200/70 space-y-3 animate-in fade-in-50 duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Minutos de atraso:
                      </span>
                      <div className="flex items-center gap-1">
                        {MINUTE_PRESETS.map((min) => (
                          <button
                            key={min}
                            type="button"
                            onClick={() => handleMinutesChange(student.id, min)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              currentEntry.minutosAtraso === min
                                ? "bg-amber-600 text-white shadow-2xs"
                                : "bg-white border border-amber-300 text-amber-800 hover:bg-amber-100/50"
                            }`}
                          >
                            +{min}m
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Observação rápida (ex: problema no transporte, catraca, fila)..."
                        value={currentEntry.observacao || ""}
                        onChange={(e) => handleObservationChange(student.id, e.target.value)}
                        className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-amber-900/40 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
            Nenhum aluno encontrado para o filtro "{searchTerm}".
          </div>
        )}
      </div>

      {/* Botão Flutuante / Fixo de Salvar no Rodapé */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Alterações são salvas instantaneamente ao clicar em <strong>Salvar Chamada</strong>.
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Salvar Chamada
        </button>
      </div>
    </div>
  );
}
