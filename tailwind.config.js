/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: '#1A1614',
        caramel: '#3D322B',
        terracotta: {
          DEFAULT: '#E07B5A',
          light: '#E89278',
          dark: '#D4744F',
        },
        crema: '#FBF7F0',
        oliva: {
          DEFAULT: '#6B7F4A',
          light: '#8A9E6A',
          dark: '#556636',
        },
        latte: '#A89884',
      },
      borderRadius: {
        '2xl': '16px',
      },
      animation: {
        'ring-breathe': 'ringBreathe 2s ease-in-out infinite',
        'ring-flash': 'ringFlash 1.6s ease-out forwards',
        'page-enter': 'pageEnter 200ms ease-out',
        'slide-down': 'slideDown 200ms ease-out',
      },
      keyframes: {
        ringBreathe: {
          '0%, 100%': { boxShadow: '0 0 40px rgba(224, 123, 90, 0.08)' },
          '50%': { boxShadow: '0 0 70px rgba(224, 123, 90, 0.15)' },
        },
        ringFlash: {
          '0%': { boxShadow: '0 0 120px rgba(224, 123, 90, 0.35)' },
          '40%': { boxShadow: '0 0 120px rgba(224, 123, 90, 0.35)' },
          '100%': { boxShadow: '0 0 0px rgba(224, 123, 90, 0)' },
        },
        pageEnter: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
