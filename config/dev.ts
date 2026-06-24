const devConfig = {
  env: {
    NODE_ENV: '"development"',
    API_BASE: '"http://localhost:8787"'
  },
  defineConstants: {},
  mini: {},
  h5: {
    devServer: {
      port: 3000,
      host: '0.0.0.0',
      disableHostCheck: true
    }
  }
}

module.exports = devConfig
