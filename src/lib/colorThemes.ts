export type ColorTheme = 'purple' | 'blue' | 'red' | 'orange' | 'yellow' | 'green' | 'pink' | 'brown';

export interface ColorConfig {
  name: string;
  value: ColorTheme;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  buttonGradient: string;
  shadowColor: string;
  preview: string; // Color for the preview circle
}

export const colorThemes: Record<ColorTheme, ColorConfig> = {
  purple: {
    name: 'Purple',
    value: 'purple',
    primary: 'rgb(147, 51, 234)', // purple-600
    secondary: 'rgb(196, 181, 253)', // purple-300
    accent: 'rgb(168, 85, 247)', // purple-500
    gradient: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(168, 85, 247))',
    buttonGradient: 'bg-gradient-to-r from-purple-600 to-purple-500',
    shadowColor: 'rgba(147, 51, 234, 0.3)',
    preview: 'bg-purple-500',
  },
  blue: {
    name: 'Blue',
    value: 'blue',
    primary: 'rgb(37, 99, 235)', // blue-600
    secondary: 'rgb(147, 197, 253)', // blue-300
    accent: 'rgb(59, 130, 246)', // blue-500
    gradient: 'linear-gradient(135deg, rgb(37, 99, 235), rgb(59, 130, 246))',
    buttonGradient: 'bg-gradient-to-r from-blue-600 to-blue-500',
    shadowColor: 'rgba(37, 99, 235, 0.3)',
    preview: 'bg-blue-500',
  },
  red: {
    name: 'Red',
    value: 'red',
    primary: 'rgb(220, 38, 127)', // rose-600
    secondary: 'rgb(251, 207, 232)', // rose-300
    accent: 'rgb(244, 63, 94)', // rose-500
    gradient: 'linear-gradient(135deg, rgb(220, 38, 127), rgb(244, 63, 94))',
    buttonGradient: 'bg-gradient-to-r from-rose-600 to-rose-500',
    shadowColor: 'rgba(220, 38, 127, 0.3)',
    preview: 'bg-rose-500',
  },
  orange: {
    name: 'Orange',
    value: 'orange',
    primary: 'rgb(234, 88, 12)', // orange-600
    secondary: 'rgb(253, 186, 116)', // orange-300
    accent: 'rgb(249, 115, 22)', // orange-500
    gradient: 'linear-gradient(135deg, rgb(234, 88, 12), rgb(249, 115, 22))',
    buttonGradient: 'bg-gradient-to-r from-orange-600 to-orange-500',
    shadowColor: 'rgba(234, 88, 12, 0.3)',
    preview: 'bg-orange-500',
  },
  yellow: {
    name: 'Yellow',
    value: 'yellow',
    primary: 'rgb(202, 138, 4)', // yellow-600
    secondary: 'rgb(253, 224, 71)', // yellow-300
    accent: 'rgb(234, 179, 8)', // yellow-500
    gradient: 'linear-gradient(135deg, rgb(202, 138, 4), rgb(234, 179, 8))',
    buttonGradient: 'bg-gradient-to-r from-yellow-600 to-yellow-500',
    shadowColor: 'rgba(202, 138, 4, 0.3)',
    preview: 'bg-yellow-500',
  },
  green: {
    name: 'Green',
    value: 'green',
    primary: 'rgb(22, 163, 74)', // green-600
    secondary: 'rgb(134, 239, 172)', // green-300
    accent: 'rgb(34, 197, 94)', // green-500
    gradient: 'linear-gradient(135deg, rgb(22, 163, 74), rgb(34, 197, 94))',
    buttonGradient: 'bg-gradient-to-r from-green-600 to-green-500',
    shadowColor: 'rgba(22, 163, 74, 0.3)',
    preview: 'bg-green-500',
  },
  pink: {
    name: 'Pink',
    value: 'pink',
    primary: 'rgb(219, 39, 119)', // pink-600
    secondary: 'rgb(248, 187, 208)', // pink-300
    accent: 'rgb(236, 72, 153)', // pink-500
    gradient: 'linear-gradient(135deg, rgb(219, 39, 119), rgb(236, 72, 153))',
    buttonGradient: 'bg-gradient-to-r from-pink-600 to-pink-500',
    shadowColor: 'rgba(219, 39, 119, 0.3)',
    preview: 'bg-pink-500',
  },
  brown: {
    name: 'Brown',
    value: 'brown',
    primary: 'rgb(120, 53, 15)', // amber-800
    secondary: 'rgb(217, 119, 6)', // amber-600
    accent: 'rgb(180, 83, 9)', // amber-700
    gradient: 'linear-gradient(135deg, rgb(120, 53, 15), rgb(180, 83, 9))',
    buttonGradient: 'bg-gradient-to-r from-amber-800 to-amber-700',
    shadowColor: 'rgba(120, 53, 15, 0.3)',
    preview: 'bg-amber-700',
  },
};

// CSS custom properties generator
export const generateColorCSS = (theme: ColorTheme | string): string => {
  const key = (theme && theme in colorThemes ? theme : 'purple') as ColorTheme;
  const config = colorThemes[key];
  return `
    :root {
      /* Map dynamic theme to existing HSL design tokens */
      --primary: ${rgbToHslTokens(config.primary)};
      --accent: ${rgbToHslTokens(config.accent)};
      --ring: ${rgbToHslTokens(config.primary)};
      --gradient-primary: ${config.gradient};
      --shadow-glow: 0 0 30px ${rgbaFromRgb(config.primary, 0.3)};
    }
  `;
};

/** Apply theme immediately by injecting/updating a style tag */
export const applyTheme = (theme: ColorTheme | string): void => {
  if (typeof window === 'undefined') return;
  const key = (theme && theme in colorThemes ? theme : 'purple') as ColorTheme;
  const id = 'dynamic-theme';
  const styleEl = document.getElementById(id) as HTMLStyleElement | null;
  const css = generateColorCSS(key);
  if (styleEl) {
    styleEl.textContent = css;
  } else {
    const el = document.createElement('style');
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }
  try {
    localStorage.setItem('themeColor', key);
  } catch {
    // Ignore localStorage errors
  }
};

function rgbToHslTokens(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return '262 80% 65%';
  const r = parseInt(match[1], 10) / 255;
  const g = parseInt(match[2], 10) / 255;
  const b = parseInt(match[3], 10) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  const H = Math.round(h * 360);
  const S = Math.round(s * 100);
  const L = Math.round(l * 100);
  return `${H} ${S}% ${L}%`;
}

function rgbaFromRgb(rgb: string, alpha: number): string {
  return rgb.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
}

// Get dynamic button classes based on theme
export const getButtonClasses = (theme: ColorTheme): string => {
  return colorThemes[theme].buttonGradient;
};
