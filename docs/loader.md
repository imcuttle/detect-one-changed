## Use `detect-one-changed` in webpack development environment

### Loader

- `webpack.config.js`

```javascript
...
  loaders: [
    { name: 'detect-one-changed/md-loader', options: {} }
  ]
...
  loaders: [
    { name: 'detect-one-changed/html-loader' }
  ]
```

#### Options

`md-loader` extends `detectMarkdown`'s options in [api document](./api.md)

`html-loader` extends `detectHtml`'s options in [api document](./api.md)

##### `returnType`

Which result should be returned.

- Type: `('state'|'node'|'ast'|'text'|'all')`
  - `all` means returns all data
  - `state` means returns `data.state`, others in the same way

See `detectMarkdown` and `detectHtml` methods' returns in [api document](./api.md)
