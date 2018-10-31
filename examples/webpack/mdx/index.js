/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/29
 */
import * as React from 'react'
import { render } from 'react-dom'

function start() {
  const Markdown = require('./markdown.mdx').default
  render(<Markdown />, document.querySelector('.markdown-body'))
}

start()

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept(['./markdown.mdx'], () => {
    start()
    require('!style-loader!css-loader!../../../style.css')

    const nodeList = [...document.querySelectorAll('.detected-updated')]
    const node = nodeList.pop()
    if (node) {
      console.log('highlight')
      node.scrollIntoView({ behavior: 'smooth' })
    }
  })
}
