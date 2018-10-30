/**
 * @file webpack.config
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/26
 *
 */

const nps = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrors = require('friendly-errors-webpack-plugin')

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins(/*loader*/) {
      return [
        require('autoprefixer')({ remove: false }),
        require('cssnano')({
          zindex: false,
          // https://github.com/ben-eb/cssnano/issues/361
          reduceIdents: false
        })
      ]
    }
  }
}

function getWebpackConfig({
  name,
  htmlTemplatePath,
  debug,
  entry,
  dist = nps.join(__dirname, 'dist'),
  sourceMap,
  prod = true,
  compilationSuccessInfo,
  context,
  hot,
  port = 10001
} = {}) {
  const mode = prod ? 'production' : 'development'

  return {
    name,
    devServer: {
      noInfo: true,
      port,
      stats: 'errors-only',
      hot
    },
    entry,
    context,
    mode,
    devtool: !prod || sourceMap ? 'source-map' : false,
    output: {
      path: dist,
      chunkFilename: `[name].chunk.js`,
      filename: `[name].js`
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: { styles: { name: 'styles', test: /\.css$/, chunks: 'all', enforce: true } }
      }
    },
    plugins: [
      // !debug &&
      //   new FriendlyErrors({
      //     compilationSuccessInfo
      //   }),
      hot && new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(mode)
        }
      }),
      new MiniCssExtractPlugin({
        filename: `style.css`,
        allChunks: true
      }),
      new HtmlWebpackPlugin({
        filename: name + '.html',
        template: htmlTemplatePath
      })
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                presets: [[require.resolve('babel-preset-env'), { targets: { browsers: ['ie 11'] } }]],
                plugins: [
                  require.resolve('babel-plugin-transform-object-rest-spread'),
                  require.resolve('babel-plugin-transform-runtime')
                ]
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: prod ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
              options: { sourceMap: true }
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                // url: false,
                minimize: true,
                sourceMap: true
              }
            },
            postcssLoader
          ]
        }
      ]
    }
  }
}

const mdOpts = {
  htmlTemplatePath: nps.join(__dirname, 'index.html'),
  name: 'markdown',
  entry: require.resolve(nps.join(__dirname, 'markdown'))
}

const htmlOpts = {
  htmlTemplatePath: nps.join(__dirname, 'index.html'),
  name: 'html',
  entry: require.resolve(nps.join(__dirname, 'html'))
}

const mdAstOpts = {
  name: 'markdown-ast',
  entry: require.resolve(nps.join(__dirname, 'markdown-ast')),
  htmlTemplatePath: nps.join(__dirname, 'index.html')
}

if (process.env.NODE_ENV === 'production') {
  module.exports = [getWebpackConfig(htmlOpts), getWebpackConfig(mdOpts), getWebpackConfig(mdAstOpts)]
} else {
  module.exports = [
    getWebpackConfig(Object.assign({ prod: false, hot: true }, htmlOpts)),
    getWebpackConfig(Object.assign({ prod: false, hot: true }, mdOpts)),
    getWebpackConfig(Object.assign({ prod: false, hot: true }, mdAstOpts))
  ]

  console.log(`Markdown AST HMR http://localhost:${10001}/markdown-ast.html`)
  console.log(`Markdown HMR http://localhost:${10001}/markdown.html`)
  console.log(`HTML HMR http://localhost:${10001}/html.html`)
}
