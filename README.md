# detect-one-changed

[![Build status](https://img.shields.io/travis/imcuttle/detect-one-changed/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/detect-one-changed)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/detect-one-changed.svg?style=flat-square)](https://codecov.io/github/imcuttle/detect-one-changed?branch=master)
[![NPM version](https://img.shields.io/npm/v/detect-one-changed.svg?style=flat-square)](https://www.npmjs.com/package/detect-one-changed)
[![NPM Downloads](https://img.shields.io/npm/dm/detect-one-changed.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/detect-one-changed)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> Detect first changed html and markdown between old text and the new

![](https://i.loli.net/2018/10/28/5bd58a95c6b7d.gif)

[Live Demo](https://imcuttle.github.io/detect-one-changed/)

## Table of Contents

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Related](#related)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)

<!-- tocstop -->

## Installation

```bash
npm install detect-one-changed
# or use yarn
yarn add detect-one-changed
```

## Usage

### Use it as an package

```javascript
const { detectMarkdown } = require('detect-one-changed')

detectMarkdown('abcd\n\n# old', 'abcd\n\n# new').text
// => 'abcd\n\n<p class="detected-updated" style="">\n\n# new\n\n</p>\n'
```

```javascript
const { detectMarkdown } = require('detect-one-changed')
const remark = require('remark')
const html = require('remark-html')

remark()
  .use(html)
  .stringify(detectMarkdown('abcd\n\n# old', 'abcd\n\n# new', { wrapType: 'ast' }).ast)
// => '<p>abcd</p>\n<h1 class="detected-updated">new</h1>\n'
```

```javascript
const { detectHtml } = require('detect-one-changed')

detectHtml('<p>old</p>', '<p class="new-cls">new</p>').text
// => '<p class="detected-updated new-cls">new</p>'
```

### Use it as webpack loader

More information please see [loader](./docs/loader.md)'s document and [webpack example](./examples/webpack)

- Step one: (`webpack.config.js`)

  ```javascript
  // ...
  devServer: {
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          process.env.NODE_ENV !== 'production' && {
            name: 'detect-one-changed/md-loader',
            options: { returnType: 'text' }
          }
          // { name: 'some-md-to-html-loader' },
        ].filter(Boolean)
      }
    ]
  }
  // ...
  ```

- Step two (set up HMR in browser)

  ```javascript
  function start() {
    document.querySelector('.markdown-body').innerHTML = require('./path/to/some.md')
  }

  if (module.hot) {
    module.hot.accept('./path/to/some.md', () => {
      // Injects highlight css text in <style/>
      require('!style-loader!css-loader!detect-one-changed/style.css')
      start()

      const node = document.querySelector('.markdown-body .detected-updated')
      if (node) {
        // Scroll to updated node
        node.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }
  ```

- Step three

  1. `npm install webpack webpack-dev-server -D`
  2. `webpack-dev-server`

### Use in [MDX](https://github.com/mdx-js/mdx)

- `webpack.config.js`
  ```javascript
  ...
    {
      use: /\.mdx?$/,
      loaders: [
        {
          name: '@mdx-js/mdx-loader',
          options: {
            mdPlugin: [require('detect-one-changed/remark-plugin')]
          }
        }
      ]
    }
  ```

* `src/index.js` (entry)

  ```javascript
  import * as React from 'react'
  import { render } from 'react-dom'

  function start() {
    const Markdown = require('./markdown.mdx').default
    render(<Markdown />, document.querySelector('.markdown-body'))
  }

  start()

  if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept(['./markdown.mdx'], () => {
      require('!style-loader!css-loader!detect-one-changed/style.css')
      start()

      const node = document.querySelector('.detected-updated')
      if (node) {
        node.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }
  ```

## API

[See API](./docs/api.md)

## Related

- [live-markd](https://github.com/imcuttle/live-markd) - 📝Github Favorite Markdown preview with live rendering & location and highlight changed block.

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com">moyuyc95@gmail.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟
