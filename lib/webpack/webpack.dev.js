const path = require('path')
const Progress = require('progress')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const { babelPresets, babelPlugins } = require('./config')

const bar = new Progress('Building :bar :percent', {
  clear: true,
  complete: '=',
  incomplete: ' ',
  total: 100,
  width: 20,
})
let isFinish = false

module.exports = (projectDir, customConfig) => {
  const root = (target) => path.join(projectDir, target)

  const devConfig = {
    mode: 'development',
    context: root('src'),
    entry: [
      root('src/index.js'),
      'webpack-hot-middleware/client?timeout=10000&reload=true&quiet=true',
    ],
    output: {
      filename: '[name].js',
      path: root('dist'),
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: babelPresets,
              plugins: [...babelPlugins, require('react-refresh/babel')],
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.css'],
      modules: ['node_modules', 'src'],
    },
    devtool: 'eval-cheap-module-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: root('src/index.html'),
      }),
      new ESLintPlugin({
        eslintPath: root('node_modules/eslint/'),
        extensions: ['js', 'jsx'],
        formatter: 'pretty',
      }),
      new StylelintPlugin({
        stylelintPath: root('node_modules/stylelint'),
        files: '**/*.js?(x)',
      }),
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
      new webpack.ProgressPlugin((percent) => {
        if (isFinish) return
        bar.update(percent)
        if (percent === 1) {
          bar.terminate()
          isFinish = true
        }
      }),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [
            `You app is running here http://localhost:${
              customConfig.port || 8080
            }`,
          ],
        },
      }),
    ],
    infrastructureLogging: {
      level: 'none',
    },
  }

  return devConfig
}
