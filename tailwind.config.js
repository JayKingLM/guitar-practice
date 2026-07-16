/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral dark surfaces
        ink: {
          950: '#0b0d10',
          900: '#111418',
          850: '#161a1f',
          800: '#1c2127',
          700: '#272d35',
          600: '#3a424c',
          500: '#5b6572',
        },
        // Yellow accent (distinct from any specific brand palette)
        accent: {
          300: '#ffe066',
          400: '#ffd633',
          500: '#f5c518',
          600: '#d9a800',
        },
        paper: '#fbfbf7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 8px 30px rgba(0,0,0,0.35)',
        paper: '0 10px 40px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
};
