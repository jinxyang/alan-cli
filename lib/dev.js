const express = require('express')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const getDevConfig = require('./webpack/webpack.dev')

module.exports = () => {
  const projectDir = process.cwd()
  const app = express()
  const compiler = webpack(getDevConfig(projectDir))

  app.use(devMiddleware(compiler))
  app.use(
    hotMiddleware(compiler, {
      log: false,
      heartbeat: 5000,
    }),
  )
  app.listen(9527)
}
