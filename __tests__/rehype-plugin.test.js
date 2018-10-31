/**
 * @file rehype
 * @author Cuttle Cong
 * @date 2018/10/31
 * @description
 */

const html = require('../rehype-plugin')
const { fixture, read } = require('./helper')

const fakePath = fixture('fake.md')

describe('mdx - use rehype-plugin', function() {
  const mdx = require('@mdx-js/mdx')
  const old = `
import T from './T'

<T/>

## HaHa`
  const newMd = `
import T from './T'

<T/>

## HaHahh`

  beforeEach(() => {
    html.cache.clear()
  })
  it('should mdx', () => {
    const rlt = mdx.sync(old, {
      filepath: fakePath,
      hastPlugins: [html]
    })
    expect(rlt).toMatchInlineSnapshot(`
"import T from './T'

export default ({components, ...props}) => <MDXTag name=\\"wrapper\\"  components={components}>
<T/>
<MDXTag name=\\"h2\\" components={components}>{\`HaHa\`}</MDXTag></MDXTag>"
`)
    expect(html.cache.has(fakePath)).toBeTruthy()
  })

  it('should mdx diff', function() {
    mdx.sync(old, {
      filepath: fakePath,
      hastPlugins: [html]
    })

    expect(
      mdx.sync(newMd, {
        filepath: fakePath,
        hastPlugins: [html]
      })
    ).toMatchInlineSnapshot(`
"import T from './T'

export default ({components, ...props}) => <MDXTag name=\\"wrapper\\"  components={components}>
<T/>
<MDXTag name=\\"h2\\" components={components} props={{\\"className\\":\\"detected-updated\\"}}>{\`HaHahh\`}</MDXTag></MDXTag>"
`)
  })

  it('should mdx diff `create`', function() {
    const htmlPlugin = html.create()
    mdx.sync(
      `
import T from './t'

<T/>
`,
      {
        filepath: fakePath,
        hastPlugins: [htmlPlugin]
      }
    )

    expect(
      mdx.sync(
        `
import T from './t'

<T/>

# 2222
`,
        {
          filepath: fakePath,
          hastPlugins: [htmlPlugin]
        }
      )
    ).toMatchInlineSnapshot(`
"import T from './t'

export default ({components, ...props}) => <MDXTag name=\\"wrapper\\"  components={components}>
<T/>
<MDXTag name=\\"h1\\" components={components} props={{\\"className\\":\\"detected-updated\\"}}>{\`2222\`}</MDXTag></MDXTag>"
`)
  })

  function mdxDiff(name) {
    const plugin = html.create()
    mdx.sync(read(`rehype-plugin/${name}/old.md`), {
      filepath: fakePath,
      hastPlugins: [plugin]
    })

    return mdx.sync(read(`rehype-plugin/${name}/new.md`), {
      filepath: fakePath,
      hastPlugins: [plugin]
    })
  }

  it('should mdx diff `tight-list`', function() {
    expect(mdxDiff('tight-list')).toMatchInlineSnapshot(`
"

export default ({components, ...props}) => <MDXTag name=\\"wrapper\\"  components={components}><MDXTag name=\\"ul\\" components={components}>
<MDXTag name=\\"li\\" components={components} parentName=\\"ul\\"><MDXTag name=\\"a\\" components={components} parentName=\\"li\\" props={{\\"href\\":\\"#installation\\"}}>{\`Installation\`}</MDXTag></MDXTag>
<MDXTag name=\\"li\\" components={components} parentName=\\"ul\\"><MDXTag name=\\"a\\" components={components} parentName=\\"li\\" props={{\\"href\\":\\"#usage\\"}}>{\`Usage\`}</MDXTag></MDXTag>
<MDXTag name=\\"li\\" components={components} parentName=\\"ul\\"><MDXTag name=\\"a\\" components={components} parentName=\\"li\\" props={{\\"href\\":\\"#api\\"}}>{\`API\`}</MDXTag></MDXTag>
<MDXTag name=\\"li\\" components={components} parentName=\\"ul\\"><MDXTag name=\\"a\\" components={components} parentName=\\"li\\" props={{\\"href\\":\\"#contributing\\"}}>{\`Contributing\`}</MDXTag></MDXTag>
<MDXTag name=\\"li\\" components={components} parentName=\\"ul\\"><MDXTag name=\\"a\\" components={components} parentName=\\"li\\" props={{\\"href\\":\\"#authors\\",\\"className\\":\\"detected-updated\\"}}>{\`Authorsx\`}</MDXTag></MDXTag>
<MDXTag name=\\"li\\" components={components} parentName=\\"ul\\"><MDXTag name=\\"a\\" components={components} parentName=\\"li\\" props={{\\"href\\":\\"#license\\"}}>{\`License\`}</MDXTag></MDXTag>
</MDXTag></MDXTag>"
`)
  })
})
