/**
 * @file createCachedChildGetter
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/29
 *
 */

function createCachedChildGetter(ast = {}, dp) {
  return function(paths = [], visit) {
    function get(ref = {}, paths, prefix = '') {
      let key = prefix
      for (let i = 0; i < paths.length; i++) {
        const index = paths[i]

        if (ref.children && ref.children[index]) {
          visit && visit(ref, index)

          ref = ref.children[index]
          key += index
          // istanbul ignore next if
          dp && (dp[key] = ref)
          continue
        }
        return { index, ref, broken: true }
      }

      return { ref }
    }

    // istanbul ignore next if
    if (dp) {
      const pathKey = paths.join('')
      let newPaths = paths.slice()
      let ref = ast
      let tmpKey = ''
      for (let i = 0; i < pathKey.length; i++) {
        let tmp = tmpKey + pathKey[i]
        if (!dp.hasOwnProperty(tmp)) {
          break
        }
        tmpKey = tmp
        newPaths.splice(0, 1)
        ref = dp[tmpKey]
      }
      return get(ref, newPaths, tmpKey)
    }

    return get(ast, paths)
  }
}

module.exports = createCachedChildGetter