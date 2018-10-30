/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/29
 */

const remark = require('remark')
const html = require('remark-html')

function render() {
  const markdown = require('raw-loader!../../../md-loader?returnType=text!./markdown.md')
  console.log('--- markdown ---')
  console.log(markdown)
  console.log('')
  return remark()
    .use(html)
    .process(markdown)
    .then(data => {
      document.querySelector('.markdown-body').innerHTML = String(data)
    })
}

render()

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept(['raw-loader!../../../md-loader?returnType=text!./markdown.md'], () => {
    render().then(() => {
      require('!style-loader!css-loader!../../../style.css')

      const nodeList = [...document.querySelectorAll('.detected-updated')]
      const node = nodeList.pop()
      if (node) {
        console.log('highlight')
        node.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
}
