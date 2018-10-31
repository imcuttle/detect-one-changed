/**
 * Detect first changed html and markdown between old text and new
 * @author imcuttle
 */

type AST = any

type DetectOptions = {
  reverse?: boolean
}
type DetectedState = {
  node: AST
  paths: number[]
  parents: AST[]
}
type DetectTextOptions = {
  ast?: boolean
  text?: boolean
  style?: string
  position?: boolean
  className?: string
}
type DetectMarkdownOptions = DetectTextOptions & {
  wrapType?: 'ast' | 'html'
  wrapTag?: string
}
type DetectedResult = {
  text?: string
  ast?: AST
  state?: DetectedState
  node?: AST
}

declare const detectOneChanged: {
  detectAst: (oldAst: AST, newAst: AST, opt?: DetectOptions) => null | DetectedState
  detectHtml: (oldHtml: AST | string, newHtml: AST | string, opt?: DetectTextOptions) => DetectedResult
  detectMarkdown: (oldMarkdown: AST | string, oldMarkdown: AST | string, opt?: DetectMarkdownOptions) => DetectedResult
}

export = detectOneChanged
