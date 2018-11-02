/**
 * @file reverseAST
 * @author Cuttle Cong
 * @date 2018/11/2
 * @description
 */

const remark = require('remark')
const reverseAST = require('../lib/reverseAST')

describe('reverseAST', function() {
  it('should reverseAST', () => {
    let input = [
      '# Root\n',
      '- Father',
      '  - Bob',
      '    - July',
      '  - John',
      '  - Kiyi\n',
      '- Mother',
      '  - Bob',
      '    - July',
      '    - Kil',
      '  - John',
      '  - Kiyi'
    ].join('\n')
    const ast = remark()
      .data('settings', { position: false })
      .parse(input)

    input = remark().stringify(ast)

    reverseAST(ast)

    expect(ast).toMatchSnapshot()

    expect(remark().stringify(reverseAST(ast))).toBe(input)
  })
})
