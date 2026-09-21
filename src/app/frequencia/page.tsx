"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AttendanceTeacherView } from "@/components/frequencia/AttendanceTeacherView";
import { AttendanceStudentView } from "@/components/frequencia/AttendanceStudentView";

export default function FrequenciaPage() {
  const { currentUser } = useAuth();

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {currentUser.role === "aluno" ? (
        <AttendanceStudentView />
      ) : (
        <AttendanceTeacherView />
      )}
    </main>
  );
}
