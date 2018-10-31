/**
 * @file markdown
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/30
 *
 */

const { detectMarkdown } = require('./')

function create() {
  return require('./loader/webpackFactory')((oldV, newV, opts = {}) => {
    const detected = detectMarkdown(oldV, newV, Object.assign({ wrapTag: 'div' }, opts))
    const { returnType = 'all' } = opts || {}
    switch (returnType) {
      case 'text':
        return detected.text
      case 'ast':
        return detected.ast
      case 'all':
        return detected
      default:
        return detected[returnType]
    }
  })
}

module.exports = Object.assign(create(), { create })
