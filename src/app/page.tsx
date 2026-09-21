"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useAttendance } from "@/context/AttendanceContext";
import { useOccurrences } from "@/context/OccurrencesContext";
import { useCertificates } from "@/context/CertificatesContext";
import {
  Users,
  Clock,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ClipboardList,
  ShieldCheck,
  Calendar,
  School,
  CheckCircle,
  Shirt,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { currentUser } = useAuth();
  const { getDashboardAttendanceStats, getStudentHistory } = useAttendance();
  const { getDashboardOccurrenceStats, getStudentOccurrenceCount } = useOccurrences();
  const { getDashboardCertificateStats, getStudentCertificates } = useCertificates();

  const attendanceStats = getDashboardAttendanceStats();
  const occurrenceStats = getDashboardOccurrenceStats();
  const certificateStats = getDashboardCertificateStats();

  const studentHistory = getStudentHistory(currentUser.id);
  const studentOccurrencesCount = getStudentOccurrenceCount(currentUser.id);
  const studentCertificates = getStudentCertificates(currentUser.id);

  const studentPresencas = studentHistory.filter((r) => r.status === "presente").length;
  const studentAtrasos = studentHistory.filter((r) => r.status === "atraso").length;
  const studentJustificados = studentHistory.filter((r) => r.status === "justificado").length;
  const studentFaltas = studentHistory.filter((r) => r.status === "falta").length;
  const studentTotal = studentHistory.length;
  const studentRate =
    studentTotal > 0
      ? Math.round(((studentPresencas + studentAtrasos + studentJustificados) / studentTotal) * 100)
      : 100;

  const metrics = [
    {
      title: "Alunos Ativos",
      value: "342",
      change: "+12 este mês",
      trend: "up",
      icon: Users,
      color: "blue",
      bgLight: "bg-blue-50",
      textDark: "text-blue-700",
      border: "border-blue-100",
    },
    {
      title: "Atrasos Registrados Hoje",
      value: String(attendanceStats.totalAtrasosHoje).padStart(2, "0"),
      change: "Sincronizado com Chamada",
      trend: "neutral",
      icon: Clock,
      color: "amber",
      bgLight: "bg-amber-50",
      textDark: "text-amber-700",
      border: "border-amber-100",
    },
    {
      title: "Ocorrências de Uniforme / Conduta",
      value: String(occurrenceStats.totalOcorrencias).padStart(2, "0"),
      change: `${occurrenceStats.pendentes} pendente(s) de ação`,
      trend: "neutral",
      icon: AlertTriangle,
      color: "red",
      bgLight: "bg-red-50",
      textDark: "text-red-700",
      border: "border-red-100",
    },
    {
      title: "Atestados em Análise",
      value: String(certificateStats.pendentes).padStart(2, "0"),
      change: `${certificateStats.aprovados} homologado(s)`,
      trend: "up",
      icon: FileCheck,
      color: "emerald",
      bgLight: "bg-emerald-50",
      textDark: "text-emerald-700",
      border: "border-emerald-100",
    },
  ];

  return (
    <main className="flex-1 bg-slate-50/60 pb-16">
      {/* Faixa Superior de Boas-Vindas */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 border border-red-100 text-red-700">
                <School className="w-3.5 h-3.5" />
                SENAI Vila Leopoldina • Central Escolar Digital
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Olá, {currentUser.name}! 👋
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                {currentUser.role === "aluno" && (
                  <span>
                    Painel do Aluno • Turma: <strong>{currentUser.turma}</strong> • Matrícula:{" "}
                    <strong>{currentUser.matricula}</strong>
                  </span>
                )}
                {currentUser.role === "professor" && (
                  <span>
                    Painel do Docente • Departamento de <strong>{currentUser.departamento}</strong>
                  </span>
                )}
                {currentUser.role === "colaborador" && (
                  <span>
                    Painel de Apoio Operacional • Atuação: <strong>{currentUser.departamento}</strong>
                  </span>
                )}
                {currentUser.role === "admin" && (
                  <span>
                    Painel de Gestão e Coordenação Pedagógica Integrada
                  </span>
                )}
              </p>
            </div>

            {/* Cartão de Identificação Rápida */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 shrink-0">
              <div
                className={`w-12 h-12 rounded-xl ${currentUser.avatarColor} text-white font-bold text-lg flex items-center justify-center shadow-xs`}
              >
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Perfil Conectado
                </div>
                <div className="text-sm font-bold text-slate-800">{currentUser.roleLabel}</div>
                <div className="text-xs text-slate-500">{currentUser.email}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Banner Didático do MVP */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/10 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">
                Módulos Integrados em Cascata (Ciclo 5: Atestados & Abono Automático)
              </h2>
              <p className="text-xs sm:text-sm text-red-100">
                Ao deferir atestados médicos na bancada de triagem, as faltas do aluno são automaticamente abonadas no diário de frequência!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/atestados"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-red-700 px-3.5 py-2 rounded-xl shadow-xs hover:bg-red-50 transition-colors"
            >
              Triagem de Atestados
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Grade de Métricas do Dashboard */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              Indicadores da Unidade Escolar
            </h2>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Hoje
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">{m.title}</span>
                    <div className={`p-2 rounded-xl ${m.bgLight} ${m.border} border`}>
                      <Icon className={`w-5 h-5 ${m.textDark}`} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                      {m.value}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <span>{m.change}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Painel Contextual com base no perfil ativo */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Principal de Resumo */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Resumo de Atividades • {currentUser.roleLabel}
                </h3>
                <p className="text-xs text-slate-500">
                  Ações e informações priorizadas para a sua rotina diária no SENAI.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Sincronizado
              </span>
            </div>

            {/* Conteúdo Dinâmico por Perfil */}
            {currentUser.role === "aluno" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-emerald-900">
                      Situação Acadêmica: {studentRate}% de Assiduidade
                    </h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Você possui <strong>{studentPresencas}</strong> presença(s),{" "}
                      <strong>{studentJustificados}</strong> falta(s) abonada(s) por atestado e{" "}
                      <strong>{studentCertificates.length}</strong> atestado(s) submetido(s).
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Presenças</span>
                    <p className="text-xl font-bold text-emerald-700 mt-1">{studentPresencas} aulas</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Abonadas</span>
                    <p className="text-xl font-bold text-blue-700 mt-1">{studentJustificados} atestados</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Atrasos</span>
                    <p className="text-xl font-bold text-amber-700 mt-1">{studentAtrasos} registros</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Ocorrências</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">{studentOccurrencesCount} item(ns)</p>
                  </div>
                </div>
              </div>
            )}

            {currentUser.role === "professor" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                  <ClipboardList className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-blue-900">Diário Docente Integrado</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Faltas justificadas por atestado médico homologado pela secretaria são sincronizadas automaticamente com o seu diário.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Turma Ativa</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">DS-2026-01</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Atestados em Homologação</span>
                    <p className="text-xl font-bold text-emerald-600 mt-1">
                      {certificateStats.pendentes} aguardando
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentUser.role === "colaborador" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-900">Secretaria & Apoio</h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Triagem ágil de atestados com prévia do documento anexado e deferimento em 1 clique.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Atestados Pendentes</span>
                    <p className="text-xl font-bold text-red-600 mt-1">
                      {certificateStats.pendentes} para julgar
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Documentos Homologados</span>
                    <p className="text-xl font-bold text-emerald-700 mt-1">
                      {certificateStats.aprovados} deferidos
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentUser.role === "admin" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-purple-900">Coordenação Geral</h4>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      Visão integrada de assiduidade com abonos legais e conformidade regulatória do MEC/SENAI.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Taxa de Deferimento</span>
                    <p className="text-xl font-bold text-emerald-600 mt-1">
                      {certificateStats.totalCertificados > 0
                        ? `${Math.round((certificateStats.aprovados / certificateStats.totalCertificados) * 100)}%`
                        : "100%"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Atestados Pendentes</span>
                    <p className="text-xl font-bold text-amber-600 mt-1">
                      {certificateStats.pendentes} aguardando
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Atalhos Rápidos com base na permissão */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Atalhos do Módulo</h3>
            <p className="text-xs text-slate-500">
              Rotinas disponíveis para <strong>{currentUser.name}</strong>:
            </p>

            <div className="space-y-2 pt-1">
              <Link
                href="/frequencia"
                className="p-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition-all flex items-center justify-between text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-red-600" />
                  {currentUser.role === "aluno" ? "Consultar Minha Frequência" : "Lançar Chamada da Turma"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/ocorrencias"
                className="p-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition-all flex items-center justify-between text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  {currentUser.role === "aluno"
                    ? "Minhas Ocorrências"
                    : "Notificar Ocorrência / Uniforme"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/atestados"
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-center justify-between text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  {currentUser.role === "aluno"
                    ? "Enviar Atestado Médico"
                    : "Triagem de Atestados"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 leading-tight block">
                Ecossistema 100% integrado com persistência reativa local.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
