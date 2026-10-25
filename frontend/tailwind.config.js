/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A0F1D', // Deep Midnight Navy
          900: '#0F172A', // Midnight Navy Sidebar & Primary Structure
          800: '#1E293B', // Dark Navy Border & Structural Headers
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
        purple: {
          950: '#2E1065',
          900: '#3B0764',
          800: '#581C87',
          700: '#6B21A8',
          600: '#7C3AED', // Royal Purple Primary Action & Active Route
          500: '#8B5CF6',
          400: '#A78BFA',
          300: '#C4B5FD',
          200: '#DDD6FE', // Soft Lavender Border
          100: '#EDE9FE', // Soft Lavender Highlight
          50: '#FAF5FF',  // Soft Lavender Background for AI-assisted / extracts
        },
        lavender: {
          200: '#DDD6FE',
          100: '#EDE9FE',
          50: '#FAF5FF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F1F6FA', // Light Blue Grey: secondary surfaces & headers
          card: '#FFFFFF',
          subtle: '#F1F6FA',
          bg: '#F1F6FA',     // Light Blue Grey page background
        },
        text: {
          primary: '#172B3A',   // Primary Text: Headings and body text
          secondary: '#647789', // Secondary Text: Metadata, descriptions, timestamps
          muted: '#647789',
        },
        border: {
          DEFAULT: '#D8E3EC', // Border Grey: Table borders, dividers, input outlines
          subtle: '#D8E3EC',
          focus: '#7C3AED',   // Royal Purple brand focus ring
        },
        status: {
          success: '#16845B',       // Success Green: Passed tests, completed tasks, approved status
          successBg: '#E8F5EE',
          successBorder: '#B2DEC7',
          warning: '#B7791F',       // Warning Amber: Pending reviews and warnings
          warningBg: '#FDF6E9',
          warningBorder: '#E8D2A6',
          error: '#B42318',         // Error Red: Failed tests, critical issues, rejected changes
          errorBg: '#FEF3F2',
          errorBorder: '#FECDCA',
          info: '#2563EB',
          infoBg: '#EFF6FF',
        },
        // Direct semantic colour tokens
        'blue-grey': {
          DEFAULT: '#F1F6FA',
          50: '#F8FAFC',
          100: '#F1F6FA',
          200: '#D8E3EC',
        },
        'border-grey': '#D8E3EC',
        'text-primary': '#172B3A',
        'text-secondary': '#647789',
        'success-green': '#16845B',
        'warning-amber': '#B7791F',
        'error-red': '#B42318',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
