/**
 * Text Rendering Service - معالجة عرض النصوص القرآنية بشكل صحيح
 */

/**
 * Configuration for Arabic text rendering
 */
export const ARABIC_TEXT_CONFIG = {
  // Font sizes (in pixels)
  SIZES: {
    SMALL: 14,
    MEDIUM: 18,
    LARGE: 24,
    XLARGE: 32,
  },
  // Line heights (multiplier)
  LINE_HEIGHTS: {
    TIGHT: 1.2,
    NORMAL: 1.5,
    RELAXED: 1.8,
    LOOSE: 2,
  },
  // Letter spacing (in pixels)
  LETTER_SPACING: {
    TIGHT: -0.5,
    NORMAL: 0,
    WIDE: 1,
    WIDER: 2,
  },
};

/**
 * Text positioning configuration
 */
export const TEXT_POSITION_CONFIG = {
  // Margin around text (in pixels)
  MARGIN: {
    TOP: 40,
    BOTTOM: 40,
    LEFT: 30,
    RIGHT: 30,
  },
  // Padding inside container
  PADDING: {
    TOP: 20,
    BOTTOM: 20,
    LEFT: 20,
    RIGHT: 20,
  },
  // Maximum text width percentage (for proper wrapping)
  MAX_WIDTH_PERCENT: 90,
};

/**
 * Normalize Arabic text for proper rendering
 */
export function normalizeArabicText(text: string): string {
  if (!text) return "";

  // Remove extra spaces
  let normalized = text.trim().replace(/\s+/g, " ");

  // Ensure proper diacritics handling
  // Add any special normalization needed for Quranic text
  normalized = normalized.normalize("NFC");

  return normalized;
}

/**
 * Split text into multiple lines based on max width
 */
export function splitTextIntoLines(
  text: string,
  maxCharsPerLine: number = 30,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > maxCharsPerLine && currentLine) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  }

  if (currentLine) {
    lines.push(currentLine.trim());
  }

  return lines;
}

/**
 * Get optimal font size based on text length
 */
export function getOptimalFontSize(
  textLength: number,
  containerWidth: number,
): number {
  if (textLength > 100) return ARABIC_TEXT_CONFIG.SIZES.SMALL;
  if (textLength > 60) return ARABIC_TEXT_CONFIG.SIZES.MEDIUM;
  if (textLength > 30) return ARABIC_TEXT_CONFIG.SIZES.LARGE;
  return ARABIC_TEXT_CONFIG.SIZES.XLARGE;
}

/**
 * Get optimal line height based on text
 */
export function getOptimalLineHeight(
  textLength: number,
): number {
  if (textLength > 100) return ARABIC_TEXT_CONFIG.LINE_HEIGHTS.NORMAL;
  if (textLength > 50) return ARABIC_TEXT_CONFIG.LINE_HEIGHTS.RELAXED;
  return ARABIC_TEXT_CONFIG.LINE_HEIGHTS.LOOSE;
}

/**
 * Calculate text position for centering
 */
export function calculateTextPosition(
  videoWidth: number,
  videoHeight: number,
  textWidth: number,
  textHeight: number,
  position: "top" | "center" | "bottom" = "center",
): { x: number; y: number } {
  const x = (videoWidth - textWidth) / 2;

  let y: number;
  switch (position) {
    case "top":
      y = TEXT_POSITION_CONFIG.MARGIN.TOP;
      break;
    case "bottom":
      y = videoHeight - textHeight - TEXT_POSITION_CONFIG.MARGIN.BOTTOM;
      break;
    case "center":
    default:
      y = (videoHeight - textHeight) / 2;
      break;
  }

  return { x, y };
}

/**
 * Get text rendering configuration for different scenarios
 */
export function getTextRenderingConfig(
  textType: "ayah" | "surah" | "reciter",
): {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  position: "top" | "center" | "bottom";
} {
  switch (textType) {
    case "ayah":
      return {
        fontSize: ARABIC_TEXT_CONFIG.SIZES.LARGE,
        lineHeight: ARABIC_TEXT_CONFIG.LINE_HEIGHTS.RELAXED,
        letterSpacing: ARABIC_TEXT_CONFIG.LETTER_SPACING.NORMAL,
        position: "center",
      };
    case "surah":
      return {
        fontSize: ARABIC_TEXT_CONFIG.SIZES.MEDIUM,
        lineHeight: ARABIC_TEXT_CONFIG.LINE_HEIGHTS.NORMAL,
        letterSpacing: ARABIC_TEXT_CONFIG.LETTER_SPACING.NORMAL,
        position: "top",
      };
    case "reciter":
      return {
        fontSize: ARABIC_TEXT_CONFIG.SIZES.SMALL,
        lineHeight: ARABIC_TEXT_CONFIG.LINE_HEIGHTS.TIGHT,
        letterSpacing: ARABIC_TEXT_CONFIG.LETTER_SPACING.WIDE,
        position: "bottom",
      };
  }
}

/**
 * Validate text rendering parameters
 */
export function validateTextRendering(
  text: string,
  fontSize: number,
  containerWidth: number,
): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (!text || text.trim().length === 0) {
    return { valid: false, warnings: ["النص فارغ"] };
  }

  if (fontSize < 8) {
    warnings.push("حجم الخط صغير جداً وقد لا يكون مقروءاً");
  }

  if (fontSize > 72) {
    warnings.push("حجم الخط كبير جداً وقد لا يتسع في الصورة");
  }

  if (text.length > 200) {
    warnings.push("النص طويل جداً وقد يتطلب عدة أسطر");
  }

  // Check for RTL text issues
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  if (!hasArabic) {
    warnings.push("النص لا يبدو أنه نص عربي");
  }

  return { valid: true, warnings };
}

/**
 * Get recommended text color based on background
 */
export function getRecommendedTextColor(
  backgroundColor: string,
): string {
  // Simple luminance calculation
  // If background is dark, use white text; otherwise use dark text
  const rgb = parseInt(backgroundColor.replace("#", ""), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

/**
 * Add text shadow for better readability
 */
export function getTextShadowStyle(
  textColor: string,
): string {
  const shadowColor = textColor === "#FFFFFF" ? "#000000" : "#FFFFFF";
  return `
    text-shadow: 
      2px 2px 4px ${shadowColor},
      -2px -2px 4px ${shadowColor},
      2px -2px 4px ${shadowColor},
      -2px 2px 4px ${shadowColor};
  `;
}

/**
 * Generate CSS for proper Arabic text rendering
 */
export function generateArabicTextCSS(
  fontSize: number,
  lineHeight: number,
  letterSpacing: number,
  textColor: string = "#000000",
): string {
  return `
    font-size: ${fontSize}px;
    line-height: ${lineHeight};
    letter-spacing: ${letterSpacing}px;
    color: ${textColor};
    direction: rtl;
    text-align: right;
    font-family: 'Amiri', serif;
    font-weight: 700;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  `;
}
