/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        synthwave: {
          bg: '#0a0e27',
          bg2: '#16213e',
          neon: {
            pink: '#ff006e',
            purple: '#b60ad0',
            cyan: '#00d9ff',
            green: '#39ff14',
          },
          text: {
            primary: '#e0e0e0',
            secondary: '#a0a0a0',
          },
        },
      },
      backgroundImage: {
        'line-scan': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 110, 0.03) 2px, rgba(255, 0, 110, 0.03) 4px)',
      },
      fontFamily: {
        display: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
