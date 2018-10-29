/**
 * @file inde
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/27
 *
 */
const detectChanged = require('./detectFirstChanged')

const remark = require('remark')()
  // .use({ settings: { position: false } })
  .freeze()

const rehype = require('rehype')()
  // .use({ settings: { position: false } })
  .freeze()

function detectAst(oldAst, newAst, { reverse = true } = {}) {
  // oldAst = Object.assign({}, oldAst)
  // newAst = Object.assign({}, newAst)

  if (reverse) {
    oldAst.children = oldAst.children.reverse()
    newAst.children = newAst.children.reverse()
  }

  const stateOld = detectChanged(oldAst, newAst)
  const stateNew = detectChanged(newAst, oldAst)
  let oldState = stateOld.contrast
  let newState = stateNew.traverse

  let state
  if (oldState || newState) {
    oldState = Object.assign({ parents: [] }, oldState)
    newState = Object.assign({ parents: [] }, newState)

    state = oldState.parents.length > newState.parents.length ? oldState : newState
  }
  return state
}

function detectMarkdown(
  oldMarkdown,
  newMarkdown,
  { wrapTag = 'p', wrapType = 'html', reverse = true, style, className = 'detected-updated' } = {}
) {
  if (oldMarkdown === newMarkdown) {
    return newMarkdown
  }
  let oldAst = remark.parse(oldMarkdown)
  let newAst = remark.parse(newMarkdown)
  let state = detectAst(oldAst, newAst, { reverse })

  let node
  if (state) {
    node = state.node
    if (node) {
      let pos = 0
      const curr = () => state.parents[state.parents.length - 1 - pos]
      const next = () => state.parents[state.parents.length - 1 - ++pos]
      let par = curr()
      while (node && node.type === 'text') {
        node = par
        par = next()
        // stringify to <li>foo</li>, instead of <li><p>foo</p></li>
        if (wrapType !== 'html' && par && par.type === 'listItem') {
          node = par
          par = next()
        }
      }
      // list's children should be type of listItem
      while (wrapType === 'html' && node && node.type === 'listItem') {
        par = node
        node = reverse ? node.children[node.children.length - 1] : node.children[0]
      }
      if (node) {
        const index = par.children.indexOf(node)
        if (index < 0) {
          throw new Error("Node's parent is not found")
        }

        if (wrapType === 'ast') {
          const data = (node.data = node.data || {})
          const hProps = (data.hProperties = data.hProperties || {})
          if (className) {
            hProps.className = [className].concat(hProps.className).filter(Boolean)
          }
          if (style) {
            hProps.style = [style, hProps.style].filter(Boolean).join(' ')
          }
        } else if (wrapType === 'html') {
          const isReverse = par === newAst && reverse
          const endNode = {
            type: 'html',
            value: `</${wrapTag}>`
          }
          const startNode = {
            type: 'html',
            value: `<${wrapTag} class="${className || ''}" style="${style || ''}">`
          }

          if (!isReverse) {
            par.children.splice(index + 1, 0, endNode)
            par.children.splice(index, 0, startNode)
          } else {
            par.children.splice(index + 1, 0, startNode)
            par.children.splice(index, 0, endNode)
          }
        }
      }
    }
  }

  if (reverse) {
    newAst.children = newAst.children.reverse()
  }
  return {
    text: remark.stringify(newAst),
    ast: newAst,
    state,
    node
  }
}

function detectHtml(oldHtml, newHtml, { reverse = true, activeClassName = 'detected-updated' } = {}) {
  if (oldHtml === newHtml) {
    return newHtml
  }
  let oldAst = rehype.parse(oldHtml)
  let newAst = rehype.parse(newHtml)
  let state = detectAst(oldAst, newAst, { reverse })

  if (state) {
    let node = state.node
    if (node) {
      let pos = 0
      while (node && node.type === 'text') {
        node = state.parents[state.parents.length - 1 - pos]
        pos++
        // let par = state.parents[state.parents.length - 1 - pos]
      }
      if (node) {
        const hProps = (node.properties = node.properties || {})
        hProps.className = [activeClassName].concat(hProps.className).filter(Boolean)
      }
    }
  }

  if (reverse) {
    newAst.children = newAst.children.reverse()
  }
  return {
    text: rehype.stringify(newAst),
    ast: newAst,
    state
  }
}

module.exports = {
  detectAst,
  detectHtml,
  detectMarkdown
}
