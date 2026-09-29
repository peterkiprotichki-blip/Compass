/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0E2E24',
          deep: '#082119',
          darker: '#051610',
          line: '#183E31',
          surface: '#12382C',
          muted: '#1B4738',
        },
        charcoal: {
          DEFAULT: '#111827',
          dark: '#0B0F19',
          muted: '#4B5563',
          light: '#6B7280',
        },
        gold: {
          DEFAULT: '#D4A827',
          soft: '#ECC669',
          rich: '#E5B544',
          light: '#F8E9BE',
          dark: '#B8851B',
          deep: '#8C6510',
        },
        ivory: {
          DEFAULT: '#FDFBF7',
          sunk: '#F4F0E6',
          cream: '#FAF6EE',
          pure: '#FFFFFF',
        },
        semantic: {
          success: '#2E8B57',
          caution: '#D4A827',
          risk: '#C25734',
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
        'light-sm': '0 1px 3px rgba(14,46,36,0.06)',
        'light-lg': '0 10px 30px -4px rgba(14,46,36,0.08)',
        'gold-glow': '0 0 25px rgba(212,168,39,0.35)',
        'gold-btn': '0 4px 14px rgba(212,168,39,0.3)',
        'forest-card': '0 12px 36px -4px rgba(8,33,25,0.4)',
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
