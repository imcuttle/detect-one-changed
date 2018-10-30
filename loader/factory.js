/**
 * @file factory
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/30
 *
 */
const loaderUtils = require('loader-utils')

function factory(detectFn) {
  function webpackLoader(input) {
    const { resourcePath, hot } = this
    const isDisabled = process.env.NODE_ENV === 'production' // || !hot

    const prevInput = fileContents.get(resourcePath) || input
    !isDisabled && fileContents.set(resourcePath, input)

    const opts = loaderUtils.getOptions(this) || {}
    const { returnType = 'all' } = opts

    const detected = detectFn(prevInput, input, opts)
    switch (returnType) {
      case 'text':
        return detected.text
      case 'ast':
        return detected.ast
      case 'all':
        return detected
      default:
        return detected[returnType]
    }
  }

  const fileContents = (webpackLoader.fileContents = new Map())
  return webpackLoader
}

module.exports = factory
