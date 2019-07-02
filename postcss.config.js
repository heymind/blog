const tailwindcss = require('tailwindcss')
module.exports = {
    plugins: [
      require('postcss-nesting')(),
      require('postcss-easy-import'),
      tailwindcss('./tailwind.config.js'),
      require('autoprefixer')
    ]
  }