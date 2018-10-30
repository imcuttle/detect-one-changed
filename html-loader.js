/**
 * @file html
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/30
 *
 */
const { detectHtml } = require('.')

module.exports = require('./loader/factory')((oldV, newV, opts) => {
  return detectHtml(oldV, newV, Object.assign({}, opts))
})
