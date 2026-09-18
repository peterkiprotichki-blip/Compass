/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0B2E24',
          deep: '#071C16',
          line: '#1D4438',
        },
        charcoal: {
          DEFAULT: '#111827',
          dark: '#0B0F19',
        },
        gold: {
          DEFAULT: '#D4A017',
          soft: '#E8B94A',
          dark: '#B0830E',
        },
        ivory: {
          DEFAULT: '#F9F7EF',
          sunk: '#F1EEE3',
        },
        semantic: {
          success: '#3E9E6E',
          caution: '#D4A017',
          risk: '#C2603A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        button: '8px',
        card: '12px',
        sheet: '20px',
        pill: '9999px',
      },
      boxShadow: {
        'light-sm': '0 1px 2px rgba(17,24,39,0.06)',
        'light-lg': '0 8px 24px rgba(17,24,39,0.08)',
        'gold-glow': '0 0 20px rgba(212,160,23,0.3)',
      },
      animation: {
        'compass-spin': 'compassSpin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        compassSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
