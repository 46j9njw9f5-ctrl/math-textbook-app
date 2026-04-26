import { useMemo, useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import './App.css'
import { buildLocalAiAnswer, stumbleOptions, textbookUnits, transformationSteps } from './content'
import type { AiExplanation, LessonPage, StumbleKey, TextbookUnit } from './types'

const githubSupportItems = [
  'GitHub Actions で自動ビルドできる構成',
  'Issue / PR テンプレートで改善依頼を整理',
  'GitHub Pages にそのまま載せやすい相対パス設定',
]

const codexSupportItems = [
  '「どこが分からないか」を選べるので、修正依頼の粒度をそろえやすい',
  'ローカル完結なので、どのPCでも追加課金なしで確認できる',
  'README とテンプレートから、改善要望をそのまま Issue 化しやすい',
]

function findUnit(unitId: string) {
  return textbookUnits.find((unit) => unit.id === unitId) ?? textbookUnits[0]
}

function findPage(unit: TextbookUnit, pageId: string) {
  return unit.pages.find((page) => page.id === pageId) ?? unit.pages[0]
}

function renderVisual(page: LessonPage) {
  if (page.visualType === 'parabola') {
    return (
      <div className="diagram-surface">
        <svg viewBox="0 0 320 220" className="diagram-svg" role="img" aria-label="放物線の図">
          <defs>
            <linearGradient id="curve" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#8bc2ff" />
              <stop offset="100%" stopColor="#d7e7ff" />
            </linearGradient>
          </defs>
          <line x1="25" y1="180" x2="295" y2="180" className="axis-line" />
          <line x1="160" y1="20" x2="160" y2="200" className="axis-line dashed" />
          <path d="M50 170 Q160 50 270 170" fill="none" stroke="url(#curve)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="160" cy="50" r="6" className="highlight-dot" />
          <text x="168" y="46" className="diagram-text">
            頂点
          </text>
          <text x="170" y="205" className="diagram-text">
            軸 x = p
          </text>
        </svg>
        <p>頂点と軸を先に押さえると、グラフ・最大最小・定義域の話がつながります。</p>
      </div>
    )
  }

  if (page.visualType === 'number-line') {
    return (
      <div className="diagram-surface">
        <svg viewBox="0 0 320 160" className="diagram-svg" role="img" aria-label="数直線の図">
          <line x1="30" y1="80" x2="290" y2="80" className="axis-line" />
          <circle cx="90" cy="80" r="5" className="highlight-dot" />
          <circle cx="160" cy="80" r="5" className="highlight-dot" />
          <circle cx="230" cy="80" r="5" className="highlight-dot soft" />
          <text x="82" y="108" className="diagram-text">
            m
          </text>
          <text x="154" y="108" className="diagram-text">
            p
          </text>
          <text x="224" y="108" className="diagram-text">
            n
          </text>
          <line x1="90" y1="52" x2="230" y2="52" className="range-line" />
          <text x="132" y="40" className="diagram-text">
            区間 [m, n]
          </text>
        </svg>
        <p>定義域や場合分けでは、頂点や軸が区間のどこにあるかを数直線で見ると整理しやすくなります。</p>
      </div>
    )
  }

  if (page.visualType === 'triangle') {
    return (
      <div className="diagram-surface">
        <svg viewBox="0 0 320 220" className="diagram-svg" role="img" aria-label="三角形の図">
          <path d="M70 175 L250 175 L210 55 Z" className="triangle-shape" />
          <text x="155" y="195" className="diagram-text">
            底辺
          </text>
          <text x="220" y="122" className="diagram-text">
            斜辺
          </text>
          <text x="108" y="120" className="diagram-text">
            高さ
          </text>
          <path d="M208 164 A28 28 0 0 0 232 146" className="arc-line" />
          <text x="235" y="150" className="diagram-text">
            θ
          </text>
        </svg>
        <p>角度が決まると辺の比が決まる、というつながりを図で見るための基本イメージです。</p>
      </div>
    )
  }

  if (page.visualType === 'vector') {
    return (
      <div className="diagram-surface">
        <svg viewBox="0 0 320 220" className="diagram-svg" role="img" aria-label="ベクトルの図">
          <defs>
            <marker id="arrow-head" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#8bc2ff" />
            </marker>
          </defs>
          <line x1="70" y1="150" x2="150" y2="110" className="vector-line" markerEnd="url(#arrow-head)" />
          <line x1="150" y1="110" x2="245" y2="70" className="vector-line" markerEnd="url(#arrow-head)" />
          <line x1="70" y1="150" x2="245" y2="70" className="vector-line soft" markerEnd="url(#arrow-head)" />
          <text x="60" y="168" className="diagram-text">
            A
          </text>
          <text x="147" y="105" className="diagram-text">
            B
          </text>
          <text x="247" y="68" className="diagram-text">
            C
          </text>
        </svg>
        <p>移動を足し合わせると全体の移動になる、というベクトルの基本が図のまま読めます。</p>
      </div>
    )
  }

  return (
    <div className="diagram-surface flow-surface">
      <div className="flow-chip">概念</div>
      <div className="flow-arrow">→</div>
      <div className="flow-chip">公式</div>
      <div className="flow-arrow">→</div>
      <div className="flow-chip">使いどころ</div>
      <div className="flow-arrow">→</div>
      <div className="flow-chip">定着</div>
      <p>このページでは、意味から公式、公式から使いどころへ流す読み方を意識すると理解が安定します。</p>
    </div>
  )
}

function App() {
  const [selectedUnitId, setSelectedUnitId] = useState('quadratic-functions')
  const [selectedPageId, setSelectedPageId] = useState('intro')
  const [selectedStumble, setSelectedStumble] = useState<StumbleKey>('meaning')
  const [question, setQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState<AiExplanation | null>(null)
  const [generationNote, setGenerationNote] = useState('ページとつまずき方を選び、質問を書くと、ローカル教材データから解説を生成します。')

  const currentUnit = useMemo(() => findUnit(selectedUnitId), [selectedUnitId])
  const currentPage = useMemo(() => findPage(currentUnit, selectedPageId), [currentUnit, selectedPageId])

  const selectedStumbleLabel =
    stumbleOptions.find((option) => option.key === selectedStumble)?.label ?? stumbleOptions[0].label

  const handleUnitChange = (unitId: string) => {
    const nextUnit = findUnit(unitId)
    setSelectedUnitId(unitId)
    setSelectedPageId(nextUnit.pages[0].id)
    setAiAnswer(null)
    setGenerationNote(`「${nextUnit.title}」に切り替えました。質問すると、この単元向けにローカル解説を生成します。`)
  }

  const handleGenerate = () => {
    const localAnswer = buildLocalAiAnswer(currentPage, selectedStumble, question)
    setAiAnswer(localAnswer)
    setGenerationNote('ローカル教材データから解説を生成しました。外部APIは使っていません。')
  }

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Math Textbook App</span>
          <h1>数学を、解く前に「分かる」ための教科書アプリ。</h1>
          <p>
            問題演習よりも、概念の意味、公式の意味、導出、使いどころ、誤解しやすい点を丁寧につなげて学ぶための教材UIです。
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span>対応単元</span>
            <strong>{textbookUnits.filter((unit) => unit.status === 'ready').length}単元</strong>
          </div>
          <div className="stat-card">
            <span>現在の単元</span>
            <strong>{currentUnit.title}</strong>
          </div>
          <div className="stat-card">
            <span>説明モード</span>
            <strong>完全ローカル</strong>
          </div>
        </div>
      </header>

      <section className="unit-strip" aria-label="単元一覧">
        {textbookUnits.map((unit) => (
          <button
            key={unit.id}
            type="button"
            className={`unit-pill ${unit.id === currentUnit.id ? 'active' : ''}`}
            onClick={() => handleUnitChange(unit.id)}
          >
            <span>{unit.title}</span>
            <small>{unit.theme}</small>
          </button>
        ))}
      </section>

      <div className="workspace">
        <aside className="sidebar">
          <section className="panel">
            <div className="panel-heading">
              <span className="section-label">単元情報</span>
              <h2>{currentUnit.title}</h2>
            </div>
            <p className="unit-summary">{currentUnit.summary}</p>
            <nav className="page-nav">
              {currentUnit.pages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  className={`page-link ${page.id === currentPage.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPageId(page.id)}
                >
                  <span>{page.title}</span>
                  <small>{page.catchCopy}</small>
                </button>
              ))}
            </nav>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <span className="section-label">概念マップ</span>
              <h2>つながりで覚える</h2>
            </div>
            <div className="concept-map">
              {currentUnit.conceptMap.map((node, index) => (
                <div key={node.title} className="concept-node">
                  <strong>{node.title}</strong>
                  <p>{node.summary}</p>
                  {index < currentUnit.conceptMap.length - 1 && <span className="arrow">→</span>}
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <span className="section-label">連携と運用</span>
              <h2>GitHub / Codex Support</h2>
            </div>
            <article className="info-card compact-card">
              <h3>GitHub連携</h3>
              <ul>
                {githubSupportItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="info-card compact-card">
              <h3>サポートしやすい点</h3>
              <ul>
                {codexSupportItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </section>
        </aside>

        <main className="content">
          <section className="panel focus-panel">
            <div className="panel-heading">
              <span className="section-label">現在のページ</span>
              <h2>{currentPage.title}</h2>
            </div>
            <p className="lead">{currentPage.catchCopy}</p>

            <div className="grid two-up">
              <article className="info-card">
                <h3>概念の意味</h3>
                <p>{currentPage.conceptMeaning}</p>
              </article>
              <article className="info-card">
                <h3>なぜ学ぶのか</h3>
                <p>{currentPage.whyLearn}</p>
              </article>
            </div>

            <article className="info-card">
              <h3>公式・意味・導出</h3>
              <div className="formula-list">
                {currentPage.formulas.map((formula) => (
                  <div key={formula.label} className="formula-card">
                    <span className="formula-label">{formula.label}</span>
                    <BlockMath math={formula.latex} />
                    <p>
                      <strong>意味:</strong> {formula.meaning}
                    </p>
                    <p>
                      <strong>導出:</strong> {formula.derivation}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <div className="grid two-up">
              <article className="info-card">
                <h3>使いどころ</h3>
                <ul>
                  {currentPage.useCases.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="info-card">
                <h3>よくある誤解</h3>
                <ul>
                  {currentPage.misconceptions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="grid two-up">
              <article className="info-card">
                <h3>直感的説明</h3>
                <p>{currentPage.intuition}</p>
              </article>
              <article className="info-card">
                <h3>厳密な説明</h3>
                <p>{currentPage.rigor}</p>
              </article>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <span className="section-label">概念図解</span>
              <h2>図と式をつなぐ</h2>
            </div>
            {renderVisual(currentPage)}
          </section>

          <section className="panel">
            <div className="panel-heading">
              <span className="section-label">つまずき別説明</span>
              <h2>分からなさを選ぶ</h2>
            </div>
            <div className="stumble-controls">
              {stumbleOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`stumble-chip ${selectedStumble === option.key ? 'selected' : ''}`}
                  onClick={() => setSelectedStumble(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <article className="info-card accent-card">
              <h3>{selectedStumbleLabel}</h3>
              <p>{currentPage.stumbleGuides[selectedStumble]}</p>
            </article>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <span className="section-label">なぜなぜ解説</span>
              <h2>一段で終わらせない</h2>
            </div>
            <div className="why-chain">
              <article className="chain-card">
                <h3>なぜ？</h3>
                <p>{currentPage.whyChain.why}</p>
              </article>
              <article className="chain-card">
                <h3>つまり？</h3>
                <p>{currentPage.whyChain.meaning}</p>
              </article>
              <article className="chain-card">
                <h3>どこで使う？</h3>
                <p>{currentPage.whyChain.usage}</p>
              </article>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <span className="section-label">例題</span>
              <h2>{currentPage.exampleTitle}</h2>
            </div>
            <article className="info-card">
              <p className="example-problem">{currentPage.exampleProblem}</p>
              <div className="step-list">
                {currentPage.exampleSteps.map((step, index) => (
                  <div key={`${currentPage.id}-${index}`} className="step-card">
                    <span className="step-index">Step {index + 1}</span>
                    <BlockMath math={step.latex} />
                    <p>{step.explanation}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {currentUnit.id === 'quadratic-functions' && (
            <section className="panel">
              <div className="panel-heading">
                <span className="section-label">式変形ステップ解説</span>
                <h2>1行ずつ丁寧に追う</h2>
              </div>
              <article className="info-card">
                <p className="example-problem">
                  <InlineMath math={'x^2 - 4x + 3 = (x - 2)^2 - 1'} /> をどう見ればよいかを、調整の意味まで含めて説明します。
                </p>
                <div className="step-list">
                  {transformationSteps.map((step, index) => (
                    <div key={`transform-${index}`} className="step-card">
                      <span className="step-index">Line {index + 1}</span>
                      <BlockMath math={step.latex} />
                      <p>{step.explanation}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          )}

          <section className="panel">
            <div className="panel-heading">
              <span className="section-label">AI説明生成</span>
              <h2>質問に合わせて答え方を変える</h2>
            </div>
            <div className="ai-layout">
              <article className="info-card">
                <label className="question-label" htmlFor="question">
                  いまの疑問を書いてください
                </label>
                <textarea
                  id="question"
                  className="question-box"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="例: 平方完成でどうして +4 と -4 を入れるの？"
                />
                <button type="button" className="generate-button" onClick={handleGenerate}>
                  このつまずき方で解説を生成
                </button>
                <p className="status-note">{generationNote}</p>
              </article>

              <article className="info-card ai-answer">
                <h3>生成フォーマット</h3>
                {aiAnswer ? (
                  <div className="answer-stack">
                    <section>
                      <h4>結論</h4>
                      <p>{aiAnswer.conclusion}</p>
                    </section>
                    <section>
                      <h4>直感的説明</h4>
                      <p>{aiAnswer.intuition}</p>
                    </section>
                    <section>
                      <h4>数式での説明</h4>
                      <BlockMath math={currentPage.formulas[0].latex} />
                      <p>{aiAnswer.math}</p>
                    </section>
                    <section>
                      <h4>具体例</h4>
                      <p>{aiAnswer.example}</p>
                    </section>
                    <section>
                      <h4>よくあるミス</h4>
                      <p>{aiAnswer.mistakes}</p>
                    </section>
                    <section>
                      <h4>確認問題1問</h4>
                      <p>{aiAnswer.check}</p>
                    </section>
                  </div>
                ) : (
                  <p className="placeholder-text">{generationNote}</p>
                )}
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
