"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCertificates, CERTIFICATE_TYPE_LABELS } from "@/context/CertificatesContext";
import { CertificateType } from "@/types/certificates";
import {
  FileText,
  Upload,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  Paperclip,
  Send,
  AlertCircle,
  Eye,
  FileSpreadsheet,
} from "lucide-react";

export function CertificateStudentView() {
  const { currentUser } = useAuth();
  const { submitCertificate, getStudentCertificates } = useCertificates();

  const today = new Date().toISOString().split("T")[0];
  const [tipo, setTipo] = useState<CertificateType>("atestado_medico");
  const [cidOuMotivo, setCidOuMotivo] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>(today);
  const [dataFim, setDataFim] = useState<string>(today);
  const [observacaoAluno, setObservacaoAluno] = useState<string>("");
  const [attachedFile, setAttachedFile] = useState<string>("atestado_medico_clinica.pdf");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const studentCertificates = getStudentCertificates(currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cidOuMotivo.trim()) {
      alert("Por favor, preencha o motivo ou CID do afastamento.");
      return;
    }

    setIsSubmitting(true);

    submitCertificate(
      {
        tipo,
        cidOuMotivo,
        dataInicio,
        dataFim,
        observacaoAluno,
        nomeArquivoSimulado: attachedFile,
      },
      currentUser.id,
      currentUser.name,
      currentUser.matricula || "SN-2026-0042",
      currentUser.turma || "DS-2026-01"
    );

    setTimeout(() => {
      setIsSubmitting(false);
      setCidOuMotivo("");
      setObservacaoAluno("");
      setToastMessage("Atestado enviado com sucesso! Aguarde a homologação da equipe.");
      setTimeout(() => setToastMessage(null), 4500);
    }, 400);
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
            <div className="font-bold text-sm">Documento Enviado!</div>
            <div className="text-xs text-slate-300">{toastMessage}</div>
          </div>
        </div>
      )}

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
                <FileCheck className="w-3.5 h-3.5" />
                Portal do Aluno • Justificativas Legais
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
                Envio de Atestados & Justificativas
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {currentUser.name} • Turma: <strong>{currentUser.turma}</strong> • Matrícula:{" "}
                <span className="font-mono">{currentUser.matricula}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Formulário e Histórico */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Formulário de Envio (2 colunas) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-red-600" />
              Submeter Novo Documento
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Envie fotos ou PDFs de atestados médicos emitidos por profissionais habilitados.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de Documento */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tipo de Justificativa
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as CertificateType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
              >
                {Object.entries(CERTIFICATE_TYPE_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Motivo / CID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Motivo / CID ou Especialidade Médica
              </label>
              <input
                type="text"
                placeholder="Ex: J06.9 - Gripe, Odontologia, Consulta de rotina..."
                value={cidOuMotivo}
                onChange={(e) => setCidOuMotivo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>

            {/* Período de Afastamento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Simulação de Anexo com Drag & Drop */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Comprovante / Atestado (Anexo)
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-red-400 bg-slate-50/70 rounded-2xl p-4 text-center transition-colors cursor-pointer group">
                <Paperclip className="w-6 h-6 text-slate-400 group-hover:text-red-600 mx-auto transition-colors" />
                <div className="mt-1 text-xs font-bold text-slate-700">
                  {attachedFile}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  PDF ou Imagem selecionado (1.2 MB)
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700">
                  <Eye className="w-3 h-3" />
                  Visualizar Documento Simulado
                </div>
              </div>
            </div>

            {/* Observações Adicionais */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Observações do Aluno
              </label>
              <textarea
                rows={2}
                placeholder="Detalhes adicionais para o coordenador/ambulatório..."
                value={observacaoAluno}
                onChange={(e) => setObservacaoAluno(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Enviando..." : "Submeter Atestado"}
            </button>
          </form>
        </div>

        {/* Histórico Pessoal de Atestados (3 colunas) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Histórico de Submissões</h2>
              <p className="text-xs text-slate-500">
                Acompanhe o deferimento e abono de faltas pela equipe pedagógica.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {studentCertificates.length} documento(s)
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {studentCertificates.map((cert) => {
              const isPendente = cert.status === "pendente";
              const isAprovado = cert.status === "aprovado";
              const isRecusado = cert.status === "recusado";

              return (
                <div
                  key={cert.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isAprovado
                      ? "bg-emerald-50/30 border-emerald-200"
                      : isRecusado
                      ? "bg-red-50/30 border-red-200"
                      : "bg-amber-50/30 border-amber-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                          {cert.tipoLabel}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {cert.diasAfastamento} dia(s) ({cert.dataInicio} até {cert.dataFim})
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm">
                        {cert.cidOuMotivo}
                      </h3>

                      {cert.observacaoAluno && (
                        <p className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                          "{cert.observacaoAluno}"
                        </p>
                      )}

                      {/* Parecer da Equipe quando houver */}
                      {isAprovado && cert.parecerEquipe && (
                        <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <strong>Parecer da Coordenação:</strong> {cert.parecerEquipe}
                            <div className="text-[10px] text-emerald-700 mt-0.5">
                              Homologado por {cert.julgadoPor}
                            </div>
                          </div>
                        </div>
                      )}

                      {isRecusado && cert.motivoRecusa && (
                        <div className="p-2.5 rounded-xl bg-red-100/70 border border-red-200 text-xs text-red-900 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                          <div>
                            <strong>Motivo do Indeferimento:</strong> {cert.motivoRecusa}
                            <div className="text-[10px] text-red-700 mt-0.5">
                              Analisado por {cert.julgadoPor}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3 text-slate-400" />
                          {cert.nomeArquivoSimulado} ({cert.tamanhoArquivo})
                        </span>
                        <span>•</span>
                        <span>
                          Enviado em{" "}
                          {new Date(cert.dataEnvio).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Badge de Status */}
                    <div className="shrink-0 self-start sm:self-center">
                      {isPendente && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Em Análise
                        </span>
                      )}
                      {isAprovado && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Aprovado / Abonado
                        </span>
                      )}
                      {isRecusado && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 text-red-800 border border-red-300 shadow-2xs">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          Indeferido
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {studentCertificates.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                Você ainda não enviou nenhum atestado ou justificativa.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
