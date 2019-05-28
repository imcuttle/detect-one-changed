/**
 * @file main
 * @author Cuttle Cong
 * @date 2018/10/27
 * @description
 *
 */
const { detectHtml, defaultEqual } = require('../')
const { fixture } = require('./helper')
const rehype = require('rehype')
const fs = require('fs')

function runDetect(name, opts) {
  const oldMd = fs.readFileSync(fixture('html', name, 'old.html'), { encoding: 'utf8' })
  const newMd = fs.readFileSync(fixture('html', name, 'new.html'), { encoding: 'utf8' })

  return detectHtml(oldMd, newMd, opts)
}

function isHeadNode(node) {
  return ['h1', 'h2', 'h3', 'h4'].includes(node && node.tagName && node.tagName.toLowerCase())
}

const linkyEqual = (nodeA, nodeB) => {
  if (isHeadNode(nodeA)) {
    nodeA = Object.assign({}, nodeA, {
      properties: null
    })
  }
  if (isHeadNode(nodeB)) {
    nodeB = Object.assign({}, nodeB, {
      properties: null
    })
  }
  return defaultEqual(nodeA, nodeB)
}

describe('html-detect-changed', function() {
  it('linky-2', () => {
    expect(runDetect('linky-2', { reverse: false, equal: linkyEqual }).text).toMatchInlineSnapshot(`
"<h1 id=\\"temprdldi1oi9cqktemp\\"><a data-type=\\"concept\\" data-key=\\"s2zsvj2mg4e__20190502_1243\\" data-text=\\"[个人][每日站会][当前][c组] 余聪 - 2019-05\\">余聪 - 2019-05</a></h1>
<h2 id=\\"icebox\\">icebox</h2>
<ul>
  <li>[ ] <a href=\\"https://editorjs.io/\\">editor.js</a> 协同编辑</li>
</ul>
<p class=\\"detected-updated\\">asdasdw</p>
"
`)
  })

  it('linky', () => {
    expect(runDetect('linky').text).toMatchInlineSnapshot(`
"<h1 id=\\"tempngzqvc6t478utemp\\"><a data-type=\\"concept\\" data-key=\\"law2e7r95pi__20190309_2357\\" data-text=\\"[测试] 本地测试文档\\">本地测试文档</a></h1>
<p class=\\"detected-updated\\">测试一下lpw</p>
<p><a href=\\"http://localhost:8988/pages/supergraph.html#/index?easyChartdown=_s_dGl0bGU6IOm7mOiupOS-i-WtkApkaXJlY3Rpb246IFRECn5-fgoKIyDov5nkuKrmmK_ms6jph4rmlofmnKwKCuaWueW9ouaWh-acrCBbJHJlY3RdCi0-IOe7hue6v-eureWktHwg6buY6K6k5bCx5piv5pa555qECi0tPiDomZrnur_nrq3lpLR8IOWchuW9ouaWh-acrCAoJGNpcmNsZSkKOi0-IOWtkOmhueebrgo6LT4g5a2Q6aG555uuIDIKLT4g5a2Q6aG555uuIDMKLT4g5ZCO57ut6aG555uuCj0-IOeyl-eureWktHwg6I-x5b2i5paH5pysPCRkaW1hbmQ-Ci0-IOe6v-aWh-acrCBZfCDlnIbop5Lnn6nlvaLmlofmnKwge30gCnVybDogaHR0cDovL3d3dy5iYWlkdS5jb20gfCDnmb7luqbpppbpobUKCiRkaW1hbmQKLT4g57q_5paH5pysIE58IOWFtuS7luaWh-acrAotLSDomZrnur98IOWFtuS7luaWh-acrCAyCj0g57KX57q_fCDlhbbku5bmlofmnKwgMwotPiDlm57liLDoioLngrl8ICRyZWN0CgokY2lyY2xlCi0-IOi9r-W8leeUqHwgPSRyZWN0CgojIOS9v-eUqCB-IOWPr-S7peeUqOadpeabtOWlveeahOS5puWGmeWkmuihjOaWh-acrAotLSDova_lvJXnlKgsIOaYr-S4uuS6huiuqeinhuWbvgp-IOeci-eahOabtOWKoOeahOeugOa0geebtOinggp-IOWQpuWImeWkquWkmumUmeS5seWkjeadgueahAp-IOi_nue6vywg5Lya5a-86Ie05pW05Liq5Zu-5LiN5Y-v6K-7Cg\\"></a></p><div class=\\"fullscreen-container fullscreen-container\\">
  <span class=\\"fullscreen-toggle\\">
    <span class=\\"erp-icon erp-icon-font erp-icon-font-op-common-zoom-in icon-expand\\"></span>
    <span class=\\"erp-icon erp-icon-font erp-icon-font-op-common-zoom-out icon-collapse\\"></span>
  </span>

  <iframe src=\\"http://localhost:8988/pages/supergraph.html#/index?easyChartdown=_s_dGl0bGU6IOm7mOiupOS-i-WtkApkaXJlY3Rpb246IFRECn5-fgoKIyDov5nkuKrmmK_ms6jph4rmlofmnKwKCuaWueW9ouaWh-acrCBbJHJlY3RdCi0-IOe7hue6v-eureWktHwg6buY6K6k5bCx5piv5pa555qECi0tPiDomZrnur_nrq3lpLR8IOWchuW9ouaWh-acrCAoJGNpcmNsZSkKOi0-IOWtkOmhueebrgo6LT4g5a2Q6aG555uuIDIKLT4g5a2Q6aG555uuIDMKLT4g5ZCO57ut6aG555uuCj0-IOeyl-eureWktHwg6I-x5b2i5paH5pysPCRkaW1hbmQ-Ci0-IOe6v-aWh-acrCBZfCDlnIbop5Lnn6nlvaLmlofmnKwge30gCnVybDogaHR0cDovL3d3dy5iYWlkdS5jb20gfCDnmb7luqbpppbpobUKCiRkaW1hbmQKLT4g57q_5paH5pysIE58IOWFtuS7luaWh-acrAotLSDomZrnur98IOWFtuS7luaWh-acrCAyCj0g57KX57q_fCDlhbbku5bmlofmnKwgMwotPiDlm57liLDoioLngrl8ICRyZWN0CgokY2lyY2xlCi0-IOi9r-W8leeUqHwgPSRyZWN0CgojIOS9v-eUqCB-IOWPr-S7peeUqOadpeabtOWlveeahOS5puWGmeWkmuihjOaWh-acrAotLSDova_lvJXnlKgsIOaYr-S4uuS6huiuqeinhuWbvgp-IOeci-eahOabtOWKoOeahOeugOa0geebtOinggp-IOWQpuWImeWkquWkmumUmeS5seWkjeadgueahAp-IOi_nue6vywg5Lya5a-86Ie05pW05Liq5Zu-5LiN5Y-v6K-7Cg&#x26;mode=view\\"></iframe>
</div><p></p>
"
`)
  })

  it('linky [reverse: false]', () => {
    expect(runDetect('linky', { reverse: false }).text).toMatchInlineSnapshot(`
"<h1 id=\\"tempngzqvc6t478utemp\\" class=\\"detected-updated\\"><a data-type=\\"concept\\" data-key=\\"law2e7r95pi__20190309_2357\\" data-text=\\"[测试] 本地测试文档\\">本地测试文档</a></h1>
<p>测试一下lpw</p>
<p><a href=\\"http://localhost:8988/pages/supergraph.html#/index?easyChartdown=_s_dGl0bGU6IOm7mOiupOS-i-WtkApkaXJlY3Rpb246IFRECn5-fgoKIyDov5nkuKrmmK_ms6jph4rmlofmnKwKCuaWueW9ouaWh-acrCBbJHJlY3RdCi0-IOe7hue6v-eureWktHwg6buY6K6k5bCx5piv5pa555qECi0tPiDomZrnur_nrq3lpLR8IOWchuW9ouaWh-acrCAoJGNpcmNsZSkKOi0-IOWtkOmhueebrgo6LT4g5a2Q6aG555uuIDIKLT4g5a2Q6aG555uuIDMKLT4g5ZCO57ut6aG555uuCj0-IOeyl-eureWktHwg6I-x5b2i5paH5pysPCRkaW1hbmQ-Ci0-IOe6v-aWh-acrCBZfCDlnIbop5Lnn6nlvaLmlofmnKwge30gCnVybDogaHR0cDovL3d3dy5iYWlkdS5jb20gfCDnmb7luqbpppbpobUKCiRkaW1hbmQKLT4g57q_5paH5pysIE58IOWFtuS7luaWh-acrAotLSDomZrnur98IOWFtuS7luaWh-acrCAyCj0g57KX57q_fCDlhbbku5bmlofmnKwgMwotPiDlm57liLDoioLngrl8ICRyZWN0CgokY2lyY2xlCi0-IOi9r-W8leeUqHwgPSRyZWN0CgojIOS9v-eUqCB-IOWPr-S7peeUqOadpeabtOWlveeahOS5puWGmeWkmuihjOaWh-acrAotLSDova_lvJXnlKgsIOaYr-S4uuS6huiuqeinhuWbvgp-IOeci-eahOabtOWKoOeahOeugOa0geebtOinggp-IOWQpuWImeWkquWkmumUmeS5seWkjeadgueahAp-IOi_nue6vywg5Lya5a-86Ie05pW05Liq5Zu-5LiN5Y-v6K-7Cg\\"></a></p><div class=\\"fullscreen-container fullscreen-container\\">
  <span class=\\"fullscreen-toggle\\">
    <span class=\\"erp-icon erp-icon-font erp-icon-font-op-common-zoom-in icon-expand\\"></span>
    <span class=\\"erp-icon erp-icon-font erp-icon-font-op-common-zoom-out icon-collapse\\"></span>
  </span>

  <iframe src=\\"http://localhost:8988/pages/supergraph.html#/index?easyChartdown=_s_dGl0bGU6IOm7mOiupOS-i-WtkApkaXJlY3Rpb246IFRECn5-fgoKIyDov5nkuKrmmK_ms6jph4rmlofmnKwKCuaWueW9ouaWh-acrCBbJHJlY3RdCi0-IOe7hue6v-eureWktHwg6buY6K6k5bCx5piv5pa555qECi0tPiDomZrnur_nrq3lpLR8IOWchuW9ouaWh-acrCAoJGNpcmNsZSkKOi0-IOWtkOmhueebrgo6LT4g5a2Q6aG555uuIDIKLT4g5a2Q6aG555uuIDMKLT4g5ZCO57ut6aG555uuCj0-IOeyl-eureWktHwg6I-x5b2i5paH5pysPCRkaW1hbmQ-Ci0-IOe6v-aWh-acrCBZfCDlnIbop5Lnn6nlvaLmlofmnKwge30gCnVybDogaHR0cDovL3d3dy5iYWlkdS5jb20gfCDnmb7luqbpppbpobUKCiRkaW1hbmQKLT4g57q_5paH5pysIE58IOWFtuS7luaWh-acrAotLSDomZrnur98IOWFtuS7luaWh-acrCAyCj0g57KX57q_fCDlhbbku5bmlofmnKwgMwotPiDlm57liLDoioLngrl8ICRyZWN0CgokY2lyY2xlCi0-IOi9r-W8leeUqHwgPSRyZWN0CgojIOS9v-eUqCB-IOWPr-S7peeUqOadpeabtOWlveeahOS5puWGmeWkmuihjOaWh-acrAotLSDova_lvJXnlKgsIOaYr-S4uuS6huiuqeinhuWbvgp-IOeci-eahOabtOWKoOeahOeugOa0geebtOinggp-IOWQpuWImeWkquWkmumUmeS5seWkjeadgueahAp-IOi_nue6vywg5Lya5a-86Ie05pW05Liq5Zu-5LiN5Y-v6K-7Cg&#x26;mode=view\\"></iframe>
</div><p></p>
"
`)
  })

  it('linky [reverse: false, equal]', () => {
    expect(
      runDetect('linky', {
        reverse: false,
        equal: (a, b) => {
          return a.value === b.value
        }
      }).text
    ).toMatchInlineSnapshot(`
"<h1 id=\\"tempngzqvc6t478utemp\\"><a data-type=\\"concept\\" data-key=\\"law2e7r95pi__20190309_2357\\" data-text=\\"[测试] 本地测试文档\\">本地测试文档</a></h1>
<p class=\\"detected-updated\\">测试一下lpw</p>
<p><a href=\\"http://localhost:8988/pages/supergraph.html#/index?easyChartdown=_s_dGl0bGU6IOm7mOiupOS-i-WtkApkaXJlY3Rpb246IFRECn5-fgoKIyDov5nkuKrmmK_ms6jph4rmlofmnKwKCuaWueW9ouaWh-acrCBbJHJlY3RdCi0-IOe7hue6v-eureWktHwg6buY6K6k5bCx5piv5pa555qECi0tPiDomZrnur_nrq3lpLR8IOWchuW9ouaWh-acrCAoJGNpcmNsZSkKOi0-IOWtkOmhueebrgo6LT4g5a2Q6aG555uuIDIKLT4g5a2Q6aG555uuIDMKLT4g5ZCO57ut6aG555uuCj0-IOeyl-eureWktHwg6I-x5b2i5paH5pysPCRkaW1hbmQ-Ci0-IOe6v-aWh-acrCBZfCDlnIbop5Lnn6nlvaLmlofmnKwge30gCnVybDogaHR0cDovL3d3dy5iYWlkdS5jb20gfCDnmb7luqbpppbpobUKCiRkaW1hbmQKLT4g57q_5paH5pysIE58IOWFtuS7luaWh-acrAotLSDomZrnur98IOWFtuS7luaWh-acrCAyCj0g57KX57q_fCDlhbbku5bmlofmnKwgMwotPiDlm57liLDoioLngrl8ICRyZWN0CgokY2lyY2xlCi0-IOi9r-W8leeUqHwgPSRyZWN0CgojIOS9v-eUqCB-IOWPr-S7peeUqOadpeabtOWlveeahOS5puWGmeWkmuihjOaWh-acrAotLSDova_lvJXnlKgsIOaYr-S4uuS6huiuqeinhuWbvgp-IOeci-eahOabtOWKoOeahOeugOa0geebtOinggp-IOWQpuWImeWkquWkmumUmeS5seWkjeadgueahAp-IOi_nue6vywg5Lya5a-86Ie05pW05Liq5Zu-5LiN5Y-v6K-7Cg\\"></a></p><div class=\\"fullscreen-container fullscreen-container\\">
  <span class=\\"fullscreen-toggle\\">
    <span class=\\"erp-icon erp-icon-font erp-icon-font-op-common-zoom-in icon-expand\\"></span>
    <span class=\\"erp-icon erp-icon-font erp-icon-font-op-common-zoom-out icon-collapse\\"></span>
  </span>

  <iframe src=\\"http://localhost:8988/pages/supergraph.html#/index?easyChartdown=_s_dGl0bGU6IOm7mOiupOS-i-WtkApkaXJlY3Rpb246IFRECn5-fgoKIyDov5nkuKrmmK_ms6jph4rmlofmnKwKCuaWueW9ouaWh-acrCBbJHJlY3RdCi0-IOe7hue6v-eureWktHwg6buY6K6k5bCx5piv5pa555qECi0tPiDomZrnur_nrq3lpLR8IOWchuW9ouaWh-acrCAoJGNpcmNsZSkKOi0-IOWtkOmhueebrgo6LT4g5a2Q6aG555uuIDIKLT4g5a2Q6aG555uuIDMKLT4g5ZCO57ut6aG555uuCj0-IOeyl-eureWktHwg6I-x5b2i5paH5pysPCRkaW1hbmQ-Ci0-IOe6v-aWh-acrCBZfCDlnIbop5Lnn6nlvaLmlofmnKwge30gCnVybDogaHR0cDovL3d3dy5iYWlkdS5jb20gfCDnmb7luqbpppbpobUKCiRkaW1hbmQKLT4g57q_5paH5pysIE58IOWFtuS7luaWh-acrAotLSDomZrnur98IOWFtuS7luaWh-acrCAyCj0g57KX57q_fCDlhbbku5bmlofmnKwgMwotPiDlm57liLDoioLngrl8ICRyZWN0CgokY2lyY2xlCi0-IOi9r-W8leeUqHwgPSRyZWN0CgojIOS9v-eUqCB-IOWPr-S7peeUqOadpeabtOWlveeahOS5puWGmeWkmuihjOaWh-acrAotLSDova_lvJXnlKgsIOaYr-S4uuS6huiuqeinhuWbvgp-IOeci-eahOabtOWKoOeahOeugOa0geebtOinggp-IOWQpuWImeWkquWkmumUmeS5seWkjeadgueahAp-IOi_nue6vywg5Lya5a-86Ie05pW05Liq5Zu-5LiN5Y-v6K-7Cg&#x26;mode=view\\"></iframe>
</div><p></p>
"
`)
  })

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
