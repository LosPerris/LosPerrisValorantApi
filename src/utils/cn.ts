import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilidad para fusionar clases de Tailwind CSS de forma segura,
 * resolviendo conflictos entre clases similares.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
