import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format error messages in Arabic
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return "حدث خطأ غير متوقع";
}

/**
 * Validate video URL
 */
export function isValidVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return /\.(mp4|webm|ogg)$/i.test(urlObj.pathname);
  } catch {
    return false;
  }
}

/**
 * Get surah info by ID
 */
export function getSurahInfo(surahId: number): { name: string; ayahs: number } | null {
  const surahData: Record<number, { name: string; ayahs: number }> = {
    1: { name: "الفاتحة", ayahs: 7 },
    2: { name: "البقرة", ayahs: 286 },
    3: { name: "آل عمران", ayahs: 200 },
    // Add more as needed
  };
  return surahData[surahId] || null;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, wait);
  };
}
