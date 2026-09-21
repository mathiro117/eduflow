"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCertificates } from "@/context/CertificatesContext";
import { MedicalCertificate } from "@/types/certificates";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  User,
  Calendar,
  Paperclip,
  Check,
  X,
  AlertCircle,
  Filter,
} from "lucide-react";

export function CertificateStaffView() {
  const { currentUser } = useAuth();
  const {
    certificates,
    approveCertificate,
    rejectCertificate,
    getDashboardCertificateStats,
  } = useCertificates();

  const [activeTab, setActiveTab] = useState<"pendente" | "aprovado" | "recusado">("pendente");
  const [selectedCertForAction, setSelectedCertForAction] = useState<MedicalCertificate | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewCert, setPreviewCert] = useState<MedicalCertificate | null>(null);

  const stats = getDashboardCertificateStats();

  const filtered = certificates.filter((c) => c.status === activeTab);

  const handleOpenAction = (cert: MedicalCertificate, type: "approve" | "reject") => {
    setSelectedCertForAction(cert);
    setActionType(type);
    setFeedbackText(
      type === "approve"
        ? "Documento médico homologado pela equipe pedagógica. Faltas abonadas no diário."
        : "Documento com informações ilegíveis ou sem identificação do profissional de saúde."
    );
  };

  const handleConfirmAction = () => {
    if (!selectedCertForAction || !actionType) return;

    if (actionType === "approve") {
      approveCertificate(selectedCertForAction.id, feedbackText, currentUser.name);
      setToastMessage(
        `Atestado de ${selectedCertForAction.alunoNome} deferido com sucesso! Faltas abonadas.`
      );
    } else {
      if (!feedbackText.trim()) {
        alert("Por favor, informe a justificativa da recusa para orientar o estudante.");
        return;
      }
      rejectCertificate(selectedCertForAction.id, feedbackText, currentUser.name);
      setToastMessage(`Atestado de ${selectedCertForAction.alunoNome} indeferido.`);
    }

    setSelectedCertForAction(null);
    setActionType(null);
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Flutuante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="font-bold text-sm">Operação Concluída!</div>
            <div className="text-xs text-slate-300">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Topo do Módulo */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <FileCheck className="w-3.5 h-3.5" />
              Bancada de Triagem e Homologação de Faltas
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              Triagem de Atestados Médicos & Justificativas
            </h1>
            <p className="text-sm text-slate-500">
              Operador conectado: <strong>{currentUser.name}</strong> ({currentUser.roleLabel})
            </p>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Recebidos</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalCertificados}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-700 uppercase">Pendentes de Análise</span>
            <p className="text-2xl font-extrabold text-amber-700 mt-0.5">{stats.pendentes}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Aprovados / Deferidos</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">{stats.aprovados}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
            <span className="text-[11px] font-bold text-red-700 uppercase">Indeferidos</span>
            <p className="text-2xl font-extrabold text-red-700 mt-0.5">{stats.recusados}</p>
          </div>
        </div>
      </div>

      {/* Abas de Navegação */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("pendente")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "pendente"
              ? "bg-amber-500 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Clock className="w-4 h-4" />
          Pendentes de Análise
          {stats.pendentes > 0 && (
            <span className="px-2 py-0.2 rounded-full text-xs bg-white text-amber-800 font-extrabold">
              {stats.pendentes}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("aprovado")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "aprovado"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Aprovados (Deferidos)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("recusado")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "recusado"
              ? "bg-red-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <XCircle className="w-4 h-4" />
          Indeferidos
        </button>
      </div>

      {/* Lista de Atestados da Aba Ativa */}
      <div className="space-y-4">
        {filtered.map((cert) => {
          return (
            <div
              key={cert.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Lado Esquerdo: Identificação e Dados Médicos */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-base">
                      {cert.alunoNome}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ({cert.turma} • {cert.matricula})
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                      {cert.tipoLabel}
                    </span>
                  </div>

                  {/* CID e Período */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-slate-800 font-bold">
                      <FileText className="w-4 h-4 text-red-600" />
                      <span>{cert.cidOuMotivo}</span>
                    </div>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {cert.dataInicio} até {cert.dataFim} (<strong>{cert.diasAfastamento} dia(s)</strong>)
                      </span>
                    </div>
                  </div>

                  {cert.observacaoAluno && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                      "{cert.observacaoAluno}"
                    </p>
                  )}

                  {/* Parecer prévio se houver */}
                  {cert.parecerEquipe && (
                    <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <strong>Parecer:</strong> {cert.parecerEquipe} (por {cert.julgadoPor})
                    </div>
                  )}

                  {cert.motivoRecusa && (
                    <div className="text-xs text-red-800 bg-red-50 p-2.5 rounded-xl border border-red-200">
                      <strong>Motivo do Indeferimento:</strong> {cert.motivoRecusa} (por {cert.julgadoPor})
                    </div>
                  )}

                  {/* Anexo Simulado */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setPreviewCert(cert)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Visualizar Anexo ({cert.nomeArquivoSimulado})
                    </button>
                    <span className="text-[11px] text-slate-400">
                      Enviado em {new Date(cert.dataEnvio).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                {/* Lado Direito: Ações de Triagem */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0">
                  {cert.status === "pendente" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenAction(cert, "approve")}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Aprovar / Deferir
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAction(cert, "reject")}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-red-300 hover:bg-red-50 text-red-700 text-xs font-bold active:scale-95 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        Recusar / Indeferir
                      </button>
                    </>
                  )}

                  {cert.status === "aprovado" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Deferido & Faltas Abonadas
                    </span>
                  )}

                  {cert.status === "recusado" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      Indeferido
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
            Nenhum atestado nesta fila no momento.
          </div>
        )}
      </div>

      {/* Modal de Ação (Aprovação ou Recusa) */}
      {selectedCertForAction && actionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    actionType === "approve"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {actionType === "approve" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {actionType === "approve"
                      ? "Deferir e Abonar Atestado"
                      : "Indeferir Justificativa"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aluno: <strong>{selectedCertForAction.alunoNome}</strong> ({selectedCertForAction.turma})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCertForAction(null);
                  setActionType(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionType === "approve" && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <strong>Ação em Cascata no Sistema:</strong> Ao deferir este atestado, as faltas do aluno nas datas compreendidas ({selectedCertForAction.dataInicio} a {selectedCertForAction.dataFim}) serão automaticamente convertidas para <strong>Falta Justificada</strong> no diário de frequência.
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {actionType === "approve" ? "Parecer da Equipe (Opcional)" : "Motivo do Indeferimento (Obrigatório)"}
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={
                  actionType === "approve"
                    ? "Observação do ambulatório ou secretaria..."
                    : "Informe o motivo claro (ex: documento ilegível, sem CRM, prazo de envio expirado)..."
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCertForAction(null);
                  setActionType(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all cursor-pointer ${
                  actionType === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                    : "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                }`}
              >
                {actionType === "approve" ? "Confirmar Deferimento" : "Confirmar Indeferimento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Prévia do Anexo Simulado */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Prévia do Documento Anexado
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulação Visual do Documento */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3 font-serif">
              <div className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400">
                Atestado Médico Digital • Demonstração
              </div>
              <div className="text-sm font-bold text-slate-800">
                Atesto para os devidos fins legais que o paciente
              </div>
              <div className="text-base font-extrabold text-red-600 underline">
                {previewCert.alunoNome}
              </div>
              <div className="text-xs text-slate-600">
                Matrícula: {previewCert.matricula} • Turma: {previewCert.turma}
              </div>
              <p className="text-xs text-slate-700 italic max-w-sm mx-auto">
                "Esteve sob meus cuidados médicos no período de {previewCert.dataInicio} a {previewCert.dataFim} ({previewCert.diasAfastamento} dia(s)), necessitando de repouso domiciliar. CID/Diagnóstico: {previewCert.cidOuMotivo}."
              </p>
              <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-sans">
                Dr. Roberto Albuquerque • CRM/SP 148.922
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
