"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useOccurrences, CATEGORY_LABELS } from "@/context/OccurrencesContext";
import { MOCK_STUDENTS } from "@/context/AttendanceContext";
import {
  OccurrenceCategory,
  OccurrenceSeverity,
} from "@/types/occurrences";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Shirt,
  HardHat,
  Clock,
  Smartphone,
  HelpCircle,
  Send,
  X,
  User,
} from "lucide-react";

interface OccurrenceRegisterFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORY_OPTIONS: { id: OccurrenceCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "uniforme", label: "Uniforme / Vestimenta Inadequada", icon: Shirt },
  { id: "calcado_epi", label: "Calçado / EPI Inadequado", icon: HardHat },
  { id: "atraso_reiterado", label: "Atraso Reiterado / Saída Não Autorizada", icon: Clock },
  { id: "celular_equipamento", label: "Uso Indevido de Celular / Equipamento", icon: Smartphone },
  { id: "outros", label: "Outros Desvios Disciplinares", icon: HelpCircle },
];

const SEVERITY_OPTIONS: { id: OccurrenceSeverity; label: string; desc: string; color: string; border: string; bg: string }[] = [
  {
    id: "leve",
    label: "Leve",
    desc: "1º aviso ou esquecimento pontual",
    color: "text-amber-700",
    border: "border-amber-300",
    bg: "bg-amber-50",
  },
  {
    id: "media",
    label: "Média",
    desc: "Desvio reincidente ou norma de laboratório",
    color: "text-orange-700",
    border: "border-orange-300",
    bg: "bg-orange-50",
  },
  {
    id: "alta",
    label: "Alta",
    desc: "Risco de segurança física ou desacato",
    color: "text-red-700",
    border: "border-red-300",
    bg: "bg-red-50",
  },
];

const ACTION_OPTIONS = [
  "Orientação verbal em sala",
  "Notificação aos responsáveis",
  "Encaminhamento à Coordenação/Vida Escolar",
  "Troca imediata de calçado/EPI na portaria",
  "Termo de compromisso assinado",
];

export function OccurrenceRegisterForm({ onClose, onSuccess }: OccurrenceRegisterFormProps) {
  const { currentUser } = useAuth();
  const { createOccurrence, getStudentOccurrenceCount } = useOccurrences();

  const [selectedStudentId, setSelectedStudentId] = useState<string>("demo-aluno-1");
  const [categoria, setCategoria] = useState<OccurrenceCategory>("uniforme");
  const [categoriaCustomizada, setCategoriaCustomizada] = useState<string>("");
  const [severidade, setSeveridade] = useState<OccurrenceSeverity>("leve");
  const [medidaAdotada, setMedidaAdotada] = useState<string>(ACTION_OPTIONS[0]);
  const [observacao, setObservacao] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Cálculo inteligente de reincidência para o aluno atualmente selecionado
  const previousCount = getStudentOccurrenceCount(selectedStudentId);
  const selectedStudent = MOCK_STUDENTS.find((s) => s.id === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observacao.trim()) {
      alert("Por favor, preencha o campo de observações detalhadas.");
      return;
    }

    setIsSubmitting(true);

    createOccurrence(
      {
        alunoId: selectedStudentId,
        categoria,
        severidade,
        medidaAdotada,
        observacao,
        categoriaCustomizada,
      },
      currentUser.name,
      currentUser.roleLabel
    );

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Cabeçalho do Modal */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Registrar Ocorrência Disciplinar</h2>
              <p className="text-xs text-red-100">
                Lançamento formal de desvio de conduta, uniforme ou normas de segurança do SENAI.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleção do Estudante */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Selecione o Aluno
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
            >
              {MOCK_STUDENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} ({s.turmaId} • {s.matricula})
                </option>
              ))}
            </select>

            {/* BADGE INTELIGENTE DE CÁLCULO DE REINCIDÊNCIA */}
            <div className="mt-3">
              {previousCount === 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Histórico Limpo:</strong> Este estudante não possui nenhuma ocorrência anterior registrada.
                  </span>
                </div>
              )}

              {previousCount === 1 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Atenção:</strong> O estudante já possui <strong>1 registro anterior</strong> no prontuário escolar.
                  </span>
                </div>
              )}

              {previousCount >= 2 && (
                <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-500 flex items-center gap-3 text-xs text-red-900 font-semibold animate-pulse">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <div className="uppercase tracking-wide font-extrabold text-red-700">
                      🚨 Alerta de Reincidência Crítica ({previousCount} registros anteriores)
                    </div>
                    <div className="text-[11px] text-red-800 font-normal">
                      Recomenda-se notificação imediata à Coordenação Pedagógica / Vida Escolar e contato com responsáveis.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Categoria do Desvio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Categoria do Desvio
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const Icon = cat.icon;
                const isSelected = categoria === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoria(cat.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-red-50/70 border-red-500 text-red-900 shadow-2xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-red-600" : "text-slate-500"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {categoria === "outros" && (
              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="Especifique a ocorrência..."
                  value={categoriaCustomizada}
                  onChange={(e) => setCategoriaCustomizada(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Grau de Severidade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Grau de Severidade
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SEVERITY_OPTIONS.map((sev) => {
                const isSelected = severidade === sev.id;
                return (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setSeveridade(sev.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? `${sev.bg} ${sev.border} border-2 ${sev.color} shadow-xs font-bold`
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wide font-extrabold">{sev.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{sev.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Medida Adotada / Encaminhamento */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Medida Adotada / Encaminhamento Imediato
            </label>
            <select
              value={medidaAdotada}
              onChange={(e) => setMedidaAdotada(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
            >
              {ACTION_OPTIONS.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* Observação Detalhada */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Descrição Detalhada do Fato
            </label>
            <textarea
              rows={3}
              placeholder="Descreva com clareza o ocorrido, local (ex: Portaria principal, Laboratório 4) e manifestação do aluno..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
              required
            />
          </div>

          {/* Rodapé com Botões */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Registrando..." : "Registrar Ocorrência"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
