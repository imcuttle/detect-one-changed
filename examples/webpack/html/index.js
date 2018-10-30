/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/29
 */

function render() {
  document.querySelector(
    '.markdown-body'
  ).innerHTML = require('raw-loader!../../../html-loader?returnType=text!./html.html')
}

render()

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept(['raw-loader!../../../html-loader?returnType=text!./html.html'], () => {
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
