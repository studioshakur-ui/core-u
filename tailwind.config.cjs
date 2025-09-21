/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        neutral: {
          10: '#FFFFFF',
          25: '#F5F5F5',
          100: '#1A1A1A',
        },
        capo: {
          DEFAULT: '#1DB954',
          600: '#18a64b',
          700: '#148b3f',
        },
        petrol: '#005F73',
        orangeSoft: '#FF7849',
        success: '#22C55E',
        danger: '#DC2626',
        warning: '#FACC15',
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['Source Sans Pro', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        data: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        premium: '1.5rem',
      },
      boxShadow: {
        e1: '0 1px 2px rgba(0,0,0,0.06), 0 1px 1px rgba(0,0,0,0.04)',
        e2: '0 4px 10px rgba(0,0,0,0.08)',
        e3: '0 12px 24px rgba(0,0,0,0.12)',
        halo: '0 0 0 6px rgba(29,185,84,0.2)',
      },
      spacing: { 18: '4.5rem' },
      transitionDuration: { fast: '160ms', normal: '200ms', slow: '220ms' },
      transitionTimingFunction: { 'out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
      fontSize: {
        xs: ['12px', '18px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
        '2xl': ['32px', '40px'],
        '3xl': ['40px', '48px'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addComponents }) {
      addComponents({
        '.focus-ring': {
          outline: 'none',
          boxShadow: '0 0 0 3px rgba(29,185,84,0.45)',
          transition: 'box-shadow 160ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        },
      });
    },
  ],
};
