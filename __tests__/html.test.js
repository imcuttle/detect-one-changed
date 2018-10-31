/**
 * @file main
 * @author Cuttle Cong
 * @date 2018/10/27
 * @description
 *
 */
const { detectHtml } = require('../')
const { fixture } = require('./helper')
const rehype = require('rehype')
const fs = require('fs')

function runDetect(name, opts) {
  const oldMd = fs.readFileSync(fixture('html', name, 'old.html'), { encoding: 'utf8' })
  const newMd = fs.readFileSync(fixture('html', name, 'new.html'), { encoding: 'utf8' })

  return detectHtml(oldMd, newMd, opts)
}

describe('html-detect-changed', function() {
  it('normal', () => {
    expect(runDetect('normal').text).toMatchInlineSnapshot(`
"<h1>readme</h1>
<p class=\\"detected-updated\\">wow changed me</p>
<h1>readme</h1>
"
`)
  })

  it('append-cls-style', () => {
    expect(runDetect('append-cls-style', { className: 'updated', style: 'position: relative;' }).text)
      .toMatchInlineSnapshot(`
"<h1>readme</h1>
<p class=\\"updated text\\" style=\\"position: relative; color: red;\\">wow changed me</p>
<h1>readme</h1>
"
`)
  })

  it('reverse', () => {
    expect(runDetect('reverse', { className: 'updated', style: 'position: relative;' }).text).toMatchInlineSnapshot(`
"<h1>readme</h1>
<p>wow changed me</p>
<h1>readme</h1>
<h1 class=\\"updated\\" style=\\"position: relative;\\">new line</h1>
"
`)
    expect(runDetect('reverse', { className: 'meme', reverse: false }).text).toMatchInlineSnapshot(`
"<h1>readme</h1>
<p class=\\"meme\\">wow changed me</p>
<h1>readme</h1>
<h1>new line</h1>
"
`)
  })

  it('append-cls-style with `position`', () => {
    expect(runDetect('append-cls-style', { position: true }).node.position).not.toBeUndefined()
    expect(runDetect('append-cls-style', { position: false }).node.position).toBeUndefined()
  })
})
