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
        // Deep Forest Green - From logo's dark green heart/ribbon (Primary Brand Color)
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bae5cd',
          300: '#8bd3ad',
          400: '#5ab886',
          500: '#359a67',  // Medium forest green
          600: '#1a5f3f',  // Logo green - Main brand color
          700: '#164d33',
          800: '#133d29',
          900: '#103224',
          950: '#081c15',
        },
        // Soft Lavender - From logo's light purple heart/ribbon (Secondary Brand Color)
        secondary: {
          50: '#faf8fc',
          100: '#f4f0f8',
          200: '#ebe3f1',
          300: '#dccee6',
          400: '#c8a8d4',  // Logo lavender - Main secondary color
          500: '#b388c0',
          600: '#9d6ba8',
          700: '#85588d',
          800: '#6f4a75',
          900: '#5c3e61',
          950: '#3d2742',
        },
        // Warm Peach/Coral - From logo's gift box (Accent Color)
        accent: {
          50: '#fef8f3',
          100: '#fdeee3',
          200: '#fbd9c5',
          300: '#f8c09d',
          400: '#f4a172',
          500: '#e8a87c',  // Logo peach - Main accent color
          600: '#d4824f',
          700: '#b86a3e',
          800: '#945636',
          900: '#78472f',
          950: '#412318',
        },
        // Royal Gold - From logo's crowns (Premium/Luxury highlights)
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#f4c542',  // Logo gold - Crown color
          600: '#d4a017',
          700: '#b8860b',
          800: '#9a7310',
          900: '#7c5e10',
          950: '#4a3609',
        },
        // Neutral Grays - Professional, Clean (Kept same for consistency)
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

