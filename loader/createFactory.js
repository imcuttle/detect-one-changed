/**
 * @file factory
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/30
 *
 */
const clone = require('lodash.clonedeep')

function createFactory({ keyGetter, optsGetter }) {
  return function webpackFactory(detectFn) {
    function loader(input) {
      const key = typeof keyGetter === 'function' ? keyGetter.apply(this, arguments) : keyGetter
      const opts = (typeof optsGetter === 'function' ? optsGetter.apply(this, arguments) : optsGetter) || {}

      const isDisabled = process.env.NODE_ENV === 'production' // || !hot
      const prevInput = (key && cache.get(key)) || input
      !isDisabled && key && cache.set(key, clone(input))

      return detectFn(prevInput, input, opts)
    }

    const cache = (loader.cache = new Map())
    return loader
  }
}

module.exports = createFactory
