/**
 * @file markdown
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/30
 *
 */

const { detectMarkdown } = require('./')

module.exports = require('./loader/factory')((oldV, newV, opts = {}) => {
  return detectMarkdown(oldV, newV, Object.assign({ wrapTag: 'div' }, opts))
})
