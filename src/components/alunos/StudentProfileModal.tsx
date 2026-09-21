"use client";

import React, { useState } from "react";
import { Student } from "@/types/attendance";
import { MOCK_STUDENTS, useAttendance } from "@/context/AttendanceContext";
import { useOccurrences } from "@/context/OccurrencesContext";
import { useCertificates } from "@/context/CertificatesContext";
import {
  X,
  GraduationCap,
  Calendar,
  Clock,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Shirt,
  HardHat,
  Smartphone,
  HelpCircle,
  Paperclip,
  TrendingUp,
  Mail,
  School,
} from "lucide-react";

interface StudentProfileModalProps {
  studentId: string;
  onClose: () => void;
}

export function StudentProfileModal({ studentId, onClose }: StudentProfileModalProps) {
  const student = MOCK_STUDENTS.find((s) => s.id === studentId);
  const { getStudentHistory } = useAttendance();
  const { getStudentOccurrences, getStudentOccurrenceCount } = useOccurrences();
  const { getStudentCertificates } = useCertificates();

  const [activeTab, setActiveTab] = useState<"frequencia" | "ocorrencias" | "atestados">("frequencia");

  if (!student) {
    return null;
  }

  const attendanceHistory = getStudentHistory(student.id);
  const occurrences = getStudentOccurrences(student.id);
  const occurrenceCount = getStudentOccurrenceCount(student.id);
  const certificates = getStudentCertificates(student.id);

  // Cálculos consolidados
  const totalAulas = attendanceHistory.length;
  const presencas = attendanceHistory.filter((r) => r.status === "presente").length;
  const atrasos = attendanceHistory.filter((r) => r.status === "atraso").length;
  const justificados = attendanceHistory.filter((r) => r.status === "justificado").length;
  const faltas = attendanceHistory.filter((r) => r.status === "falta").length;

  const totalMinutosAtraso = attendanceHistory.reduce((acc, curr) => {
    return acc + (curr.minutosAtraso || 0);
  }, 0);

  const percentualPresenca =
    totalAulas > 0
      ? Math.round(((presencas + atrasos + justificados) / totalAulas) * 100)
      : 100;

  const isRegular = percentualPresenca >= 75;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "uniforme":
        return Shirt;
      case "calcado_epi":
        return HardHat;
      case "atraso_reiterado":
        return Clock;
      case "celular_equipamento":
        return Smartphone;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full my-6 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Cabeçalho do Prontuário */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div
              className={`w-16 h-16 rounded-2xl ${student.avatarColor} text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-lg border-2 border-white/20`}
            >
              {student.nome.charAt(0)}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xl sm:text-2xl font-extrabold text-white">
                  {student.nome}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isRegular
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-red-500/20 text-red-300 border border-red-500/40"
                  }`}
                >
                  {isRegular ? "Frequência Regular (Apto)" : "Atenção (Risco de Reprovação)"}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  Turma: <strong>{student.turmaId}</strong>
                </span>
                <span>•</span>
                <span>
                  Matrícula: <strong className="font-mono">{student.matricula}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {student.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cards de Métricas Consolidadas 360° */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Frequência */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Índice Assiduidade</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-extrabold ${
                  isRegular ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {percentualPresenca}%
              </span>
              <span className="text-[11px] text-slate-400">meta 75%</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              {presencas}P • {faltas}F • {justificados}Abonadas
            </div>
          </div>

          {/* Atrasos */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Atrasos de Entrada</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-amber-600">{atrasos}</span>
              <span className="text-xs text-slate-500 font-medium">registros</span>
            </div>
            <div className="mt-1 text-[11px] text-amber-800 font-semibold">
              {totalMinutosAtraso > 0 ? `${totalMinutosAtraso} min acumulados` : "Pontualidade 100%"}
            </div>
          </div>

          {/* Ocorrências com Tag Semafórica */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Ocorrências / Desvios</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900">{occurrenceCount}</span>
              <span className="text-xs text-slate-500 font-medium">itens</span>
            </div>
            <div className="mt-1">
              {occurrenceCount === 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Histórico Limpo
                </span>
              )}
              {occurrenceCount === 1 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  1 Advertência
                </span>
              )}
              {occurrenceCount >= 2 && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-100 text-red-800 animate-pulse">
                  Reincidente ({occurrenceCount})
                </span>
              )}
            </div>
          </div>

          {/* Atestados */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Atestados Médicos</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-blue-600">{certificates.length}</span>
              <span className="text-xs text-slate-500 font-medium">submetidos</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              {certificates.filter((c) => c.status === "aprovado").length} aprovados •{" "}
              {certificates.filter((c) => c.status === "pendente").length} pendentes
            </div>
          </div>
        </div>

        {/* Abas de Detalhamento Cronológico */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("frequencia")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "frequencia"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Diário de Frequência & Atrasos ({attendanceHistory.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ocorrencias")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "ocorrencias"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Ocorrências & Uniforme ({occurrences.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("atestados")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "atestados"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Atestados & Justificativas ({certificates.length})
            </button>
          </div>

          {/* Conteúdo da Aba 1: Frequência */}
          {activeTab === "frequencia" && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {attendanceHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{rec.disciplina}</div>
                      <div className="text-slate-500">
                        Data: <strong>{rec.data}</strong> • Docente: {rec.professorNome}
                      </div>
                      {rec.observacao && (
                        <div className="mt-0.5 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
                          {rec.observacao}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {rec.status === "presente" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Presente
                      </span>
                    )}
                    {rec.status === "atraso" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        Atraso (+{rec.minutosAtraso || 10}m)
                      </span>
                    )}
                    {rec.status === "justificado" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Falta Abonada
                      </span>
                    )}
                    {rec.status === "falta" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Falta
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {attendanceHistory.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  Nenhum registro de chamada para este aluno ainda.
                </div>
              )}
            </div>
          )}

          {/* Conteúdo da Aba 2: Ocorrências */}
          {activeTab === "ocorrencias" && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {occurrences.map((occ) => {
                const CategoryIcon = getCategoryIcon(occ.categoria);
                return (
                  <div
                    key={occ.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 space-y-2 text-xs transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800">
                          <CategoryIcon className="w-3.5 h-3.5 text-slate-600" />
                          {occ.categoriaLabel}
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            occ.severidade === "alta"
                              ? "bg-red-100 text-red-800"
                              : occ.severidade === "media"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          Severidade {occ.severidade.toUpperCase()}
                        </span>
                      </div>

                      <span className="text-slate-400 text-[11px]">
                        {new Date(occ.dataHora).toLocaleDateString("pt-BR")}
                      </span>
                    </div>

                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                      "{occ.observacao}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>
                        Medida adotada: <strong>{occ.medidaAdotada}</strong>
                      </span>
                      <span>Registrado por {occ.registradoPor}</span>
                    </div>
                  </div>
                );
              })}

              {occurrences.length === 0 && (
                <div className="p-8 text-center bg-emerald-50/50 border border-emerald-100 rounded-2xl text-emerald-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="font-bold text-sm">Histórico Impecável</div>
                  <div className="text-xs text-emerald-600 mt-1">
                    Nenhuma ocorrência disciplinar ou de uniforme registrada para este estudante.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conteúdo da Aba 3: Atestados */}
          {activeTab === "atestados" && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 space-y-2 text-xs transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{cert.tipoLabel}</span>
                      <span className="text-slate-500">
                        ({cert.dataInicio} a {cert.dataFim} • {cert.diasAfastamento} dia(s))
                      </span>
                    </div>

                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        cert.status === "aprovado"
                          ? "bg-emerald-100 text-emerald-800"
                          : cert.status === "recusado"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {cert.status === "aprovado"
                        ? "Deferido"
                        : cert.status === "recusado"
                        ? "Indeferido"
                        : "Pendente"}
                    </span>
                  </div>

                  <div className="text-slate-800 font-semibold">{cert.cidOuMotivo}</div>

                  {cert.parecerEquipe && (
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
                      <strong>Parecer:</strong> {cert.parecerEquipe} ({cert.julgadoPor})
                    </div>
                  )}

                  {cert.motivoRecusa && (
                    <div className="p-2 rounded-lg bg-red-50 text-red-800 border border-red-200 text-[11px]">
                      <strong>Motivo da recusa:</strong> {cert.motivoRecusa} ({cert.julgadoPor})
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                    <Paperclip className="w-3 h-3" />
                    Arquivo: {cert.nomeArquivoSimulado}
                  </div>
                </div>
              ))}

              {certificates.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  Nenhum atestado submetido por este estudante.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Prontuário Escolar Consolidado • Central Digital SENAI</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
          >
            Fechar Ficha 360°
          </button>
        </div>
      </div>
    </div>
  );
}
