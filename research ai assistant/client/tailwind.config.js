/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070d19',
          900: '#0a192f',
          850: '#0f1f38',
          800: '#142a4a',
          700: '#1e3a5f',
          600: '#2d5282',
          100: '#e8f0fe',
          50: '#f0f5fc',
        },
        cream: {
          50: '#fdfbf7',
          100: '#fbf8f1',
          200: '#f5edd9',
          300: '#ebdcbe',
          800: '#322d25',
          900: '#1c1914',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'academic': '0 4px 20px -2px rgba(10, 25, 47, 0.08), 0 2px 6px -1px rgba(10, 25, 47, 0.04)',
        'academic-hover': '0 10px 25px -3px rgba(10, 25, 47, 0.12), 0 4px 10px -2px rgba(10, 25, 47, 0.06)',
      }
    },
  },
  plugins: [],
};
