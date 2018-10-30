# detect-one-changed

[![Build status](https://img.shields.io/travis/imcuttle/detect-one-changed/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/detect-one-changed)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/detect-one-changed.svg?style=flat-square)](https://codecov.io/github/imcuttle/detect-one-changed?branch=master)
[![NPM version](https://img.shields.io/npm/v/detect-one-changed.svg?style=flat-square)](https://www.npmjs.com/package/detect-one-changed)
[![NPM Downloads](https://img.shields.io/npm/dm/detect-one-changed.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/detect-one-changed)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> Detect first changed html and markdown between old text and new

## Table of Contents

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
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

```javascript
const { detectHtml } = require('detect-one-changed')

detectHtml('<p>old</p>', '<p class="new-cls">new</p>').text
// => '<p class="detected-updated new-cls">new</p>'
```

## API

[See API](./docs/api.md)

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
