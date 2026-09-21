"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { OccurrenceStaffView } from "@/components/ocorrencias/OccurrenceStaffView";
import { OccurrenceStudentView } from "@/components/ocorrencias/OccurrenceStudentView";

export default function OcorrenciasPage() {
  const { currentUser } = useAuth();

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {currentUser.role === "aluno" ? (
        <OccurrenceStudentView />
      ) : (
        <OccurrenceStaffView />
      )}
    </main>
  );
}
