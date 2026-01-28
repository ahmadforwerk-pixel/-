/**
 * Application Constants and Configuration
 */

export const APP_NAME = "صانع فيديوهات القرآن";
export const APP_DESCRIPTION = "أنشئ مقاطع فيديو قرآنية جميلة بتلاوات عذبة وتصاميم هادئة";

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 60000, // 60 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Video Processing Configuration
export const VIDEO_CONFIG = {
  DEFAULT_QUALITY: "1080p",
  SUPPORTED_FORMATS: ["mp4", "webm", "ogg"],
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  POLLING_INTERVAL: 2000, // 2 seconds
  MAX_AYAH_RANGE: 20, // Maximum ayahs per request
  MIN_AYAH_RANGE: 1, // Minimum ayahs per request
};

// Form Validation
export const FORM_VALIDATION = {
  MIN_SURAH: 1,
  MAX_SURAH: 114,
  MIN_AYAH: 1,
};

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    REQUEST_RECEIVED: {
      title: "تم استلام الطلب",
      description: "بدأنا في معالجة الفيديو الخاص بك",
    },
    VIDEO_READY: {
      title: "الفيديو جاهز",
      description: "تم إنشاء الفيديو بنجاح",
    },
  },
  ERROR: {
    INVALID_AYAH_RANGE: {
      title: "خطأ في المدخلات",
      description: "آية النهاية يجب أن تكون أكبر من أو تساوي آية البداية",
    },
    INVALID_AYAH_COUNT: {
      title: "خطأ في عدد الآيات",
      description: "عدد الآيات يجب أن يكون بين 1 و 20",
    },
    GENERIC: {
      title: "خطأ",
      description: "حدث خطأ غير متوقع",
    },
  },
};

// Processing Stages with descriptions
export const PROCESSING_STAGES = [
  { 
    id: 1, 
    label: "جاري تحميل الآيات", 
    duration: 5000,
    description: "استرجاع النصوص القرآنية"
  },
  { 
    id: 2, 
    label: "تحميل تلاوة القارئ", 
    duration: 5000,
    description: "جلب ملف الصوت"
  },
  { 
    id: 3, 
    label: "معالجة النصوص", 
    duration: 5000,
    description: "تنسيق النصوص مع الشكل والتشكيل"
  },
  { 
    id: 4, 
    label: "دمج الفيديو والمؤثرات", 
    duration: 5000,
    description: "دمج الصوت والصورة والنصوص"
  },
  { 
    id: 5, 
    label: "إنتاج الملف النهائي", 
    duration: 5000,
    description: "تحويل الفيديو والضغط"
  },
];

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: "#166e4f", // hsl(158, 42%, 35%)
  ACCENT: "#d4a137", // hsl(43, 75%, 50%)
  BACKGROUND: "#faf8f3", // hsl(40, 30%, 98%)
  FOREGROUND: "#0a0a0a", // hsl(0, 0%, 4%)
};

// Text Rendering Configuration
export const TEXT_RENDERING_CONFIG = {
  FONTS: {
    DISPLAY: "'Amiri', serif", // For Quranic text
    SANS: "'Tajawal', sans-serif", // For UI text
  },
  SIZES: {
    SMALL: 14,
    MEDIUM: 18,
    LARGE: 24,
    XLARGE: 32,
  },
  LINE_HEIGHTS: {
    TIGHT: 1.2,
    NORMAL: 1.5,
    RELAXED: 1.8,
    LOOSE: 2,
  },
};

// Error Messages Mapping
export const ERROR_MESSAGES: Record<string, string> = {
  "404": "الآيات المطلوبة غير موجودة",
  "400": "بيانات الطلب غير صحيحة",
  "413": "حجم الطلب أكبر من المسموح",
  "429": "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً",
  "500": "خطأ في الخادم، يرجى المحاولة لاحقاً",
  "503": "الخدمة غير متاحة حالياً",
  "timeout": "انتهت مهلة انتظار الطلب",
  "network": "خطأ في الاتصال، يرجى التحقق من اتصالك بالإنترنت",
  "abort": "تم إلغاء الطلب",
};

// Feature Flags
export const FEATURES = {
  ENABLE_TEXT_RENDERING_PREVIEW: true,
  ENABLE_ADVANCED_SETTINGS: false,
  ENABLE_BATCH_PROCESSING: false,
  ENABLE_DOWNLOAD_PROGRESS: true,
};
