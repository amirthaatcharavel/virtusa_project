/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Palette
        'deep-navy': '#14263D',
        'midnight': '#0B1728',
        'muted-teal': '#167D83',
        'warm-white': '#F6F5F0',
        'pure-white': '#FFFFFF',
        'cool-gray': '#E1E5E8',
        'slate-text': '#526173',
        'primary-text': '#182533',

        // Navy Scale
        navy: {
          950: '#070E18',
          900: '#0B1728', // Midnight Blue Sidebar
          850: '#0E1D31',
          800: '#14263D', // Deep Navy Structural
          700: '#1C3554',
          600: '#2A4A72',
          500: '#3D6394',
          200: '#E1E5E8',
          100: '#ECEFF2',
          50: '#F6F5F0',
        },

        // Muted Teal Scale (New Accent)
        teal: {
          950: '#083033',
          900: '#0B4246',
          800: '#0F585C',
          700: '#126B70',
          600: '#167D83', // Muted Teal Primary Accent
          500: '#1D9BA2',
          400: '#32B5BC',
          300: '#62CDD3',
          200: '#A4E3E7',
          100: '#D5F2F4',
          50: '#F0F8F8', // Soft Tint
        },

        // Override purple to alias to teal/navy to remove any purple leaks
        purple: {
          950: '#070E18',
          900: '#0B1728',
          800: '#14263D',
          700: '#126B70',
          600: '#167D83', // Maps to Muted Teal
          500: '#1D9BA2',
          400: '#32B5BC',
          300: '#62CDD3',
          200: '#E1E5E8',
          100: '#F0F8F8',
          50: '#F6F5F0',
        },
        lavender: {
          200: '#E1E5E8',
          100: '#F0F8F8',
          50: '#F6F5F0',
        },

        // Surface Design Tokens
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F6F5F0', // Warm off-white page background
          card: '#FFFFFF',
          subtle: '#F6F5F0',
          bg: '#F6F5F0',
        },

        // Typography Color Tokens
        text: {
          primary: '#182533',   // Primary Text
          secondary: '#526173', // Slate Text
          muted: '#526173',
          slate: '#526173',
        },

        // Border Design Tokens
        border: {
          DEFAULT: '#E1E5E8', // Cool gray subtle border
          subtle: '#E1E5E8',
          focus: '#167D83',   // Muted teal focus ring
        },

        // Semantic Status Tokens
        status: {
          success: '#247653',       // Success Green
          successBg: '#EDF6F1',
          successBorder: '#BCE0CE',
          warning: '#AD741B',       // Warning Amber
          warningBg: '#FDF7EB',
          warningBorder: '#EED7A8',
          error: '#B33A42',         // Error Red
          errorBg: '#FDF1F2',
          errorBorder: '#F5C2C6',
          info: '#167D83',
          infoBg: '#F0F8F8',
        },

        // Direct Semantic Colour Tokens
        'blue-grey': {
          DEFAULT: '#F6F5F0',
          50: '#FDFCF9',
          100: '#F6F5F0',
          200: '#E1E5E8',
        },
        'border-grey': '#E1E5E8',
        'text-primary': '#182533',
        'text-secondary': '#526173',
        'success-green': '#247653',
        'warning-amber': '#AD741B',
        'error-red': '#B33A42',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '3px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(11, 23, 40, 0.03)',
        'xs': '0 1px 3px 0 rgba(11, 23, 40, 0.05)',
      }
    },
  },
  plugins: [],
}
