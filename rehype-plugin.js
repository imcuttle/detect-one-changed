/**
 * @file rehype-plugin.js
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/31
 *
 */
const createFactory = require('./loader/createFactory')
const { detectHtml } = require('.')

function create() {
  let runtimeKey
  let runtimeOpts
  const loader = createFactory({
    keyGetter() {
      return runtimeKey
    },
    optsGetter() {
      return runtimeOpts
    }
  })((oldV, newV, opts = {}) => {
    return detectHtml(oldV, newV, opts)
  })

  function transform(input, { key, opts }) {
    runtimeKey = key
    runtimeOpts = opts
    return loader(input)
  }

  function plugin(options = {}) {
    const self = this

    return function(node, file = {}) {
      const opts = options

      const key = options.filepath || file.history[0]
      return transform(node, {
        key,
        opts: Object.assign({ text: false, position: false }, opts, { ast: true })
      }).ast
    }
  }
  Object.assign(plugin, loader)

  return plugin
}

module.exports = Object.assign(create(), { create })
