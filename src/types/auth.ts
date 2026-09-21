export type UserRole = "professor" | "colaborador" | "aluno" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  avatarColor: string;
  matricula?: string;
  turma?: string;
  departamento?: string;
}

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  professor: {
    id: "demo-prof-1",
    name: "Prof. Carlos Mendes",
    email: "carlos@demo.com",
    role: "professor",
    roleLabel: "Docente / Instrutor",
    avatarColor: "bg-blue-600",
    departamento: "Tecnologia da Informação",
  },
  colaborador: {
    id: "demo-colab-1",
    name: "Mariana Silva",
    email: "mariana@demo.com",
    role: "colaborador",
    roleLabel: "Apoio / Inspetoria",
    avatarColor: "bg-amber-600",
    departamento: "Inspetoria Escolar & Portaria",
  },
  aluno: {
    id: "demo-aluno-1",
    name: "Lucas da Silva",
    email: "aluno@demo.com",
    role: "aluno",
    roleLabel: "Estudante",
    avatarColor: "bg-emerald-600",
    matricula: "SN-2026-0042",
    turma: "DS-2026-01",
  },
  admin: {
    id: "demo-admin-1",
    name: "Coordenação Geral",
    email: "admin@demo.com",
    role: "admin",
    roleLabel: "Administrador / Gestor",
    avatarColor: "bg-purple-600",
    departamento: "Direção Escolar SENAI",
  },
};
