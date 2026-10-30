import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combina clases condicionales y resuelve conflictos de Tailwind (convención shadcn).
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
