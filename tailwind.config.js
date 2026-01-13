/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060d1a', // Ultra deep
          900: '#0a192f', // Deepest background
          800: '#112240', // Card background
          700: '#233554', // Light border
          600: '#34496e',
        },
        gold: {
          300: '#fde68a',
          400: '#f6d365', // Highlights
          500: '#cca43b', // Primary metallic
          600: '#b48a28',
          700: '#926f21',
          800: '#73561a',
        },
        primary: {
          ...require('tailwindcss/colors').blue, // Fallback
          500: '#64ffda', // Tech cyan accent
        },
        // Vibrant accent colors
        accent: {
          purple: '#a855f7',
          cyan: '#22d3ee',
          rose: '#f43f5e',
          emerald: '#10b981',
          amber: '#f59e0b',
          indigo: '#6366f1',
          pink: '#ec4899',
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.05)',
          200: 'rgba(255, 255, 255, 0.1)',
          300: 'rgba(255, 255, 255, 0.2)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'], // Optional for headers
      },
      boxShadow: {
        'glow': '0 0 20px rgba(100, 255, 218, 0.3)',
        'glow-gold': '0 0 30px rgba(204, 164, 59, 0.4)',
        'glow-purple': '0 0 30px rgba(168, 85, 247, 0.4)',
        'glow-cyan': '0 0 30px rgba(34, 211, 238, 0.4)',
        'glow-rose': '0 0 30px rgba(244, 63, 94, 0.4)',
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to right bottom, #0a192f, #112240)',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-purple-cyan': 'linear-gradient(135deg, #a855f7 0%, #22d3ee 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f6d365 0%, #cca43b 50%, #b48a28 100%)',
        'gradient-rose-orange': 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
        'gradient-emerald-cyan': 'linear-gradient(135deg, #10b981 0%, #22d3ee 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-x': 'gradientX 3s ease infinite',
        'gradient-border': 'gradientBorder 3s ease infinite',
        'sound-wave': 'soundWave 1s ease-in-out infinite',
        'ripple': 'ripple 1.5s ease-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(100, 255, 218, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(100, 255, 218, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientBorder: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        soundWave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
