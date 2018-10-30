/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/29
 */

const gfm = require('remark')()
  .use(require('remark-preset-gfm'))
  .use(require('remark-html'))
const debounce = require('lodash.debounce')
const { parse, stringify } = require('querystring')
const copy = require('copy-text-to-clipboard')
const { compress, decompress } = require('lzbase62')

const { name, version } = require('../../../package')

require('!style-loader!css-loader!../../../style.css')

const { detectMarkdown } = require('../../../')

const defaultMd = require('!raw-loader!./markdown.md')
const textarea = document.querySelector('.input-body textarea')
const query = parse(location.search.slice(1))
textarea.value = query.md ? decompress(query.md) : defaultMd

let oldMd = query.old || textarea.value
update()

function update(value = textarea.value) {
  const detected = detectMarkdown(oldMd, value, { wrapType: 'ast' })
  console.log('=== detected ===')
  console.log(detected)

  const { ast } = detected
  const html = gfm.stringify(gfm.runSync(ast))

  oldMd = value
  document.querySelector('.markdown-body').innerHTML = html

  const nodeList = [...document.querySelectorAll('.detected-updated')]
  const node = nodeList.pop()
  if (node) {
    node.scrollIntoView({ behavior: 'smooth' })
  }
}

textarea.addEventListener(
  'input',
  debounce(({ target }) => {
    update(target.value)
  }, 300)
)

function getUrl() {
  const val = { md: defaultMd === textarea.value ? undefined : compress(textarea.value) }
  return location.href.replace(/\?[^?]+?$/, '') + '?' + stringify(val)
}

document.querySelector('#copy-link').addEventListener('click', () => {
  copy(getUrl())
  alert('Copied!')
})
document.querySelector('#version').textContent = `${name} ${version}`
document.querySelector('#new-issue').addEventListener('click', newIssue)

function newIssue() {
  const body = `
  **${name} ${version}**
[Live link](${getUrl()})

**Input:**
~~~~markdown
${textarea.value}
~~~~

**Expected behavior:**
  `

  window.open(`https://github.com/imcuttle/${name}/issues/new?body=${encodeURIComponent(body)}`)
}
