/**
 * @file compiler
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/30
 *
 */
const path = require('path')
const webpack = require('webpack')
const memoryfs = require('memory-fs')

module.exports = (fixture, loader, options) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./fixture/${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /./,
          use: [
            'raw-loader',
            {
              loader: require.resolve(`../${loader}-loader`),
              options
            }
          ]
        }
      ]
    }
  })

  compiler.outputFileSystem = new memoryfs()

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) reject(err || stats.compilation.errors[0])

      resolve(stats)
    })
  })
}
