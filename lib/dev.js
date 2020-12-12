const path = require('path')
const express = require('express')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const history = require('connect-history-api-fallback')

const getDevConfig = require('./webpack/webpack.dev')

module.exports = () => {
  const projectDir = process.cwd()
  const customConfig = require(path.join(projectDir, 'alan.config.js'))

  const app = express()
  const compiler = webpack(getDevConfig(projectDir, customConfig))

  app.use(history())
  app.use(devMiddleware(compiler))
  app.use(
    hotMiddleware(compiler, {
      log: false,
      heartbeat: 5000,
    }),
  )
  app.listen(customConfig.port || 8080)
}
