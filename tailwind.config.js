/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        qinghua: '#1F4E79',
        dianqing: '#1E5A8A',
        mlan: '#102A43',
        ciwhite: '#F7F5F0',
        paper: '#FBF9F4',
        mist: '#EAF0F4',
        mutedgold: '#C5A46D',
        sealred: '#A63A3A'
      },
      boxShadow: {
        card: '0 8px 24px rgba(16, 42, 67, 0.08)'
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.25rem'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 360ms ease-out'
      }
    }
  },
  plugins: []
};
