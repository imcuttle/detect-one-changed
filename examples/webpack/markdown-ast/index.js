/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/29
 */

const gfm = require('remark')()
  .use(require('remark-preset-gfm'))
  .use(require('remark-html'))

function render() {
  const ast = require('raw-loader!../../../md-loader?returnType=ast&wrapType=ast!./markdown.md')
  console.log('ast', ast)

  const html = gfm.stringify(gfm.runSync(ast))
  document.querySelector('.markdown-body').innerHTML = html
}

render()

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept(['raw-loader!../../../md-loader?returnType=ast&wrapType=ast!./markdown.md'], () => {
    render()
    require('!style-loader!css-loader!../../../style.css')

    const nodeList = [...document.querySelectorAll('.detected-updated')]
    const node = nodeList.pop()
    if (node) {
      console.log('highlight')
      node.scrollIntoView({ behavior: 'smooth' })
    }
  })
}
