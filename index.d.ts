/**
 * Detect first changed html and markdown between old text and new
 * @author imcuttle
 */

type AST = any

type DetectOptions = {
  reverse?: boolean
  equal?: (a, b) => boolean
}
type DetectedState = {
  node: AST
  paths: number[]
  parents: AST[]
}
type DetectTextOptions = DetectOptions & {
  ast?: boolean
  text?: boolean
  style?: string
  position?: boolean
  className?: string
}

type Unified = Function

type DetectMarkdownOptions = DetectTextOptions & {
  wrapType?: 'ast' | 'html'
  wrapTag?: string
  remark?: Unified
}

type DetectHtmlOptions = DetectTextOptions & {
  rehype?: Unified
}
type DetectedResult = {
  text?: string
  ast?: AST
  state?: DetectedState
  node?: AST
}

declare const detectOneChanged: {
  reverseAST: (ast: AST) => AST
  detectAst: (oldAst: AST, newAst: AST, opt?: DetectOptions) => null | DetectedState
  detectHtml: (oldHtml: AST | string, newHtml: AST | string, opt?: DetectHtmlOptions) => DetectedResult
  detectMarkdown: (oldMarkdown: AST | string, oldMarkdown: AST | string, opt?: DetectMarkdownOptions) => DetectedResult
  defaultEqual: (a, b) => boolean
}

export = detectOneChanged
