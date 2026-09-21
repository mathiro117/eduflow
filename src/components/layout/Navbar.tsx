"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import {
  LayoutDashboard,
  ClipboardCheck,
  AlertTriangle,
  FileText,
  Users,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  Shield,
  UserCheck,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["professor", "colaborador", "aluno", "admin"],
  },
  {
    label: "Frequência / Chamada",
    href: "/frequencia",
    icon: ClipboardCheck,
    roles: ["professor", "colaborador", "aluno", "admin"],
  },
  {
    label: "Ocorrências & Uniforme",
    href: "/ocorrencias",
    icon: AlertTriangle,
    roles: ["colaborador", "professor", "aluno", "admin"],
  },
  {
    label: "Atestados",
    href: "/atestados",
    icon: FileText,
    roles: ["professor", "colaborador", "aluno", "admin"],
  },
  {
    label: "Alunos",
    href: "/alunos",
    icon: Users,
    roles: ["professor", "colaborador", "admin"],
  },
];

const ROLE_BADGES: Record<UserRole, { label: string; bg: string; text: string; border: string }> = {
  professor: {
    label: "Professor",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  colaborador: {
    label: "Apoio / Inspetoria",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  aluno: {
    label: "Aluno",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  admin: {
    label: "Coordenação",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
};

export function Navbar() {
  const { currentUser, switchProfile, hasRole, availableProfiles } = useAuth();
  const pathname = usePathname();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleNavItems = NAV_ITEMS.filter((item) => hasRole(item.roles));
  const currentBadge = ROLE_BADGES[currentUser.role];

  const getItemLabel = (item: NavItem) => {
    if (item.href === "/frequencia" && currentUser.role === "aluno") {
      return "Minha Frequência";
    }
    if (item.href === "/ocorrencias" && currentUser.role === "aluno") {
      return "Minhas Ocorrências";
    }
    return item.label;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">
                    Facilita
                  </span>
                  <span className="font-extrabold text-lg tracking-tight text-red-600">
                    SENAI
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  Central Escolar Digital
                </span>
              </div>
            </Link>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-slate-100 text-red-600 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-red-600" : "text-slate-400"}`} />
                    {getItemLabel(item)}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Seletor Rápido de Perfil Demo */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
                title="Trocar perfil de demonstração"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${currentUser.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-xs`}
                >
                  {currentUser.name.charAt(0)}
                </div>

                <div className="hidden sm:flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[130px]">
                      {currentUser.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${currentBadge.bg} ${currentBadge.text} ${currentBadge.border}`}
                    >
                      {currentBadge.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {currentUser.role === "aluno"
                      ? `${currentUser.turma} • ${currentUser.matricula}`
                      : currentUser.email}
                  </span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Menu Dropdown de Perfis */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <Sparkles className="w-3.5 h-3.5 text-red-500" />
                      Alternar Perfil Demo (1-Click)
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Troque de usuário para simular as permissões de cada rotina do SENAI.
                    </p>
                  </div>

                  <div className="py-1">
                    {availableProfiles.map((profile) => {
                      const isSelected = profile.role === currentUser.role;
                      const badge = ROLE_BADGES[profile.role];
                      return (
                        <button
                          key={profile.id}
                          type="button"
                          onClick={() => {
                            switchProfile(profile.role);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-red-50/60 font-semibold text-red-950"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-lg ${profile.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                            >
                              {profile.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 leading-tight">
                                {profile.name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {profile.role === "aluno"
                                  ? `${profile.turma}`
                                  : profile.roleLabel}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {badge.label}
                            </span>
                            {isSelected && (
                              <UserCheck className="w-4 h-4 text-red-600 shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-3 pt-2 pb-1 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sessão fictícia salva no navegador</span>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Hambúrguer Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Navegação ({currentBadge.label})
          </div>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-red-50 text-red-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-red-600" : "text-slate-400"}`} />
                {getItemLabel(item)}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
