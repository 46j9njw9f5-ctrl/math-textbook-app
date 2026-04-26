export type StumbleKey =
  | 'meaning'
  | 'timing'
  | 'algebra'
  | 'visual'
  | 'application'
  | 'reason'

export type FormulaItem = {
  label: string
  latex: string
  meaning: string
  derivation: string
}

export type ExampleStep = {
  latex: string
  explanation: string
}

export type WhyChain = {
  why: string
  meaning: string
  usage: string
}

export type LessonPage = {
  id: string
  title: string
  catchCopy: string
  conceptMeaning: string
  whyLearn: string
  formulas: FormulaItem[]
  useCases: string[]
  misconceptions: string[]
  exampleTitle: string
  exampleProblem: string
  exampleSteps: ExampleStep[]
  intuition: string
  rigor: string
  whyChain: WhyChain
  stumbleGuides: Record<StumbleKey, string>
  visualType?: 'parabola' | 'flow' | 'number-line' | 'triangle' | 'vector'
}

export type ConceptNode = {
  title: string
  summary: string
}

export type TextbookUnit = {
  id: string
  title: string
  status: 'ready' | 'planned'
  theme: string
  summary: string
  conceptMap: ConceptNode[]
  pages: LessonPage[]
}

export type AiExplanation = {
  conclusion: string
  intuition: string
  math: string
  example: string
  mistakes: string
  check: string
  source: 'local' | 'openai'
}
