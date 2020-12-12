const path = require('path')
const Progress = require('progress')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const { babelPresets, babelPlugins } = require('./config')

const bar = new Progress('Building :bar :percent', {
  clear: true,
  complete: '=',
  incomplete: ' ',
  total: 100,
  width: 20,
})
let isFinish = false

module.exports = (projectDir) => {
  const root = (target) => path.join(projectDir, target)

  const prodConfig = {
    mode: 'production',
    context: root('src'),
    entry: {
      index: root('src/index.js'),
    },
    output: {
      filename: '[name].[contenthash:8].js',
      path: root('dist'),
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'thread-loader',
            },
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: babelPresets,
                plugins: babelPlugins,
              },
            },
          ],
          include: root('src'),
        },
        {
          test: /\.css$/,
          use: ['cache-loader', MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.css'],
      modules: ['node_modules', 'src'],
    },
    plugins: [
      new CleanWebpackPlugin(),
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
      new webpack.ProgressPlugin((percent, message) => {
        if (isFinish) return
        bar.update(percent)
        if (percent === 1) {
          bar.terminate()
          isFinish = true
        }
      }),
      new MiniCssExtractPlugin({
        filename: 'index.[contenthash:8].css',
      }),
      new OptimizeCssAssetsPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
          parallel: true,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
          },
        },
      },
    },
  }
  return prodConfig
}
