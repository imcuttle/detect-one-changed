/**
 * @file loader
 * @author Cuttle Cong
 * @date 2018/10/30
 * @description
 * @jest-environment node
 */
const fs = require('fs')
const nps = require('path')
const compiler = require('./compiler')
const { fixture } = require('./helper')
const { cache: fileContents } = require('../md-loader')

const read = name => fs.readFileSync(fixture(name), { encoding: 'utf8' })

describe('md-loader', function() {
  it('should loader works well by default', done => {
    compiler('loader/first.md', 'md')
      .then(stats => {
        const output = stats.toJson().modules[0].source
        expect(output).toMatchInlineSnapshot(
          `"module.exports = {\\"state\\":null,\\"node\\":null,\\"text\\":\\"# first render me\\\\n\\\\nwow wow\\\\n\\",\\"ast\\":{\\"type\\":\\"root\\",\\"children\\":[{\\"type\\":\\"heading\\",\\"depth\\":1,\\"children\\":[{\\"type\\":\\"text\\",\\"value\\":\\"first render me\\",\\"position\\":{\\"start\\":{\\"line\\":1,\\"column\\":3,\\"offset\\":2},\\"end\\":{\\"line\\":1,\\"column\\":18,\\"offset\\":17},\\"indent\\":[]}}],\\"position\\":{\\"start\\":{\\"line\\":1,\\"column\\":1,\\"offset\\":0},\\"end\\":{\\"line\\":1,\\"column\\":18,\\"offset\\":17},\\"indent\\":[]}},{\\"type\\":\\"paragraph\\",\\"children\\":[{\\"type\\":\\"text\\",\\"value\\":\\"wow wow\\",\\"position\\":{\\"start\\":{\\"line\\":3,\\"column\\":1,\\"offset\\":19},\\"end\\":{\\"line\\":3,\\"column\\":8,\\"offset\\":26},\\"indent\\":[]}}],\\"position\\":{\\"start\\":{\\"line\\":3,\\"column\\":1,\\"offset\\":19},\\"end\\":{\\"line\\":3,\\"column\\":8,\\"offset\\":26},\\"indent\\":[]}}],\\"position\\":{\\"start\\":{\\"line\\":1,\\"column\\":1,\\"offset\\":0},\\"end\\":{\\"line\\":4,\\"column\\":1,\\"offset\\":27}}}}"`
        )
        done()
      })
      .catch(done)
  })

  it('should loader works well by default `returnType = text`', done => {
    compiler('loader/first.md', 'md', { returnType: 'text' })
      .then(stats => {
        const output = stats.toJson().modules[0].source
        expect(output).toMatchInlineSnapshot(`"module.exports = \\"# first render me\\\\n\\\\nwow wow\\\\n\\""`)
        done()
      })
      .catch(done)
  })

  it('should loader works well by default `returnType = ast`', done => {
    compiler('loader/first.md', 'md', { returnType: 'ast' })
      .then(stats => {
        const output = stats.toJson().modules[0].source
        expect(output).toMatchInlineSnapshot(
          `"module.exports = {\\"type\\":\\"root\\",\\"children\\":[{\\"type\\":\\"heading\\",\\"depth\\":1,\\"children\\":[{\\"type\\":\\"text\\",\\"value\\":\\"first render me\\",\\"position\\":{\\"start\\":{\\"line\\":1,\\"column\\":3,\\"offset\\":2},\\"end\\":{\\"line\\":1,\\"column\\":18,\\"offset\\":17},\\"indent\\":[]}}],\\"position\\":{\\"start\\":{\\"line\\":1,\\"column\\":1,\\"offset\\":0},\\"end\\":{\\"line\\":1,\\"column\\":18,\\"offset\\":17},\\"indent\\":[]}},{\\"type\\":\\"paragraph\\",\\"children\\":[{\\"type\\":\\"text\\",\\"value\\":\\"wow wow\\",\\"position\\":{\\"start\\":{\\"line\\":3,\\"column\\":1,\\"offset\\":19},\\"end\\":{\\"line\\":3,\\"column\\":8,\\"offset\\":26},\\"indent\\":[]}}],\\"position\\":{\\"start\\":{\\"line\\":3,\\"column\\":1,\\"offset\\":19},\\"end\\":{\\"line\\":3,\\"column\\":8,\\"offset\\":26},\\"indent\\":[]}}],\\"position\\":{\\"start\\":{\\"line\\":1,\\"column\\":1,\\"offset\\":0},\\"end\\":{\\"line\\":4,\\"column\\":1,\\"offset\\":27}}}"`
        )
        done()
      })
      .catch(done)
  })

  it('should loader works well by default `returnType = all`', done => {
    Promise.all([compiler('loader/first.md', 'md', { returnType: 'all' }), compiler('loader/first.md', 'md')])
      .then(([stats, defaultStats]) => {
        const output = stats.toJson().modules[0].source
        const defaultOutput = defaultStats.toJson().modules[0].source
        expect(output).toBe(defaultOutput)
        done()
      })
      .catch(done)
  })

  it('should loader works well by default `returnType = node`', done => {
    compiler('loader/first.md', 'md', { returnType: 'node' })
      .then(stats => {
        const output = stats.toJson().modules[0].source
        expect(output).toMatchInlineSnapshot(`"module.exports = null"`)
        done()
      })
      .catch(done)
  })

  describe('Diff in md loader', function() {
    function compilerDiff(name, opts) {
      const newName = nps.join('markdown', name, 'new.md')
      fileContents.set(fixture(newName), read(nps.join('markdown', name, 'old.md')))
      return compiler(newName, 'md', opts)
    }

    beforeEach(() => {
      fileContents.clear()
    })

    it('should loader works well by default `returnType = node` when updated', done => {
      compilerDiff('diff-list', { returnType: 'node' })
        .then(stats => {
          const output = stats.toJson().modules[0].source
          expect(output).toMatchInlineSnapshot(
            `"module.exports = {\\"type\\":\\"paragraph\\",\\"children\\":[{\\"type\\":\\"text\\",\\"value\\":\\"fooo\\",\\"position\\":{\\"start\\":{\\"line\\":3,\\"column\\":3,\\"offset\\":10},\\"end\\":{\\"line\\":3,\\"column\\":7,\\"offset\\":14},\\"indent\\":[]}}],\\"position\\":{\\"start\\":{\\"line\\":3,\\"column\\":3,\\"offset\\":10},\\"end\\":{\\"line\\":3,\\"column\\":7,\\"offset\\":14},\\"indent\\":[]}}"`
          )
          done()
        })
        .catch(done)
    })

    it('should loader works well by default `returnType = node, wrapType = ast` when updated', done => {
      compilerDiff('diff-list', { returnType: 'node', wrapType: 'ast' })
        .then(stats => {
          const output = stats.toJson().modules[0].source
          expect(output).toMatchInlineSnapshot(
            `"module.exports = {\\"type\\":\\"listItem\\",\\"spread\\":false,\\"checked\\":null,\\"children\\":[{\\"type\\":\\"paragraph\\",\\"children\\":[{\\"type\\":\\"text\\",\\"value\\":\\"fooo\\",\\"position\\":{\\"start\\":{\\"line\\":3,\\"column\\":3,\\"offset\\":10},\\"end\\":{\\"line\\":3,\\"column\\":7,\\"offset\\":14},\\"indent\\":[]}}],\\"position\\":{\\"start\\":{\\"line\\":3,\\"column\\":3,\\"offset\\":10},\\"end\\":{\\"line\\":3,\\"column\\":7,\\"offset\\":14},\\"indent\\":[]}}],\\"position\\":{\\"start\\":{\\"line\\":3,\\"column\\":1,\\"offset\\":8},\\"end\\":{\\"line\\":3,\\"column\\":7,\\"offset\\":14},\\"indent\\":[]},\\"data\\":{\\"hProperties\\":{\\"className\\":[\\"detected-updated\\"]}}}"`
          )
          done()
        })
        .catch(done)
    })

    it('should loader works well by default `returnType = text, wrapType = html, wrapTag = i` when updated', done => {
      compilerDiff('diff-list', { returnType: 'text', wrapType: 'html', wrapTag: 'i' })
        .then(stats => {
          const output = stats.toJson().modules[0].source
          expect(output).toMatchInlineSnapshot(
            `"module.exports = \\"readme\\\\n\\\\n-   <i class=\\\\\\"detected-updated\\\\\\" style=\\\\\\"\\\\\\">\\\\n    fooo\\\\n    </i>\\\\n\\\\nasdasd\\\\n\\""`
          )
          done()
        })
        .catch(done)
    })
  })
})
