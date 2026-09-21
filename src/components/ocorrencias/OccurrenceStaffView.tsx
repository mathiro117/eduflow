"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useOccurrences } from "@/context/OccurrencesContext";
import { OccurrenceRegisterForm } from "./OccurrenceRegisterForm";
import { Occurrence, OccurrenceSeverity } from "@/types/occurrences";
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Shirt,
  HardHat,
  Smartphone,
  HelpCircle,
  UserCheck,
  Calendar,
} from "lucide-react";

export function OccurrenceStaffView() {
  const { currentUser } = useAuth();
  const { occurrences, getStudentOccurrenceCount, getDashboardOccurrenceStats } = useOccurrences();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("todas");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const stats = getDashboardOccurrenceStats();

  const handleSuccess = () => {
    setIsModalOpen(false);
    setToastMessage("Ocorrência registrada com sucesso no prontuário do aluno!");
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Filtragem dos registros
  const filtered = occurrences.filter((occ) => {
    const matchesSearch =
      occ.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.observacao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      selectedSeverity === "todas" ? true : occ.severidade === selectedSeverity;

    return matchesSearch && matchesSeverity;
  });

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
      {/* Toast Flutuante de Sucesso */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="font-bold text-sm">Registro Salvo!</div>
            <div className="text-xs text-slate-300">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Topo do Módulo */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
              <AlertTriangle className="w-3.5 h-3.5" />
              Gestão Disciplinar & Uniformes / EPIs
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              Registro e Controle de Ocorrências
            </h1>
            <p className="text-sm text-slate-500">
              Operador conectado: <strong>{currentUser.name}</strong> ({currentUser.roleLabel})
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Ocorrência
          </button>
        </div>

        {/* Cards de Métricas do Módulo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Registrado</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalOcorrencias}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
            <span className="text-[11px] font-bold text-red-700 uppercase">Pendentes</span>
            <p className="text-2xl font-extrabold text-red-700 mt-0.5">{stats.pendentes}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-700 uppercase">Em Análise</span>
            <p className="text-2xl font-extrabold text-amber-700 mt-0.5">{stats.emAnalise}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Regularizadas</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">{stats.regularizadas}</p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por aluno, matrícula ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        {/* Filtros de Severidade */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Severidade:
          </span>
          {[
            { id: "todas", label: "Todas" },
            { id: "leve", label: "Leve" },
            { id: "media", label: "Média" },
            { id: "alta", label: "Alta" },
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setSelectedSeverity(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedSeverity === filter.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Ocorrências em Timeline / Cards */}
      <div className="space-y-3.5">
        {filtered.map((occ) => {
          const CategoryIcon = getCategoryIcon(occ.categoria);
          const totalAlunoCount = getStudentOccurrenceCount(occ.alunoId);

          return (
            <div
              key={occ.id}
              className={`p-5 rounded-2xl bg-white border transition-all duration-150 ${
                occ.severidade === "alta"
                  ? "border-red-200 shadow-xs"
                  : occ.severidade === "media"
                  ? "border-orange-200 shadow-xs"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Lado Esquerdo: Aluno e Detalhes da Ocorrência */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-base">
                      {occ.alunoNome}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ({occ.turma} • {occ.matricula})
                    </span>

                    {/* Tag de Reincidência na Listagem */}
                    {totalAlunoCount >= 2 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300">
                        <ShieldAlert className="w-3 h-3 text-red-600" />
                        Reincidente ({totalAlunoCount} registros)
                      </span>
                    ) : totalAlunoCount === 1 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                        1º Registro Anterior
                      </span>
                    ) : null}
                  </div>

                  {/* Categoria e Medida Adotada */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold">
                      <CategoryIcon className="w-3.5 h-3.5 text-slate-600" />
                      {occ.categoriaLabel}
                    </span>

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-50 text-red-800 font-semibold border border-red-100">
                      Medida: {occ.medidaAdotada}
                    </span>
                  </div>

                  {/* Descrição Detalhada */}
                  <p className="text-xs sm:text-sm text-slate-700 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 leading-relaxed">
                    "{occ.observacao}"
                  </p>

                  {/* Rodapé do Card: Quem registrou e data */}
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      Lançado por: <strong>{occ.registradoPor}</strong> ({occ.registradorRole})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(occ.dataHora).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Lado Direito: Severidade e Status */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0">
                  {occ.severidade === "alta" && (
                    <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-red-100 text-red-800 border border-red-300">
                      Severidade Alta
                    </span>
                  )}
                  {occ.severidade === "media" && (
                    <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-orange-100 text-orange-800 border border-orange-300">
                      Severidade Média
                    </span>
                  )}
                  {occ.severidade === "leve" && (
                    <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                      Severidade Leve
                    </span>
                  )}

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      occ.status === "regularizada"
                        ? "bg-emerald-100 text-emerald-800"
                        : occ.status === "em_analise"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {occ.status === "regularizada"
                      ? "Regularizada"
                      : occ.status === "em_analise"
                      ? "Em Análise"
                      : "Pendente"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
            Nenhuma ocorrência encontrada para os filtros aplicados.
          </div>
        )}
      </div>

      {/* Modal de Nova Ocorrência */}
      {isModalOpen && (
        <OccurrenceRegisterForm
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
