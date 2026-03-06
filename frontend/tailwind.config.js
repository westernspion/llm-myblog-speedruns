/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Synthwave palette
        synth: {
          bg: '#0d0d1a',
          'bg-card': '#12121f',
          'bg-elevated': '#1a1a2e',
          cyan: '#00f5ff',
          magenta: '#ff00ff',
          purple: '#9d00ff',
          pink: '#ff006e',
          yellow: '#ffe600',
          green: '#00ff9f',
          'text-primary': '#e8e8f0',
          'text-muted': '#7a7a9a',
          border: '#2a2a4a',
          'border-bright': '#3d3d6b',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'synthwave-grid': `
          linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px)
        `,
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(0, 245, 255, 0.15) 0%, transparent 70%)',
        'glow-magenta': 'radial-gradient(ellipse at center, rgba(255, 0, 255, 0.15) 0%, transparent 70%)',
        'header-gradient': 'linear-gradient(180deg, #0d0d1a 0%, #12121f 100%)',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 245, 255, 0.3), 0 0 60px rgba(0, 245, 255, 0.1)',
        'magenta-glow': '0 0 20px rgba(255, 0, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.1)',
        'purple-glow': '0 0 20px rgba(157, 0, 255, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 245, 255, 0.05)',
      },
      animation: {
        'scan': 'scan 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.97' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
