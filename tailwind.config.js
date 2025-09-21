/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        core: {
          green: '#14B85A', /* verde Capo signature (non Spotify) */
          petrol: '#005F73',
          orange: '#FF7849',
          slate: '#0F172A'
        }
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,.08)'
      },
      fontFamily: {
        plex: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
