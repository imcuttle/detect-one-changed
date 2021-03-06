## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

- [detectAst](#detectast)
  - [Parameters](#parameters)
- [detectMarkdown](#detectmarkdown)
  - [Parameters](#parameters-1)
- [detectHtml](#detecthtml)
  - [Parameters](#parameters-2)
  - [Examples](#examples)
- [Remark](#remark)
- [AST](#ast)
- [Rehype](#rehype)
- [DetectResult](#detectresult)
  - [Parameters](#parameters-3)
- [DetectOptions](#detectoptions)
  - [Parameters](#parameters-4)
- [DetectedState](#detectedstate)
  - [Parameters](#parameters-5)
- [DetectTextOptions](#detecttextoptions)
  - [Parameters](#parameters-6)
- [DetectHtmlOptions](#detecthtmloptions)
  - [Parameters](#parameters-7)
- [DetectMarkdownOptions](#detectmarkdownoptions)
  - [Parameters](#parameters-8)
  - [Examples](#examples-1)
- [reverseAST](#reverseast)
  - [Parameters](#parameters-9)

### detectAst

Find changed one node from AST

#### Parameters

- `oldAst` **[AST](#ast)**
- `newAst` **[AST](#ast)**
- `options` **[DetectOptions](#detectoptions)** (optional, default `{}`)
  - `options.reverse` (optional, default `true`)
  - `options.equal` (optional, default `defaultEqual`)

Returns **(null | [DetectedState](#detectedstate))**

### detectMarkdown

Detect markdown updating

#### Parameters

- `oldMarkdown` **([AST](#ast) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))**
- `newMarkdown` **([AST](#ast) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))**
- `options` **[DetectMarkdownOptions](#detectmarkdownoptions)** (optional, default `{}`)
  - `options.wrapTag` (optional, default `'div'`)
  - `options.wrapType` (optional, default `'html'`)
  - `options.ast` (optional, default `true`)
  - `options.text` (optional, default `true`)
  - `options.reverse` (optional, default `true`)
  - `options.style` (optional, default `''`)
  - `options.className` (optional, default `'detected-updated'`)
  - `options.position` (optional, default `true`)
  - `options.remark` (optional, default `require('remark')()`)
  - `options.equal`

Returns **any** DetectResult

### detectHtml

Detect html updating

#### Parameters

- `oldHtml` **([AST](#ast) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))**
- `newHtml` **([AST](#ast) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))**
- `options` **[DetectHtmlOptions](#detecthtmloptions)** (optional, default `{}`)
  - `options.ast` (optional, default `true`)
  - `options.text` (optional, default `true`)
  - `options.reverse` (optional, default `true`)
  - `options.position` (optional, default `true`)
  - `options.style` (optional, default `''`)
  - `options.className` (optional, default `'detected-updated'`)
  - `options.rehype` (optional, default `require('rehype')()`)
  - `options.equal`

#### Examples

```javascript
const { detectHtml } = require('detect-one-changed')

detectHtml('<p>old</p>', '<p class="new-cls">new</p>').text
// => '<p class="detected-updated new-cls">new</p>'
```

Returns **[DetectResult](#detectresult)**

### Remark

- **See: [remark](https://github.com/remarkjs/remark) - Markdown processor powered by plugins**

Type: {}

### AST

- **See: [Markdown AST](https://github.com/syntax-tree/mdast)**
- **See: [HTML AST](https://github.com/syntax-tree/hast)**
- **See: [remark](https://github.com/remarkjs/remark) - Markdown processor on MDAST**
- **See: [rehype](https://github.com/rehypejs/rehype) - Markdown processor on HAST**

Type: {}

### Rehype

- **See: [rehype](https://github.com/rehypejs/rehype) - HTML processor powered by plugins**

Type: {}

### DetectResult

Type: {}

#### Parameters

- `text` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**
- `ast` **[AST](#ast)** Be Injected `className` and `style`'s AST
- `state` **[DetectedState](#detectedstate)**
- `node` **[AST](#ast)** Real updated AST node

### DetectOptions

Type: {}

#### Parameters

- `reverse` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** (optional, default `true`)
- `equal` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** (optional, default `require('lodash.isequalwith')`)

### DetectedState

Type: {}

#### Parameters

- `node` **[AST](#ast)** Founded node
- `paths` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>** The child indexes' track when traversing AST for finding `node`
- `parents` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[AST](#ast)>** The parents' track when traversing AST for finding `node`

### DetectTextOptions

**Extends DetectOptions**

Type: {}

#### Parameters

- `ast` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Should returns `ast` (optional, default `true`)
- `text` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Should returns `text` (optional, default `true`)
- `style` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Injecting style in changed node, e.g: `color: red;`
- `position` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Should AST's node carry with position information. (optional, default `true`)
- `className` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Injecting class in changed node (optional, default `'detected-updated'`)

### DetectHtmlOptions

**Extends DetectTextOptions**

Type: {}

#### Parameters

- `rehype` **[Rehype](#rehype)** a Rehype instance (for parsing string to HAST) (optional, default `require('rehype')()`)

### DetectMarkdownOptions

**Extends DetectTextOptions**

Type: {}

#### Parameters

- `remark` **[Remark](#remark)** a Remark instance (for parsing string to MDAST) (optional, default `require('remark')()`)
- `wrapType` **(`"html"` \| `"ast"`)** Type of wrapping changed node. <br/>
  1\. `html`: Wrapped by html element. e.g. `# updated` be wrapped as `<p class="detected-updated">\n\n# updated\n\n</p>` <br/>
  2\. `ast`: Wrapped by ast. It's not perceptible in `text`, the effects are work on `ast` (optional, default `'html'`)
- `wrapTag` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The wrapped tagName when `wrapType` is `'html'` (optional, default `'div'`)

#### Examples

```javascript
const { detectMarkdown } = require('detect-one-changed')

detectMarkdown('# old', '# new').text
// => '<p class="detected-updated" style="">\n\n# new\n\n</p>\n'
```

```javascript
const { detectMarkdown } = require('detect-one-changed')
const remark = require('remark')
const html = require('remark-html')

remark()
  .use(html)
  .stringify(detectMarkdown('# old', '# new', { wrapType: 'ast' }).ast)
// => '<h1 class="detected-updated">new</h1>\n'
```

### reverseAST

reverse AST

#### Parameters

- `ast` {AST}

Returns **any** reversedAst {AST}
