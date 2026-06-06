import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind class names with conflict resolution. Framework-agnostic:
// the Vue and React layers both import this so "last class wins" semantics
// are identical everywhere.
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export type { ClassValue }
