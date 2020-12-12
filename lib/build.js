const webpack = require('webpack')

const prodConfig = require('./webpack/webpack.prod')

module.exports = () => {
  const projectDir = process.cwd()
  const compiler = webpack(prodConfig(projectDir))
  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }
    process.stdout.write(
      stats.toString({
        children: false,
        chunks: false,
        colors: true,
        modules: false,
        chunkModules: false,
        hash: false,
      }) + '\n\n',
    )
  })
}
