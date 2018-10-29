/**
 * @file main
 * @author Cuttle Cong
 * @date 2018/10/27
 * @description
 *
 */
const { detectMarkdown } = require('../')
const { fixture } = require('./helper')
const rehype = require('rehype')
const remark = require('remark')
const html = require('remark-html')
const fs = require('fs')

function md2Html(ast) {
  return String(
    remark()
      .use(html)
      .stringify(ast)
  )
}

function runDetect(name, opts) {
  const oldMd = fs.readFileSync(fixture('markdown', name, 'old.md'))
  const newMd = fs.readFileSync(fixture('markdown', name, 'new.md'))

  return detectMarkdown(oldMd, newMd, opts)
}

describe('md-detect-changed', function() {
  it('should md-detect-changed works normal', () => {
    expect(runDetect('normal').text).toMatchInlineSnapshot(`
"# readme

<p class=\\"detected-updated\\" style=\\"\\">

okkkk changed here

</p>

# Readme 2

fooo
"
`)
  })

  it('should md-detect-changed works normal wrapTag', () => {
    expect(runDetect('normal', { wrapTag: 'span' }).text).toMatchInlineSnapshot(
      '<p class="detected-updated">okkkk changed here</p>',
      `
"# readme

<span class=\\"detected-updated\\" style=\\"\\">

okkkk changed here

</span>

# Readme 2

fooo
"
`
    )
  })

  it('should reverse works well', function() {
    expect(runDetect('reverse', { wrapTag: 'span', wrapType: 'html' }).text).toMatchInlineSnapshot(`
"# readme

okkkk changed here

# Readme 2

<span class=\\"detected-updated\\" style=\\"\\">

fooo

</span>
"
`)
  })

  it('should detect first one when reverse = false ', function() {
    expect(runDetect('reverse', { wrapTag: 'span', wrapType: 'html', reverse: false }).text).toMatchInlineSnapshot(`
"# readme

<span class=\\"detected-updated\\" style=\\"\\">

okkkk changed here

</span>

# Readme 2

fooo
"
`)
  })

  it('should reverse works well `wrapType = ast`', function() {
    const { text, ast } = runDetect('reverse', { wrapType: 'ast' })
    expect(text).toMatchInlineSnapshot(`
"# readme

okkkk changed here

# Readme 2

fooo
"
`)

    expect(md2Html(ast)).toMatchInlineSnapshot(`
"<h1>readme</h1>
<p>okkkk changed here</p>
<h1>Readme 2</h1>
<p class=\\"detected-updated\\">fooo</p>
"
`)
  })

  it('should reverse works well `reverse = false wrapType = ast`', function() {
    const { text, ast } = runDetect('reverse', { wrapType: 'ast', reverse: false })
    expect(text).toMatchInlineSnapshot(`
"# readme

okkkk changed here

# Readme 2

fooo
"
`)

    expect(md2Html(ast)).toMatchInlineSnapshot(`
"<h1>readme</h1>
<p class=\\"detected-updated\\">okkkk changed here</p>
<h1>Readme 2</h1>
<p>fooo</p>
"
`)

    expect(
      md2Html(runDetect('reverse', { wrapType: 'ast', reverse: false, style: 'color:red;background-colore:blue;' }).ast)
    ).toMatchInlineSnapshot(`
"<h1>readme</h1>
<p class=\\"detected-updated\\" style=\\"color:red;background-colore:blue;\\">okkkk changed here</p>
<h1>Readme 2</h1>
<p>fooo</p>
"
`)
  })

  it('should md-detect-changed works diff-total', () => {
    expect(runDetect('diff-total').text).toMatchInlineSnapshot(`
"<div class=\\"detected-updated\\" style=\\"\\">

readme

</div>

fooo
"
`)
  })

  it('should md-detect-changed works diff-newline', () => {
    expect(runDetect('diff-newline').text).toMatchInlineSnapshot(`
"readme

fooo
"
`)
  })

  it('should md-detect-changed works diff-list', () => {
    expect(runDetect('diff-list').text).toMatchInlineSnapshot(`
"readme

-   <div class=\\"detected-updated\\" style=\\"\\">
    fooo
    </div>

asdasd
"
`)
  })

  it('should md-detect-changed works diff-new-list', () => {
    expect(runDetect('diff-new-list', { style: 'abc' }).text).toMatchInlineSnapshot(`
"# readme

-   fooo
-   <div class=\\"detected-updated\\" style=\\"abc\\">
    new
    </div>
"
`)
  })

  it('should diff-rm-list', function() {
    expect(runDetect('diff-rm-list').text).toMatchInlineSnapshot(`
"# readme

-   <div class=\\"detected-updated\\" style=\\"\\">
    fooo
    </div>
"
`)
  })

  it('should diff-rm-head', function() {
    expect(runDetect('diff-rm-head').text).toMatchInlineSnapshot(`
"# readme

block block1

<div class=\\"detected-updated\\" style=\\"\\">

block block2

</div>
"
`)
  })

  // it('should diff-code', function() {
  //   expect(runDetect('diff-code')).toMatchSnapshot()
  // })
})
