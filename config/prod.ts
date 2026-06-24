const prodConfig = {
  env: {
    NODE_ENV: '"production"',
    API_BASE: '"https://api.dnh001.com"'
  },
  defineConstants: {},
  mini: {},
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    buildAdapter: 'web',
    output: {
      html: 'index.html'
    },
    miniCompile: {
      jsMinify: true,
      cssMinify: true
    }
  }
}

module.exports = prodConfig
