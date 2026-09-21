import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário para mesclar classes Tailwind CSS de forma segura e condicional
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
