"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { StudentProfileModal } from "@/components/alunos/StudentProfileModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-4">
        <Link
          href="/alunos"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para Listagem de Alunos
        </Link>
      </div>

      <StudentProfileModal
        studentId={studentId}
        onClose={() => router.push("/alunos")}
      />
    </main>
  );
}
