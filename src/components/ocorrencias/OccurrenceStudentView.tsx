"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useOccurrences } from "@/context/OccurrencesContext";
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Info,
  Shirt,
  HardHat,
  Clock,
  Smartphone,
  HelpCircle,
} from "lucide-react";

export function OccurrenceStudentView() {
  const { currentUser } = useAuth();
  const { getStudentOccurrences, getStudentOccurrenceCount } = useOccurrences();

  const myOccurrences = getStudentOccurrences(currentUser.id);
  const totalCount = getStudentOccurrenceCount(currentUser.id);

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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                <AlertTriangle className="w-3.5 h-3.5" />
                Transparência Escolar • Vida Estudantil
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
                Minhas Ocorrências e Normas de Convivência
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {currentUser.name} • Turma: <strong>{currentUser.turma}</strong> • Matrícula:{" "}
                <span className="font-mono">{currentUser.matricula}</span>
              </p>
            </div>
          </div>

          {/* Status Disciplinar Resumido */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                totalCount === 0
                  ? "bg-emerald-100 text-emerald-700"
                  : totalCount === 1
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Prontuário Disciplinar
              </div>
              <div
                className={`text-sm font-bold ${
                  totalCount === 0
                    ? "text-emerald-700"
                    : totalCount === 1
                    ? "text-amber-700"
                    : "text-red-700"
                }`}
              >
                {totalCount === 0
                  ? "Histórico Limpo (Sem Desvios)"
                  : `${totalCount} Notificação(ões) Registrada(s)`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orientação Institucional do SENAI */}
      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-blue-900 leading-relaxed">
          <span className="font-bold block text-sm">Diretriz Institucional SENAI</span>
          O uso de camiseta institucional, calçado fechado e respeito aos horários é requisito de segurança obrigatório para acesso aos laboratórios e oficinas. Em caso de dúvidas sobre regularização, procure a Coordenação de Vida Escolar.
        </div>
      </div>

      {/* Lista de Registros do Aluno */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Extrato de Registros Vinculados</h2>
            <p className="text-xs text-slate-500">
              Registros lançados pela equipe pedagógica e inspetoria. Somente visualização.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {myOccurrences.length} ocorrência(s)
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {myOccurrences.map((occ) => {
            const CategoryIcon = getCategoryIcon(occ.categoria);
            return (
              <div
                key={occ.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800">
                      <CategoryIcon className="w-3.5 h-3.5 text-red-600" />
                      {occ.categoriaLabel}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
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

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-md self-start sm:self-auto ${
                      occ.status === "regularizada"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Status: {occ.status === "regularizada" ? "Regularizado" : "Em Acompanhamento"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                  "{occ.observacao}"
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 pt-1">
                  <span>
                    Medida tomada: <strong>{occ.medidaAdotada}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Registrado em:{" "}
                    {new Date(occ.dataHora).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    por {occ.registradoPor}
                  </span>
                </div>
              </div>
            );
          })}

          {myOccurrences.length === 0 && (
            <div className="p-8 text-center bg-emerald-50/50 border border-emerald-100 rounded-2xl text-emerald-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="font-bold text-sm">Parabéns! Nenhuma ocorrência registrada.</div>
              <div className="text-xs text-emerald-600 mt-1">
                Você está em total conformidade com as normas disciplinares e de uniforme do SENAI.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
