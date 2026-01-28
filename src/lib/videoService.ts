/**
 * Video Service - معالجة جميع عمليات الفيديو
 */

/**
 * Video types (should be imported from @shared/schema)
 */
export interface VideoRequest {
  id: number;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string | null;
  videoUrl?: string | null;
}

export interface InsertVideoRequest {
  surah: number;
  startAyah: number;
  endAyah: number;
  reciter: string;
}

/**
 * Configuration for video processing
 */
export const VIDEO_SERVICE_CONFIG = {
  MAX_AYAH_RANGE: 20, // Maximum number of ayahs per video
  MIN_AYAH_RANGE: 1, // Minimum number of ayahs per video
  REQUEST_TIMEOUT: 60000, // 60 seconds timeout
  POLLING_INTERVAL: 2000, // 2 seconds polling interval
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

/**
 * Validate video request data
 */
export function validateVideoRequest(data: InsertVideoRequest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check surah range
  if (data.surah < 1 || data.surah > 114) {
    errors.push("رقم السورة يجب أن يكون بين 1 و 114");
  }

  // Check ayah numbers
  if (data.startAyah < 1) {
    errors.push("رقم آية البداية يجب أن يكون أكبر من صفر");
  }

  if (data.endAyah < 1) {
    errors.push("رقم آية النهاية يجب أن يكون أكبر من صفر");
  }

  // Check ayah range
  if (data.endAyah < data.startAyah) {
    errors.push("آية النهاية يجب أن تكون أكبر من أو تساوي آية البداية");
  }

  // Check maximum range
  const ayahRange = data.endAyah - data.startAyah + 1;
  if (ayahRange > VIDEO_SERVICE_CONFIG.MAX_AYAH_RANGE) {
    errors.push(
      `عدد الآيات يجب أن لا يزيد عن ${VIDEO_SERVICE_CONFIG.MAX_AYAH_RANGE}`,
    );
  }

  if (ayahRange < VIDEO_SERVICE_CONFIG.MIN_AYAH_RANGE) {
    errors.push(
      `عدد الآيات يجب أن لا يقل عن ${VIDEO_SERVICE_CONFIG.MIN_AYAH_RANGE}`,
    );
  }

  // Check reciter
  if (!data.reciter || data.reciter.trim() === "") {
    errors.push("يرجى اختيار قارئ");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if video request is ready
 */
export function isVideoRequestReady(
  requestStatus: VideoRequest | undefined,
): boolean {
  if (!requestStatus) return false;
  return requestStatus.status === "completed";
}

/**
 * Check if video request failed
 */
export function isVideoRequestFailed(
  requestStatus: VideoRequest | undefined,
): boolean {
  if (!requestStatus) return false;
  return requestStatus.status === "failed";
}

/**
 * Check if video request is processing
 */
export function isVideoRequestProcessing(
  requestStatus: VideoRequest | undefined,
): boolean {
  if (!requestStatus) return false;
  return (
    requestStatus.status === "pending" ||
    requestStatus.status === "processing"
  );
}

/**
 * Format video duration
 */
export function formatVideoDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} ثانية`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} دقيقة`;
  }
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

/**
 * Get video processing error message
 */
export function getVideoErrorMessage(error: string | null | undefined): string {
  if (!error) {
    return "حدث خطأ غير معروف أثناء معالجة الفيديو";
  }

  // Map common errors to user-friendly messages
  const errorMap: Record<string, string> = {
    "404": "الآيات المطلوبة غير موجودة",
    "400": "بيانات الطلب غير صحيحة",
    "413": "حجم الطلب أكبر من المسموح",
    "429": "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً",
    "500": "خطأ في الخادم، يرجى المحاولة لاحقاً",
    "503": "الخدمة غير متاحة حالياً",
    "timeout": "انتهت مهلة انتظار الطلب",
    "network": "خطأ في الاتصال، يرجى التحقق من اتصالك بالإنترنت",
  };

  for (const [key, message] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return message;
    }
  }

  return error;
}

/**
 * Estimate video processing time based on ayah count
 */
export function estimateVideoProcessingTime(ayahCount: number): number {
  // Rough estimation: ~5 seconds per ayah + 10 seconds base time
  return Math.max(15, ayahCount * 5 + 10);
}

/**
 * Get progress percentage based on status
 */
export function getVideoProgressPercentage(
  status: VideoRequest["status"] | undefined,
): number {
  const progressMap: Record<VideoRequest["status"], number> = {
    pending: 20,
    processing: 60,
    completed: 100,
    failed: 0,
  };

  return progressMap[status || "pending"] || 0;
}

/**
 * Validate video URL
 */
export function isValidVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    return /\.(mp4|webm|ogg|mov|mkv)$/i.test(pathname);
  } catch {
    return false;
  }
}

/**
 * Get video file extension
 */
export function getVideoFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split(".").pop()?.toLowerCase() || "mp4";
    return extension;
  } catch {
    return "mp4";
  }
}

/**
 * Format video metadata for display
 */
export function formatVideoMetadata(videoUrl: string): {
  format: string;
  size: string;
} {
  const format = getVideoFileExtension(videoUrl).toUpperCase();
  // Size would typically come from the API response
  // This is a placeholder
  return {
    format,
    size: "Unknown",
  };
}

/**
 * Retry function for failed requests
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = VIDEO_SERVICE_CONFIG.MAX_RETRIES,
  delay: number = VIDEO_SERVICE_CONFIG.RETRY_DELAY,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, lastError);

      // Don't retry on client errors (4xx)
      if (lastError.message?.includes("400") || lastError.message?.includes("404")) {
        throw lastError;
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, attempt)),
        );
      }
    }
  }

  throw lastError || new Error("Request failed after multiple attempts");
}
