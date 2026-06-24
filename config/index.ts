const config = {
  projectName: 'dnh001',
  date: '2026-06-25',
  designWidth: 375,
  deviceRatio: {
    '375': 1,
    '375 - 667': 2 / 1.625,
    '375 - 812': 2 / 1.812,
    '414 - 736': 2 / 2.046,
    '414 - 896': 2 / 2.088
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-framework-react'
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compilationDependencies: [],
  cache: {
    enable: true
  }
}

module.exports = config
