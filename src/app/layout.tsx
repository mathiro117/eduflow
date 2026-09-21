import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AttendanceProvider } from "@/context/AttendanceContext";
import { OccurrencesProvider } from "@/context/OccurrencesContext";
import { CertificatesProvider } from "@/context/CertificatesContext";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Facilita SENAI - Central Escolar Digital",
  description: "Plataforma integrada de rotinas escolares e acadêmicas do SENAI Vila Leopoldina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white">
        <AuthProvider>
          <AttendanceProvider>
            <OccurrencesProvider>
              <CertificatesProvider>
                <Navbar />
                <div className="flex-1 flex flex-col">{children}</div>
              </CertificatesProvider>
            </OccurrencesProvider>
          </AttendanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
