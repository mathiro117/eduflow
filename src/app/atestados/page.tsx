"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CertificateStaffView } from "@/components/atestados/CertificateStaffView";
import { CertificateStudentView } from "@/components/atestados/CertificateStudentView";

export default function AtestadosPage() {
  const { currentUser } = useAuth();

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {currentUser.role === "aluno" ? (
        <CertificateStudentView />
      ) : (
        <CertificateStaffView />
      )}
    </main>
  );
}
