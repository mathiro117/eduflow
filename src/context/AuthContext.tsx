"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole, DEMO_PROFILES } from "@/types/auth";

interface AuthContextType {
  currentUser: UserProfile;
  switchProfile: (role: UserRole) => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  availableProfiles: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "facilita_senai_demo_role";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("professor");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Recupera perfil salvo no localStorage se existir
    const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    if (saved && DEMO_PROFILES[saved]) {
      setCurrentRole(saved);
    }
    setIsLoaded(true);
  }, []);

  const switchProfile = (role: UserRole) => {
    if (DEMO_PROFILES[role]) {
      setCurrentRole(role);
      localStorage.setItem(STORAGE_KEY, role);
    }
  };

  const currentUser = DEMO_PROFILES[currentRole];

  const hasRole = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(currentUser.role);
  };

  const availableProfiles = Object.values(DEMO_PROFILES);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchProfile,
        hasRole,
        availableProfiles,
      }}
    >
      {/* Evita flash de hidratação garantindo layout consistente */}
      <div className={isLoaded ? "opacity-100 transition-opacity duration-200" : "opacity-95"}>
        {children}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}
