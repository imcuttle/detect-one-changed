/**
 * @file factory
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/30
 *
 */
const loaderUtils = require('loader-utils')

const createFactory = require('./createFactory')

module.exports = createFactory({
  keyGetter() {
    return this.resourcePath
  },
  optsGetter() {
    return loaderUtils.getOptions(this)
  }
})
