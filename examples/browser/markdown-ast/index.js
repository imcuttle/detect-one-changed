/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/29
 */

const gfm = require('remark')()
  .use(require('remark-preset-gfm'))
  .use(require('remark-html'))
const debounce = require('lodash.debounce')
require('!style-loader!css-loader!../../../style.css')

const { detectMarkdown } = require('../../../')

const md = require('!raw-loader!./markdown.md')
const textarea = document.querySelector('.input-body textarea')
textarea.value = md

let oldMd = md

textarea.addEventListener(
  'input',
  debounce(({ target }) => {
    const ast = detectMarkdown(oldMd, target.value, { wrapType: 'ast' }).ast
    const html = gfm.stringify(gfm.runSync(ast))

    oldMd = target.value
    document.querySelector('.markdown-body').innerHTML = html

    const nodeList = [...document.querySelectorAll('.detected-updated')]
    const node = nodeList.pop()
    if (node) {
      node.scrollIntoView({ behavior: 'smooth' })
    }
  }, 500)
)

document.querySelector('.markdown-body').innerHTML = String(gfm.processSync(oldMd))
