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

function read(name) {
  return fs.readFileSync(fixture('markdown', name), { encoding: 'utf8' })
}

function runDetect(name, opts) {
  const oldMd = read(name + '/old.md')
  const newMd = read(name + '/new.md')

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

  it('should .normal ast', function() {
    expect(md2Html(runDetect('normal', { wrapType: 'ast' }).ast)).toMatchInlineSnapshot(`
"<h1>readme</h1>
<p class=\\"detected-updated\\">okkkk changed here</p>
<h1>Readme 2</h1>
<p>fooo</p>
"
`)
  })

  it('should md-detect-changed works normal wrapTag', () => {
    expect(runDetect('normal', { wrapTag: 'span' }).text).toMatchInlineSnapshot(
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
"<p class=\\"detected-updated\\" style=\\"\\">

readme

</p>

fooo
"
`)
  })

  it('should md-detect-changed works diff-total `ast`', () => {
    expect(md2Html(runDetect('diff-total', { wrapType: 'ast' }).ast)).toMatchInlineSnapshot(`
"<p class=\\"detected-updated\\">readme</p>
<p>fooo</p>
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

  it('should md-detect-changed works diff-newline `ast`', () => {
    expect(md2Html(runDetect('diff-newline', { wrapType: 'ast' }).ast)).toMatchInlineSnapshot(`
"<p>readme</p>
<p>fooo</p>
"
`)
  })

  it('should md-detect-changed works diff-list', () => {
    expect(runDetect('diff-list').text).toMatchInlineSnapshot(`
"readme

-   <p class=\\"detected-updated\\" style=\\"\\">
    fooo
    </p>

asdasd
"
`)
  })

  it('should md-detect-changed works diff-list `ast`', () => {
    expect(md2Html(runDetect('diff-list', { wrapType: 'ast' }).ast)).toMatchInlineSnapshot(`
"<p>readme</p>
<ul>
<li class=\\"detected-updated\\">fooo</li>
</ul>
<p>asdasd</p>
"
`)
  })

  it('should md-detect-changed works diff-new-list', () => {
    expect(runDetect('diff-new-list', { style: 'abc' }).text).toMatchInlineSnapshot(`
"# readme

-   fooo
-   <p class=\\"detected-updated\\" style=\\"abc\\">
    new
    </p>
"
`)
  })

  it('should md-detect-changed works diff-new-list `ast`', () => {
    expect(md2Html(runDetect('diff-new-list', { style: 'abc', wrapType: 'ast' }).ast)).toMatchInlineSnapshot(`
"<h1>readme</h1>
<ul>
<li>fooo</li>
<li class=\\"detected-updated\\" style=\\"abc\\">new</li>
</ul>
"
`)
  })

  it('should diff-rm-list', function() {
    expect(runDetect('diff-rm-list').text).toMatchInlineSnapshot(`
"# readme

-   <p class=\\"detected-updated\\" style=\\"\\">
    fooo
    </p>
"
`)
  })

  it('should diff-rm-list `ast`', function() {
    expect(md2Html(runDetect('diff-rm-list', { wrapType: 'ast' }).ast)).toMatchInlineSnapshot(`
"<h1>readme</h1>
<ul>
<li class=\\"detected-updated\\">fooo</li>
</ul>
"
`)
  })

  it('should diff-rm-head', function() {
    expect(runDetect('diff-rm-head').text).toMatchInlineSnapshot(`
"# readme

block block1

<p class=\\"detected-updated\\" style=\\"\\">

block block2

</p>
"
`)
  })

  it('should diff-rm-head `ast`', function() {
    expect(md2Html(runDetect('diff-rm-head', { wrapType: 'ast' }).ast)).toMatchInlineSnapshot(`
"<h1>readme</h1>
<p>block block1</p>
<p class=\\"detected-updated\\">block block2</p>
"
`)
  })
})

describe('gfm-preset', () => {
  const gfm = require('remark')()
    .use(require('remark-preset-gfm'))
    .use(html)

  it('should normal', function() {
    expect(gfm.stringify(gfm.runSync(runDetect('normal', { wrapType: 'ast' }).ast))).toMatchInlineSnapshot(`
"<h1 id=\\"readme\\"><a href=\\"#readme\\" class=\\"anchor\\"><svg aria-hidden=\\"true\\" class=\\"octicon octicon-link\\" height=\\"16\\" version=\\"1.1\\" viewBox=\\"0 0 16 16\\" width=\\"16\\"><path d=\\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\\"></path></svg></a>readme</h1>
<p class=\\"detected-updated\\">okkkk changed here</p>
<h1 id=\\"readme-2\\"><a href=\\"#readme-2\\" class=\\"anchor\\"><svg aria-hidden=\\"true\\" class=\\"octicon octicon-link\\" height=\\"16\\" version=\\"1.1\\" viewBox=\\"0 0 16 16\\" width=\\"16\\"><path d=\\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\\"></path></svg></a>Readme 2</h1>
<p>fooo</p>
"
`)

    const astold = gfm.runSync(gfm.parse(read('normal/old.md')))
    const astnew = gfm.runSync(gfm.parse(read('normal/new.md')))
    expect(gfm.stringify(detectMarkdown(astold, astnew, { wrapType: 'ast', text: false }).ast)).toMatchInlineSnapshot(`
"<h1 id=\\"readme\\"><a href=\\"#readme\\" class=\\"anchor\\"><svg aria-hidden=\\"true\\" class=\\"octicon octicon-link\\" height=\\"16\\" version=\\"1.1\\" viewBox=\\"0 0 16 16\\" width=\\"16\\"><path d=\\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\\"></path></svg></a>readme</h1>
<p class=\\"detected-updated\\">okkkk changed here</p>
<h1 id=\\"readme-2\\"><a href=\\"#readme-2\\" class=\\"anchor\\"><svg aria-hidden=\\"true\\" class=\\"octicon octicon-link\\" height=\\"16\\" version=\\"1.1\\" viewBox=\\"0 0 16 16\\" width=\\"16\\"><path d=\\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\\"></path></svg></a>Readme 2</h1>
<p>fooo</p>
"
`)
  })
})
