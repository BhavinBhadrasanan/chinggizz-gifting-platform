export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Add vendor prefixes for better browser compatibility
      flexbox: 'no-2009',
      grid: 'autoplace',
      overrideBrowserslist: [
        'last 2 versions',
        '> 0.5%',
        'not dead',
        'iOS >= 13',
        'Android >= 8'
      ]
    },
  },
}

