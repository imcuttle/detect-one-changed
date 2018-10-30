/**
 * @file postcss.config.js
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/30
 *
 */

module.exports = {
  syntax: 'postcss-less',
  plugins: [
    require('autoprefixer')({ remove: false, browsers: ['cover 99.5%'] }),
    require('cssnano')({ zindex: false, reduceIdents: false })
  ]
}
