import React, { useEffect, useRef, useState } from 'react'

/**
 * GradeWise — first two screens.
 *
 * Screen 1 (START):  one decision — name the assessment, press Start.
 * Screen 2 (GUIDE):  the teacher teaches the AI how to grade. The marking
 *                    guide is the visual centre of the screen.
 *
 * Design intent: one screen, one job, one obvious primary action.
 * A single warm accent colour (emerald). Generous whitespace. Plain language.
 */

const ACCENT = 'emerald' // single accent colour used throughout

function emptyEditor() {
  return {
    type: 'written', // 'written' | 'mcq'
    prompt: '',
    marks: 5,
    guide: '', // written-answer marking guide
    options: [
      { text: '', correct: true },
      { text: '', correct: false },
    ],
  }
}

export default function App() {
  const [screen, setScreen] = useState('start') // 'start' | 'guide'
  const [assessmentName, setAssessmentName] = useState('')
  const [questions, setQuestions] = useState([])

  function handleStart(name) {
    setAssessmentName(name.trim())
    setScreen('guide')
  }

  if (screen === 'start') {
    return <StartScreen onStart={handleStart} initialName={assessmentName} />
  }

  return (
    <GuideScreen
      assessmentName={assessmentName}
      questions={questions}
      setQuestions={setQuestions}
      onBack={() => setScreen('start')}
    />
  )
}

/* ───────────────────────────── SCREEN 1 — START ───────────────────────────── */

function StartScreen({ onStart, initialName }) {
  const [name, setName] = useState(initialName || '')
  const canStart = name.trim().length > 0
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function submit(e) {
    e.preventDefault()
    if (canStart) onStart(name)
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      <header className="px-6 sm:px-10 pt-8">
        <Wordmark />
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-xl text-center -mt-12">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
            What would you like to grade?
          </h1>
          <p className="mt-5 text-lg text-stone-500 leading-relaxed max-w-lg mx-auto">
            Set up an assessment, and we'll grade every answer against your
            marking guide — and explain every score.
          </p>

          <form onSubmit={submit} className="mt-12 text-left">
            <label htmlFor="assessment-name" className="sr-only">
              Assessment name
            </label>
            <input
              id="assessment-name"
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. JSS2 English Essay Test"
              className="w-full rounded-2xl border border-stone-200 bg-white px-6 py-5 text-xl shadow-sm placeholder:text-stone-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition"
            />

            <button
              type="submit"
              disabled={!canStart}
              className="mt-4 w-full rounded-2xl bg-emerald-600 px-6 py-5 text-xl font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
            >
              Start
            </button>
          </form>
        </div>
      </main>

      <footer className="px-6 sm:px-10 pb-8 text-center text-sm text-stone-400">
        Grading that explains itself.
      </footer>
    </div>
  )
}

/* ──────────────────────────── SCREEN 2 — GUIDE ───────────────────────────── */

function GuideScreen({ assessmentName, questions, setQuestions, onBack }) {
  const [editor, setEditor] = useState(emptyEditor())
  const [hint, setHint] = useState(false) // show the gentle empty-guide hint
  const promptRef = useRef(null)

  const writtenGuideMissing =
    editor.type === 'written' && editor.guide.trim().length === 0
  const promptMissing = editor.prompt.trim().length === 0
  const mcqValid =
    editor.type !== 'mcq' ||
    (editor.options.filter((o) => o.text.trim()).length >= 2 &&
      editor.options.some((o) => o.correct && o.text.trim()))

  function commitQuestion() {
    // Guide the user rather than letting them add nothing.
    if (promptMissing) {
      promptRef.current?.focus()
      return
    }
    if (writtenGuideMissing) {
      setHint(true)
      return
    }
    if (!mcqValid) return

    const committed = {
      id: Date.now(),
      type: editor.type,
      prompt: editor.prompt.trim(),
      marks: editor.marks,
      guide: editor.guide.trim(),
      options:
        editor.type === 'mcq'
          ? editor.options
              .filter((o) => o.text.trim())
              .map((o) => ({ text: o.text.trim(), correct: o.correct }))
          : [],
    }
    setQuestions((q) => [...q, committed])
    setEditor(emptyEditor())
    setHint(false)
    // Focus the fresh question field for a fast, uninterrupted flow.
    requestAnimationFrame(() => promptRef.current?.focus())
  }

  const canContinue = questions.length > 0

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-stone-50/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={onBack}
              className="text-stone-400 hover:text-stone-700 transition shrink-0"
              aria-label="Back"
              title="Back"
            >
              ←
            </button>
            <Wordmark small />
          </div>
          <button
            onClick={canContinue ? () => alert('Next: add students & answers') : undefined}
            disabled={!canContinue}
            className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
          >
            Continue{canContinue ? ` (${questions.length})` : ''}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 sm:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            Marking guide
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight">
            {assessmentName || 'Untitled assessment'}
          </h1>
          <p className="mt-2 text-stone-500">
            Add your questions one at a time. Teach the AI exactly what earns
            each mark.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Live progress rail */}
          <aside className="lg:pt-1">
            <QuestionList questions={questions} />
          </aside>

          {/* The editor — the visual centre */}
          <section>
            <QuestionEditor
              editor={editor}
              setEditor={setEditor}
              hint={hint}
              setHint={setHint}
              writtenGuideMissing={writtenGuideMissing}
              promptRef={promptRef}
              index={questions.length + 1}
              onCommit={commitQuestion}
            />

            {canContinue && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-6 py-5">
                <p className="text-sm text-stone-600">
                  {questions.length} question{questions.length > 1 ? 's' : ''}{' '}
                  ready. Add more, or move on when you're done.
                </p>
                <button
                  onClick={() => alert('Next: add students & answers')}
                  className="w-full sm:w-auto rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                >
                  Continue
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

/* ─────────────────────────── Live question list ─────────────────────────── */

function QuestionList({ questions }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-4">
        Your questions
      </h2>

      {questions.length === 0 ? (
        <p className="text-sm text-stone-400 leading-relaxed">
          Nothing added yet. Your questions will appear here as you build the
          guide.
        </p>
      ) : (
        <ol className="space-y-3">
          {questions.map((q, i) => (
            <li
              key={q.id}
              className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-800 line-clamp-2">
                    {q.prompt}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    {q.type === 'mcq' ? 'Multiple choice' : 'Written answer'} ·{' '}
                    {q.marks} mark{q.marks === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/* ───────────────────────────── Question editor ──────────────────────────── */

function QuestionEditor({
  editor,
  setEditor,
  hint,
  setHint,
  writtenGuideMissing,
  promptRef,
  index,
  onCommit,
}) {
  function set(patch) {
    setEditor((e) => ({ ...e, ...patch }))
  }

  function setType(type) {
    set({ type })
    setHint(false)
  }

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-800">
          Question {index}
        </h2>
        <span className="text-xs font-medium text-stone-400">
          Auto-saves to your list
        </span>
      </div>

      {/* Question prompt */}
      <div className="mt-5">
        <label
          htmlFor="q-prompt"
          className="block text-sm font-medium text-stone-600 mb-2"
        >
          Question
        </label>
        <textarea
          id="q-prompt"
          ref={promptRef}
          rows={2}
          value={editor.prompt}
          onChange={(e) => set({ prompt: e.target.value })}
          placeholder="e.g. Explain the process of photosynthesis in green plants."
          className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-base placeholder:text-stone-300 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:outline-none transition"
        />
      </div>

      {/* Response type — two only */}
      <div className="mt-6">
        <span className="block text-sm font-medium text-stone-600 mb-2">
          Response type
        </span>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <TypeToggle
            active={editor.type === 'written'}
            onClick={() => setType('written')}
            title="Written answer"
            sub="Graded against your guide"
          />
          <TypeToggle
            active={editor.type === 'mcq'}
            onClick={() => setType('mcq')}
            title="Multiple choice"
            sub="Mark the correct option"
          />
        </div>
      </div>

      {/* The marking guide — the heart of the screen */}
      <div className="mt-7">
        {editor.type === 'written' ? (
          <WrittenGuide
            value={editor.guide}
            onChange={(guide) => {
              set({ guide })
              if (guide.trim()) setHint(false)
            }}
            hint={hint && writtenGuideMissing}
          />
        ) : (
          <McqGuide
            options={editor.options}
            onChange={(options) => set({ options })}
          />
        )}
      </div>

      {/* Marks */}
      <div className="mt-7 flex items-center gap-4">
        <label htmlFor="q-marks" className="text-sm font-medium text-stone-600">
          Marks
        </label>
        <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50/50 overflow-hidden">
          <button
            type="button"
            onClick={() => set({ marks: Math.max(1, editor.marks - 1) })}
            className="px-4 py-2.5 text-lg text-stone-500 hover:bg-stone-100 transition"
            aria-label="Decrease marks"
          >
            −
          </button>
          <input
            id="q-marks"
            type="number"
            min={1}
            value={editor.marks}
            onChange={(e) =>
              set({ marks: Math.max(1, Number(e.target.value) || 1) })
            }
            className="w-14 bg-transparent text-center text-base font-semibold text-stone-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => set({ marks: editor.marks + 1 })}
            className="px-4 py-2.5 text-lg text-stone-500 hover:bg-stone-100 transition"
            aria-label="Increase marks"
          >
            +
          </button>
        </div>
      </div>

      {/* Primary action */}
      <div className="mt-8">
        <button
          onClick={onCommit}
          className="w-full rounded-2xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
        >
          Add next question
        </button>
      </div>
    </div>
  )
}

function TypeToggle({ active, onClick, title, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-2xl border px-4 py-3 text-left transition ' +
        (active
          ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
          : 'border-stone-200 bg-white hover:border-stone-300')
      }
    >
      <span
        className={
          'block text-sm font-semibold ' +
          (active ? 'text-emerald-800' : 'text-stone-700')
        }
      >
        {title}
      </span>
      <span className="block text-xs text-stone-400 mt-0.5">{sub}</span>
    </button>
  )
}

function WrittenGuide({ value, onChange, hint }) {
  return (
    <div>
      <label
        htmlFor="q-guide"
        className="block text-base font-semibold text-stone-800 mb-1"
      >
        Marking guide
      </label>
      <p className="text-sm text-stone-500 mb-3">
        The AI grades strictly against this and explains every score using it.
      </p>
      <textarea
        id="q-guide"
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Award 2 marks for explaining that photosynthesis converts light into chemical energy; 1 mark for naming chlorophyll as the absorbing pigment. Be specific about what earns each mark."
        className={
          'w-full resize-y rounded-2xl border bg-stone-50/50 px-5 py-4 text-base leading-relaxed placeholder:text-stone-300 focus:bg-white focus:outline-none focus:ring-4 transition ' +
          (hint
            ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-100'
            : 'border-stone-200 focus:border-emerald-400 focus:ring-emerald-100')
        }
      />
      {hint && (
        <p className="mt-2 flex items-start gap-2 text-sm text-amber-700">
          <span aria-hidden="true">✎</span>
          <span>
            A clear marking guide makes grading accurate — tell us what earns
            each mark.
          </span>
        </p>
      )}
    </div>
  )
}

function McqGuide({ options, onChange }) {
  function setOption(i, patch) {
    onChange(options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)))
  }

  function markCorrect(i) {
    onChange(options.map((o, idx) => ({ ...o, correct: idx === i })))
  }

  function addOption() {
    onChange([...options, { text: '', correct: false }])
  }

  function removeOption(i) {
    if (options.length <= 2) return
    const removingCorrect = options[i].correct
    let next = options.filter((_, idx) => idx !== i)
    if (removingCorrect && !next.some((o) => o.correct)) {
      next = next.map((o, idx) => ({ ...o, correct: idx === 0 }))
    }
    onChange(next)
  }

  return (
    <div>
      <span className="block text-base font-semibold text-stone-800 mb-1">
        Options
      </span>
      <p className="text-sm text-stone-500 mb-3">
        Add the options and tap the circle to mark the correct one — that's the
        marking guide.
      </p>

      <div className="space-y-2.5">
        {options.map((o, i) => (
          <div
            key={i}
            className={
              'flex items-center gap-3 rounded-2xl border bg-stone-50/50 pl-3 pr-2 py-1.5 transition ' +
              (o.correct ? 'border-emerald-300 bg-emerald-50/50' : 'border-stone-200')
            }
          >
            <button
              type="button"
              onClick={() => markCorrect(i)}
              aria-label={o.correct ? 'Correct answer' : 'Mark as correct'}
              className={
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ' +
                (o.correct
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-stone-300 text-transparent hover:border-emerald-400')
              }
            >
              ✓
            </button>
            <input
              type="text"
              value={o.text}
              onChange={(e) => setOption(i, { text: e.target.value })}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              className="flex-1 bg-transparent py-2 text-base placeholder:text-stone-300 focus:outline-none"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="px-2 text-stone-300 hover:text-stone-500 transition"
                aria-label="Remove option"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addOption}
        className="mt-3 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition"
      >
        + Add option
      </button>
    </div>
  )
}

/* ─────────────────────────────── Wordmark ──────────────────────────────── */

function Wordmark({ small }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={
          'flex items-center justify-center rounded-xl bg-emerald-600 text-white font-bold ' +
          (small ? 'h-7 w-7 text-sm' : 'h-9 w-9 text-base')
        }
      >
        G
      </span>
      <span
        className={
          'font-semibold tracking-tight text-stone-800 ' +
          (small ? 'text-base' : 'text-lg')
        }
      >
        GradeWise
      </span>
    </div>
  )
}
