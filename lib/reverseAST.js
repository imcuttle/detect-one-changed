/**
 * @file reverseAST
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/11/2
 *
 */
const walk = require('@moyuyc/walk-tree')

function reverseAST(ast) {
  if (!ast) {
    return ast
  }

  walk(ast, node => {
    if (!node) {
      return
    }
    if (node.children && Array.isArray(node.children)) {
      node.children = node.children.reverse()
    }
  })
  return ast
}

module.exports = reverseAST
