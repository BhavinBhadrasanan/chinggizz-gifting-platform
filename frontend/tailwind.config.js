/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // Enhanced responsive breakpoints for all devices
    screens: {
      'xs': '475px',    // Extra small devices (large phones)
      'sm': '640px',    // Small devices (tablets)
      'md': '768px',    // Medium devices (small laptops)
      'lg': '1024px',   // Large devices (desktops)
      'xl': '1280px',   // Extra large devices (large desktops)
      '2xl': '1536px',  // 2X large devices (larger desktops)

      // Custom breakpoints for specific use cases
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',

      // Max-width breakpoints (for mobile-first approach)
      'max-sm': {'max': '639px'},
      'max-md': {'max': '767px'},
      'max-lg': {'max': '1023px'},
    },
    extend: {
      colors: {
        // Facebook-Inspired Blue - Trust, Professional, Recognizable
        primary: {
          50: '#e8f4ff',
          100: '#d4e9ff',
          200: '#b0d7ff',
          300: '#7bbfff',
          400: '#4a9eff',
          500: '#1877f2',  // Facebook Blue
          600: '#0c63d4',
          700: '#0a52b3',
          800: '#084491',
          900: '#063870',
          950: '#042a52',
        },
        // Warm Gold/Yellow - Premium, Luxury, Gift-giving
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Warm Gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Success Green - Positive, Fresh, Natural
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Neutral Grays - Professional, Clean
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(217, 70, 239, 0.3)',
        'glow-lg': '0 0 40px rgba(217, 70, 239, 0.6)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'neumorphic': '12px 12px 24px #d1d1d1, -12px -12px 24px #ffffff',
        'neumorphic-inset': 'inset 8px 8px 16px #d1d1d1, inset -8px -8px 16px #ffffff',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'fadeInDown': 'fadeInDown 0.6s ease-out',
        'scaleIn': 'scaleIn 0.4s ease-out',
        'slideInLeft': 'slideInLeft 0.5s ease-out',
        'slideInRight': 'slideInRight 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
}

