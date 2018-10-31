/**
 * @file inde
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/27
 *
 */
const isPlainObject = require('is-plain-obj')
const detectChanged = require('./detectFirstChanged')

/**
 * Find changed one node from AST
 * @public
 * @param {AST} oldAst
 * @param {AST} newAst
 * @param {DetectOptions} options
 * @return {null|DetectedState}
 */
function detectAst(oldAst, newAst, { reverse = true } = {}) {
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

function isInlineTypeMDAST(type) {
  return ['text', 'emphasis', 'strong', 'delete', 'inlineCode', 'break', 'link'].includes(type)
}

/**
 * Detect markdown updating
 * @public
 * @param {AST|string} oldMarkdown
 * @param {AST|string} newMarkdown
 * @param {DetectMarkdownOptions} options
 * @return DetectResult
 */
function detectMarkdown(
  oldMarkdown,
  newMarkdown,
  {
    wrapTag = 'div',
    wrapType = 'html',
    ast = true,
    text = true,
    reverse = true,
    style = '',
    className = 'detected-updated',
    position = true
  } = {}
) {
  if (typeof oldMarkdown !== 'string' && !isPlainObject(oldMarkdown)) {
    throw new TypeError('`oldMarkdown` is required type of string or plain object, but ' + typeof oldMarkdown)
  }

  if (typeof newMarkdown !== 'string' && !isPlainObject(newMarkdown)) {
    throw new TypeError('`newMarkdown` is required type of string or plain object, but ' + typeof newMarkdown)
  }
  const remark = require('remark')()
    .use({ settings: { position } })
    .freeze()

  if (newMarkdown === oldMarkdown) {
    return {
      state: null,
      node: null,
      text: text ? newMarkdown : null,
      ast: ast ? (typeof newMarkdown === 'string' ? remark.parse(newMarkdown) : newMarkdown) : null
    }
  }

  let oldAst = typeof oldMarkdown === 'string' ? remark.parse(oldMarkdown) : oldMarkdown
  let newAst = typeof newMarkdown === 'string' ? remark.parse(newMarkdown) : newMarkdown
  let state = detectAst(oldAst, newAst, { reverse })

  let node
  if (state) {
    node = state.node
    let parents = state.parents
    if (node) {
      let pos = 0
      const curr = () => parents[parents.length - 1 - pos]
      const next = () => parents[parents.length - 1 - ++pos]
      let par = curr()

      // skip text node
      while (['html', 'ast'].includes(wrapType) && node && node.type === 'text') {
        node = par
        par = next()
        // stringify to <li class=active>foo</li>, instead of <li><p class=active>foo</p></li>
        if (wrapType === 'ast' && par && par.type === 'listItem') {
          node = par
          par = next()
        }
      }

      // skip image node
      while (wrapType === 'html' && node && node.type === 'image') {
        node = par
        par = next()
      }

      // case:   "- [link](...)"
      // Find up to an block type node
      while (
        wrapType === 'html' &&
        node &&
        isInlineTypeMDAST(node.type) &&
        // Parent hits listItem
        parents
          .slice(0, parents.length - pos)
          .reverse()
          .findIndex(x => x.type === 'listItem') >= 0
      ) {
        node = par
        par = next()
      }
      // list's children should be type of listItem
      while (['html'].includes(wrapType) && node && node.type === 'listItem') {
        par = node
        node = reverse ? node.children[node.children.length - 1] : node.children[0]
      }
      if (node) {
        const index = par.children.indexOf(node)
        if (index >= 0) {
          function wrapNodes(startNode, endNode) {
            const isReverse = par === newAst && reverse
            if (!isReverse) {
              par.children.splice(index + 1, 0, endNode)
              par.children.splice(index, 0, startNode)
            } else {
              par.children.splice(index + 1, 0, startNode)
              par.children.splice(index, 0, endNode)
            }
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
            const openTag = `<${wrapTag} class="${className || ''}" style="${style || ''}">`
            const closeTag = `</${wrapTag}>`
            if (node && 'tableCell' === node.type) {
              node.children = [
                {
                  type: 'html',
                  value: openTag
                }
              ]
                .concat(node.children || [])
                .concat({
                  type: 'html',
                  value: closeTag
                })
            } else {
              const nextSibling = par.children[index + 1]
              const endNode = {
                type: 'html',
                value: closeTag + (nextSibling && nextSibling.type === 'list' ? '\n' : '')
              }
              const isSimpleChildren = !node.children || node.children.every(x => x.type === 'text')
              const startNode = {
                type: 'html',
                value: openTag + (!isSimpleChildren && par.type === 'listItem' ? '\n' : '')
              }
              wrapNodes(startNode, endNode)
            }
          }
        }
      }
    }
  }

  if (reverse) {
    newAst.children = newAst.children.reverse()
  }
  return {
    text: text ? remark.stringify(newAst) : null,
    ast: ast ? newAst : null,
    state,
    node
  }
}

/**
 * Detect html updating
 * @public
 * @param {AST|string} oldHtml
 * @param {AST|string} newHtml
 * @param {DetectTextOptions} options
 * @return {DetectResult}
 * @example
 * const { detectHtml } = require('detect-one-changed')
 *
 * detectHtml('<p>old</p>', '<p class="new-cls">new</p>').text
 * // => '<p class="detected-updated new-cls">new</p>'
 */
function detectHtml(
  oldHtml,
  newHtml,
  { ast = true, text = true, reverse = true, position = true, style = '', className = 'detected-updated' } = {}
) {
  if (typeof oldHtml !== 'string' && !isPlainObject(oldHtml)) {
    throw new TypeError('`oldHtml` is required type of string or plain object, but ' + typeof oldHtml)
  }

  if (typeof newHtml !== 'string' && !isPlainObject(newHtml)) {
    throw new TypeError('`newHtml` is required type of string or plain object, but ' + typeof newHtml)
  }

  const rehype = require('rehype')()
    .use({ settings: { position, fragment: true } })
    .freeze()

  if (newHtml === oldHtml) {
    return {
      state: null,
      node: null,
      text: text ? newHtml : null,
      ast: ast ? (typeof oldHtml === 'string' ? rehype.parse(oldHtml) : oldHtml) : null
    }
  }

  let oldAst = typeof oldHtml === 'string' ? rehype.parse(oldHtml) : oldHtml
  let newAst = typeof newHtml === 'string' ? rehype.parse(newHtml) : newHtml
  let state = detectAst(oldAst, newAst, { reverse })

  let node
  if (state) {
    node = state.node
    if (node) {
      let pos = 0
      while (node && node.type === 'text') {
        node = state.parents[state.parents.length - 1 - pos]
        pos++
        // let par = state.parents[state.parents.length - 1 - pos]
      }
      if (node) {
        const hProps = (node.properties = node.properties || {})
        if (className) {
          hProps.className = [className].concat(hProps.className).filter(Boolean)
        }
        if (style) {
          hProps.style = [style]
            .concat(hProps.style)
            .filter(Boolean)
            .join(' ')
        }
      }
    }
  }

  if (reverse) {
    newAst.children = newAst.children.reverse()
  }
  return {
    text: text ? rehype.stringify(newAst) : null,
    ast: ast ? newAst : null,
    state,
    node
  }
}

/**
 * @public
 * @typedef {{}} AST
 * @see [Markdown AST](https://github.com/syntax-tree/mdast)
 * @see [HTML AST](https://github.com/syntax-tree/hast)
 * @see [remark](https://github.com/remarkjs/remark) - Markdown processor on MDAST
 * @see [rehype](https://github.com/rehypejs/rehype) - Markdown processor on HAST
 */

/**
 * @public
 * @typedef {{}} DetectOptions
 * @param {boolean} [reverse=true]
 */

/**
 * @public
 * @typedef {{}} DetectedState
 * @param {AST} node - Founded node
 * @param {number[]} paths - The child indexes' track when traversing AST for finding `node`
 * @param {AST[]} parents - The parents' track when traversing AST for finding `node`
 */

/**
 * @public
 * @typedef {{}} DetectTextOptions
 * @extends DetectOptions
 * @param {boolean} [ast=true]  - Should returns `ast`
 * @param {boolean} [text=true] - Should returns `text`
 * @param {string} style      - Injecting style in changed node, e.g: `color: red;`
 * @param {boolean} [position=true]  - Should AST's node carry with position information.
 * @param {string} [className='detected-updated'] - Injecting class in changed node
 */

/**
 * @public
 * @typedef {{}} DetectMarkdownOptions
 * @extends DetectTextOptions
 * @param {'html'|'ast'} [wrapType='html']
 *  Type of wrapping changed node. <br/>
 *  1. `html`: Wrapped by html element.  e.g. `# updated` be wrapped as `<p class="detected-updated">\n\n# updated\n\n</p>` <br/>
 *  2. `ast`:  Wrapped by ast. It's not perceptible in `text`, the effects are work on `ast`
 * @param {string} [wrapTag='div'] - The wrapped tagName when `wrapType` is `'html'`
 * @example
 * const { detectMarkdown } = require('detect-one-changed')
 *
 * detectMarkdown('# old', '# new').text
 * // => '<p class="detected-updated" style="">\n\n# new\n\n</p>\n'
 *
 * @example
 * const { detectMarkdown } = require('detect-one-changed')
 * const remark = require('remark')
 * const html = require('remark-html')
 *
 * remark().use(html).stringify(detectMarkdown('# old', '# new', { wrapType: 'ast' }).ast)
 * // => '<h1 class="detected-updated">new</h1>\n'
 */

/**
 * @public
 * @typedef {{}} DetectResult
 * @param {string} text
 * @param {AST} ast - Be Injected `className` and `style`'s AST
 * @param {DetectedState} state
 * @param {AST} node - Real updated AST node
 */

module.exports = {
  detectAst,
  detectHtml,
  detectMarkdown
}
