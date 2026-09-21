"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useAttendance } from "@/context/AttendanceContext";
import {
  CheckCircle2,
  Clock,
  XCircle,
  GraduationCap,
  Calendar,
  AlertTriangle,
  Info,
  ShieldCheck,
} from "lucide-react";

export function AttendanceStudentView() {
  const { currentUser } = useAuth();
  const { getStudentHistory } = useAttendance();

  const history = getStudentHistory(currentUser.id);

  // Estatísticas do Aluno
  const totalAulas = history.length;
  const presencas = history.filter((r) => r.status === "presente").length;
  const atrasos = history.filter((r) => r.status === "atraso").length;
  const justificados = history.filter((r) => r.status === "justificado").length;
  const faltas = history.filter((r) => r.status === "falta").length;

  // Cálculo da porcentagem de assiduidade (presenças, atrasos e faltas justificadas contam positivamente)
  const percentualPresenca =
    totalAulas > 0
      ? Math.round(((presencas + atrasos + justificados) / totalAulas) * 100)
      : 100;

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Aluno */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${currentUser.avatarColor} text-white font-bold text-xl flex items-center justify-center shadow-sm`}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <GraduationCap className="w-3.5 h-3.5" />
                Painel do Estudante
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
                Minha Frequência & Assiduidade
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {currentUser.name} • Turma: <strong>{currentUser.turma}</strong> • Matrícula:{" "}
                <span className="font-mono">{currentUser.matricula}</span>
              </p>
            </div>
          </div>

          {/* Badge de Situação Escolar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Situação Acadêmica
              </div>
              <div className="text-sm font-bold text-emerald-700">
                {percentualPresenca >= 75 ? "Frequência Regular (Apto)" : "Atenção (Risco de Reprovação)"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade de Indicadores do Aluno */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* % Assiduidade */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Índice de Presença</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold tracking-tight ${
                percentualPresenca >= 75 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {percentualPresenca}%
            </span>
            <span className="text-xs text-slate-400">meta: 75%</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentualPresenca >= 75 ? "bg-emerald-500" : "bg-red-500"
              }`}
              style={{ width: `${percentualPresenca}%` }}
            />
          </div>
        </div>

        {/* Total de Presenças */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Presenças Pontuais</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{presencas}</div>
          <div className="mt-1 text-xs text-slate-500">Aulas com registro pontual</div>
        </div>

        {/* Atrasos Registrados */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Atrasos de Entrada</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-amber-600">{atrasos}</div>
          <div className="mt-1 text-xs text-slate-500">Entradas toleradas com registro</div>
        </div>

        {/* Faltas Não Justificadas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Faltas Registradas</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-red-600">{faltas}</div>
          <div className="mt-1 text-xs text-slate-500">Faltas no diário docente</div>
        </div>
      </div>

      {/* Histórico Detalhado de Chamadas */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Histórico de Registros</h2>
            <p className="text-xs text-slate-500">
              Lançamentos sincronizados pelo docente responsável. Modo apenas visualização.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {history.length} registros
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {history.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 shrink-0">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{rec.disciplina}</div>
                  <div className="text-xs text-slate-500">
                    Data: <span className="font-semibold text-slate-700">{rec.data}</span> • Docente:{" "}
                    {rec.professorNome}
                  </div>
                  {rec.observacao && (
                    <div className="mt-1 text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block border border-amber-200">
                      Obs: {rec.observacao}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-start sm:self-center">
                {rec.status === "presente" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Presente
                  </span>
                )}
                {rec.status === "atraso" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3.5 h-3.5" />
                    Atraso ({rec.minutosAtraso || 10} min)
                  </span>
                )}
                {rec.status === "justificado" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Falta Justificada (Atestado)
                  </span>
                )}
                {rec.status === "falta" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    <XCircle className="w-3.5 h-3.5" />
                    Falta
                  </span>
                )}
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Nenhum registro de frequência encontrado até o momento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
