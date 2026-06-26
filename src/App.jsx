import React, { useEffect, useRef, useState } from 'react'

/**
 * GradeWise — AI grading product (placeholder name).
 * Grades student answers against a teacher's marking guide and explains
 * every score.
 *
 * Screens
 *   1 · WELCOME   — sells the product and signs the user in (entry point).
 *   2 · START     — one decision: name the assessment.
 *   3 · GUIDE     — the teacher teaches the AI how to grade; the marking
 *                   guide is the visual centre.
 *
 * Design system
 *   Accent : cyan-blue (Tailwind `cyan`), used sparingly and deliberately.
 *   Neutral: cool slate, for a modern, engineered feel.
 *   Type   : Inter, tight tracking on headings, generous leading on body.
 *   Form   : soft radii, hairline borders, restrained shadows, calm motion.
 */

export default function App() {
  const [screen, setScreen] = useState('welcome') // 'welcome' | 'start' | 'guide'
  const [assessmentName, setAssessmentName] = useState('')
  const [questions, setQuestions] = useState([])

  if (screen === 'welcome') {
    return <WelcomeScreen onAuthed={() => setScreen('start')} />
  }

  if (screen === 'start') {
    return (
      <StartScreen
        initialName={assessmentName}
        onStart={(name) => {
          setAssessmentName(name.trim())
          setScreen('guide')
        }}
      />
    )
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

/* ─────────────────────────── SCREEN 1 — WELCOME ──────────────────────────── */

function WelcomeScreen({ onAuthed }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 lg:grid lg:grid-cols-2">
      <SellPanel />
      <SignInPanel onAuthed={onAuthed} />
    </div>
  )
}

function SellPanel() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-7 py-12 sm:px-12 lg:flex lg:min-h-screen lg:flex-col lg:px-16 lg:py-14">
      {/* Ambient cyan-blue glow for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
      />

      <div className="relative">
        <Wordmark theme="dark" />
      </div>

      <div className="relative mt-14 flex-1 lg:mt-auto lg:flex lg:flex-col lg:justify-center">
        <div className="max-w-xl animate-fade-up">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Grade a full class in minutes — and show every student why.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
            Upload your marking guide. Let AI grade every answer against it,
            fairly and consistently — with a clear reason for every score.
          </p>

          <ul className="mt-9 space-y-3">
            {[
              'Grades strictly against your own marking guide',
              'A plain-language reason behind every single score',
              'From JSS essays to SS3 theory — WAEC & NECO style',
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-slate-200">
                <CheckBadge />
                <span className="text-[15px] leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="relative mt-12 text-sm font-medium text-slate-400 lg:mt-10">
        Built for Nigerian classrooms.
      </p>
    </section>
  )
}

function SignInPanel({ onAuthed }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const isSignup = mode === 'signup'

  function submit(e) {
    e.preventDefault()
    onAuthed()
  }

  return (
    <section className="flex min-h-screen flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
      <div className="mx-auto w-full max-w-sm animate-fade-up">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Get started
        </h2>
        <p className="mt-1.5 text-[15px] text-slate-500">
          {isSignup
            ? 'Create your account — it takes a moment.'
            : 'Welcome back. Sign in to keep grading.'}
        </p>

        {/* PRIMARY — one tap, no password */}
        <button
          type="button"
          onClick={onAuthed}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-[15px] font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100"
        >
          <GoogleMark />
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            or
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* SECONDARY — email + password */}
        <form onSubmit={submit} className="space-y-4">
          {isSignup && (
            <Field
              id="name"
              label="Full name"
              type="text"
              placeholder="e.g. Mrs. Adebayo"
              autoComplete="name"
            />
          )}
          <Field
            id="email"
            label="Email"
            type="email"
            placeholder="you@school.edu.ng"
            autoComplete="email"
          />
          <Field
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-sm shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
          >
            {isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignup ? 'Already have an account?' : 'New here?'}{' '}
          <button
            type="button"
            onClick={() => setMode(isSignup ? 'signin' : 'signup')}
            className="font-semibold text-cyan-700 underline-offset-2 hover:text-cyan-800 hover:underline"
          >
            {isSignup ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </div>
    </section>
  )
}

function Field({ id, label, type, placeholder, autoComplete }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-300 transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
      />
    </div>
  )
}

/* ─────────────────────────── SCREEN 2 — START ────────────────────────────── */

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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="px-6 pt-8 sm:px-10">
        <Wordmark />
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="-mt-12 w-full max-w-xl animate-fade-up text-center">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            What would you like to grade?
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-slate-500">
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
              className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 text-xl shadow-sm transition placeholder:text-slate-300 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
            />

            <button
              type="submit"
              disabled={!canStart}
              className="mt-4 w-full rounded-2xl bg-cyan-600 px-6 py-5 text-xl font-semibold text-white shadow-sm shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              Start
            </button>
          </form>
        </div>
      </main>

      <footer className="px-6 pb-8 text-center text-sm text-slate-400 sm:px-10">
        Grading that explains itself.
      </footer>
    </div>
  )
}

/* ─────────────────────────── SCREEN 3 — GUIDE ────────────────────────────── */

function emptyEditor() {
  return {
    type: 'written', // 'written' | 'mcq'
    prompt: '',
    marks: 5,
    guide: '',
    options: [
      { text: '', correct: true },
      { text: '', correct: false },
    ],
  }
}

function GuideScreen({ assessmentName, questions, setQuestions, onBack }) {
  const [editor, setEditor] = useState(emptyEditor())
  const [hint, setHint] = useState(false)
  const promptRef = useRef(null)

  const writtenGuideMissing =
    editor.type === 'written' && editor.guide.trim().length === 0
  const promptMissing = editor.prompt.trim().length === 0
  const mcqValid =
    editor.type !== 'mcq' ||
    (editor.options.filter((o) => o.text.trim()).length >= 2 &&
      editor.options.some((o) => o.correct && o.text.trim()))

  function commitQuestion() {
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
    requestAnimationFrame(() => promptRef.current?.focus())
  }

  const canContinue = questions.length > 0
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
              aria-label="Back"
              title="Back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <Wordmark small />
          </div>
          <button
            onClick={canContinue ? () => alert('Next: add students & answers') : undefined}
            disabled={!canContinue}
            className="rounded-full bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            Continue{canContinue ? ` · ${questions.length}` : ''}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:py-12">
        <div className="mb-8 animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Marking guide
          </p>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {assessmentName || 'Untitled assessment'}
          </h1>
          <p className="mt-2 text-slate-500">
            Add your questions one at a time. Teach the AI exactly what earns
            each mark.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
          <aside className="lg:pt-1">
            <QuestionList questions={questions} totalMarks={totalMarks} />
          </aside>

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
              <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-6 py-5 sm:flex-row">
                <p className="text-sm text-slate-600">
                  {questions.length} question{questions.length > 1 ? 's' : ''} ·{' '}
                  {totalMarks} mark{totalMarks === 1 ? '' : 's'} ready. Add more,
                  or move on when you're done.
                </p>
                <button
                  onClick={() => alert('Next: add students & answers')}
                  className="w-full rounded-full bg-cyan-600 px-8 py-3 text-base font-semibold text-white shadow-sm shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 sm:w-auto"
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

function QuestionList({ questions, totalMarks }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Your questions
        </h2>
        {questions.length > 0 && (
          <span className="text-xs font-medium text-slate-400">
            {totalMarks} mark{totalMarks === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 px-5 py-8 text-center">
          <p className="text-sm leading-relaxed text-slate-400">
            Nothing added yet. Your questions will appear here as you build the
            guide.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {questions.map((q, i) => (
            <li
              key={q.id}
              className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium text-slate-800">
                    {q.prompt}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
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
    <div className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Question {index}
        </h2>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          Auto-saves to your list
        </span>
      </div>

      <div className="mt-5">
        <label htmlFor="q-prompt" className="mb-2 block text-sm font-medium text-slate-600">
          Question
        </label>
        <textarea
          id="q-prompt"
          ref={promptRef}
          rows={2}
          value={editor.prompt}
          onChange={(e) => set({ prompt: e.target.value })}
          placeholder="e.g. Explain the process of photosynthesis in green plants."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-base transition placeholder:text-slate-300 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-100"
        />
      </div>

      <div className="mt-6">
        <span className="mb-2 block text-sm font-medium text-slate-600">
          Response type
        </span>
        <div className="grid max-w-md grid-cols-2 gap-3">
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

      <div className="mt-7 flex items-center gap-4">
        <label htmlFor="q-marks" className="text-sm font-medium text-slate-600">
          Marks
        </label>
        <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50">
          <button
            type="button"
            onClick={() => set({ marks: Math.max(1, editor.marks - 1) })}
            className="px-4 py-2.5 text-lg text-slate-500 transition hover:bg-slate-100"
            aria-label="Decrease marks"
          >
            −
          </button>
          <input
            id="q-marks"
            type="number"
            min={1}
            value={editor.marks}
            onChange={(e) => set({ marks: Math.max(1, Number(e.target.value) || 1) })}
            className="w-14 bg-transparent text-center text-base font-semibold text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => set({ marks: editor.marks + 1 })}
            className="px-4 py-2.5 text-lg text-slate-500 transition hover:bg-slate-100"
            aria-label="Increase marks"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onCommit}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-6 py-4 text-base font-semibold text-white shadow-sm shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
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
          ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100'
          : 'border-slate-200 bg-white hover:border-slate-300')
      }
    >
      <span
        className={
          'block text-sm font-semibold ' +
          (active ? 'text-cyan-800' : 'text-slate-700')
        }
      >
        {title}
      </span>
      <span className="mt-0.5 block text-xs text-slate-400">{sub}</span>
    </button>
  )
}

function WrittenGuide({ value, onChange, hint }) {
  return (
    <div>
      <label htmlFor="q-guide" className="mb-1 block text-base font-bold tracking-tight text-slate-900">
        Marking guide
      </label>
      <p className="mb-3 text-sm text-slate-500">
        The AI grades strictly against this and explains every score using it.
      </p>
      <textarea
        id="q-guide"
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Award 2 marks for explaining that photosynthesis converts light into chemical energy; 1 mark for naming chlorophyll as the absorbing pigment. Be specific about what earns each mark."
        className={
          'w-full resize-y rounded-2xl border bg-slate-50/50 px-5 py-4 text-base leading-relaxed transition placeholder:text-slate-300 focus:bg-white focus:outline-none focus:ring-4 ' +
          (hint
            ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-100'
            : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-100')
        }
      />
      {hint && (
        <p className="mt-2 flex items-start gap-2 text-sm text-amber-700">
          <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
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
      <span className="mb-1 block text-base font-bold tracking-tight text-slate-900">
        Options
      </span>
      <p className="mb-3 text-sm text-slate-500">
        Add the options and tap the circle to mark the correct one — that's the
        marking guide.
      </p>

      <div className="space-y-2.5">
        {options.map((o, i) => (
          <div
            key={i}
            className={
              'flex items-center gap-3 rounded-2xl border py-1.5 pl-3 pr-2 transition ' +
              (o.correct ? 'border-cyan-300 bg-cyan-50/60' : 'border-slate-200 bg-slate-50/50')
            }
          >
            <button
              type="button"
              onClick={() => markCorrect(i)}
              aria-label={o.correct ? 'Correct answer' : 'Mark as correct'}
              className={
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ' +
                (o.correct
                  ? 'border-cyan-500 bg-cyan-500 text-white'
                  : 'border-slate-300 text-transparent hover:border-cyan-400')
              }
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </button>
            <input
              type="text"
              value={o.text}
              onChange={(e) => setOption(i, { text: e.target.value })}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              className="flex-1 bg-transparent py-2 text-base placeholder:text-slate-300 focus:outline-none"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="px-2 text-xl leading-none text-slate-300 transition hover:text-slate-500"
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
        className="mt-3 text-sm font-semibold text-cyan-700 transition hover:text-cyan-800"
      >
        + Add option
      </button>
    </div>
  )
}

/* ───────────────────────────── Shared bits ──────────────────────────────── */

function Wordmark({ small, theme = 'light' }) {
  const dark = theme === 'dark'
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={
          'flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 font-extrabold text-white shadow-sm shadow-cyan-600/30 ' +
          (small ? 'h-7 w-7 text-sm' : 'h-9 w-9 text-base')
        }
      >
        G
      </span>
      <span
        className={
          'font-bold tracking-tight ' +
          (dark ? 'text-white ' : 'text-slate-900 ') +
          (small ? 'text-base' : 'text-lg')
        }
      >
        GradeWise
      </span>
    </div>
  )
}

function CheckBadge() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  )
}
