const path = require('path')

module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }]
  ],
  plugins: [
    'tailwindcss/globals'
  ]
}
