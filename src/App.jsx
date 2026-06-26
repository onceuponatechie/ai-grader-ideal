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
 *   4 · ANSWERS   — add students and their typed answers.
 *   5 · GRADING   — calm, reassuring processing beat.
 *   6 · RESULTS   — the hero: every score explained, reviewed inline.
 *   7 · DONE      — quiet confirmation.
 *
 * Design system
 *   Accent : cyan-blue (Tailwind `cyan`), used sparingly and deliberately.
 *   Neutral: cool slate, for a modern, engineered feel.
 *   Type   : Inter, tight tracking on headings, generous leading on body.
 *   Form   : soft radii, hairline borders, restrained shadows, calm motion.
 *
 * The marking-guide journey (screens 4–6) runs on a curated, realistic
 * SS3 Chemistry dataset (SEED + GRADES below) so the hero results screen
 * shows fully-authored explanations. The assessment name the teacher typed
 * carries through as the title.
 */

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [assessmentName, setAssessmentName] = useState('')
  const [questions, setQuestions] = useState([])

  // Marking-guide journey state (curated demo dataset).
  const [students, setStudents] = useState(SEED.students)
  const [overrides, setOverrides] = useState({}) // `${sid}:${qid}` -> teacher mark
  const title = assessmentName || SEED.assessmentName

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

  if (screen === 'guide') {
    return (
      <GuideScreen
        assessmentName={assessmentName}
        questions={questions}
        setQuestions={setQuestions}
        onBack={() => setScreen('start')}
        onContinue={() => setScreen('answers')}
      />
    )
  }

  if (screen === 'answers') {
    return (
      <AnswersScreen
        assessmentName={title}
        students={students}
        setStudents={setStudents}
        onBack={() => setScreen('guide')}
        onGrade={() => setScreen('grading')}
      />
    )
  }

  if (screen === 'grading') {
    return (
      <GradingScreen
        total={students.length * SEED.questions.length}
        onDone={() => setScreen('results')}
      />
    )
  }

  if (screen === 'results') {
    return (
      <ResultsScreen
        assessmentName={title}
        students={students}
        overrides={overrides}
        setOverrides={setOverrides}
        onConfirm={() => setScreen('done')}
      />
    )
  }

  return (
    <DoneScreen
      assessmentName={title}
      students={students}
      overrides={overrides}
      onRestart={() => {
        setOverrides({})
        setScreen('answers')
      }}
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

function GuideScreen({ assessmentName, questions, setQuestions, onBack, onContinue }) {
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
            onClick={canContinue ? onContinue : undefined}
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
                  onClick={onContinue}
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

/* ══════════════════════ CURATED DATASET (screens 4–6) ════════════════════════
 * A realistic SS3 Chemistry assessment with a worked-out set of answers and
 * fully-authored grading explanations, so the hero results screen is alive.
 * In production these grades come from the model; here they're hand-written.
 * ──────────────────────────────────────────────────────────────────────────── */

const SEED = {
  assessmentName: 'SS3 Chemistry — Acids, Bases & Salts',
  questions: [
    {
      id: 'q1',
      type: 'written',
      marks: 5,
      prompt:
        'Explain the difference between a strong acid and a weak acid, and give one example of each.',
    },
    {
      id: 'q2',
      type: 'mcq',
      marks: 2,
      prompt: 'Which of the following is a property of bases?',
      options: [
        { text: 'They turn blue litmus paper red' },
        { text: 'They have a sour taste' },
        { text: 'They feel slippery and turn red litmus paper blue', correct: true },
        { text: 'They are always insoluble in water' },
      ],
    },
    {
      id: 'q3',
      type: 'written',
      marks: 5,
      prompt:
        'Describe what happens during a neutralisation reaction and name the products formed.',
    },
    {
      id: 'q4',
      type: 'mcq',
      marks: 2,
      prompt: 'What is the pH of a neutral solution at 25 °C?',
      options: [{ text: '0' }, { text: '7', correct: true }, { text: '10' }, { text: '14' }],
    },
  ],
  students: [
    {
      id: 's1',
      name: 'Chidinma Okeke',
      answers: {
        q1: 'A strong acid ionises completely in water, releasing all of its hydrogen ions, for example hydrochloric acid (HCl). A weak acid only ionises partially, so it releases few hydrogen ions, for example ethanoic acid.',
        q2: 2,
        q3: 'Neutralisation is the reaction between an acid and a base to form a salt and water. The hydrogen ions from the acid react with the hydroxide ions from the base to form water.',
        q4: 1,
      },
    },
    {
      id: 's2',
      name: 'Emeka Adeyemi',
      answers: {
        q1: 'A strong acid is very dangerous and can burn your skin, while a weak acid is not as strong. An example of a strong acid is HCl.',
        q2: 1,
        q3: 'When you mix an acid and a base together they cancel each other out and you are left with salt and water.',
        q4: 1,
      },
    },
    {
      id: 's3',
      name: 'Aisha Bello',
      answers: {
        q1: 'A strong acid dissociates completely in aqueous solution, e.g. trioxonitrate(V) acid (HNO₃). A weak acid does not fully dissociate, e.g. ethanoic acid.',
        q2: 2,
        q3: 'An acid reacts with a base to give a salt and water. This is also how antacids work in the stomach to relieve heartburn and ulcers.',
        q4: 2,
      },
    },
  ],
}

// Authored grades keyed by `${studentId}:${questionId}`.
const GRADES = {
  's1:q1': {
    score: 5,
    confidence: 'high',
    strengths: [
      'Defined a strong acid as one that ionises completely — exactly the guide’s wording.',
      'Contrasted it with partial ionisation for a weak acid.',
      'Gave a valid example of each (HCl and ethanoic acid).',
    ],
    weaknesses: [],
  },
  's1:q2': { score: 2, confidence: 'high', strengths: ['Chose the correct option — bases feel slippery and turn red litmus blue.'], weaknesses: [] },
  's1:q3': {
    score: 4,
    confidence: 'high',
    strengths: [
      'Correctly named salt and water as the products.',
      'Explained the reaction at ion level: H⁺ from the acid joins OH⁻ from the base.',
    ],
    weaknesses: ['Did not mention that neutralisation is exothermic — the guide awards a mark for noting heat is released.'],
  },
  's1:q4': { score: 2, confidence: 'high', strengths: ['Correct — a neutral solution has a pH of 7 at 25 °C.'], weaknesses: [] },

  's2:q1': {
    score: 1,
    confidence: 'high',
    strengths: ['Gave HCl as a correct example of a strong acid.'],
    weaknesses: [
      'Described “strong” as dangerous or corrosive — the guide defines strength by complete ionisation in water, not by hazard.',
      'Did not mention ionisation or hydrogen ions at all.',
      'Gave no example of a weak acid.',
    ],
  },
  's2:q2': { score: 0, confidence: 'high', strengths: [], weaknesses: ['Chose “sour taste”, which is a property of acids, not bases. The correct answer is that bases feel slippery and turn red litmus blue.'] },
  's2:q3': {
    score: 3,
    confidence: 'high',
    strengths: [
      'Correctly named salt and water as the products.',
      'Captured the basic idea that the acid and base counteract each other.',
    ],
    weaknesses: [
      '“Cancel each other out” is vague — the guide expects H⁺ reacting with OH⁻ to form water.',
      'Did not mention that heat is released.',
    ],
  },
  's2:q4': { score: 2, confidence: 'high', strengths: ['Correct — pH 7 is neutral.'], weaknesses: [] },

  's3:q1': {
    score: 5,
    confidence: 'high',
    strengths: [
      'Used precise language: complete vs. partial dissociation in aqueous solution.',
      'Both examples are valid, with correct IUPAC naming (trioxonitrate(V) acid).',
    ],
    weaknesses: [],
  },
  's3:q2': { score: 2, confidence: 'high', strengths: ['Chose the correct option.'], weaknesses: [] },
  's3:q3': {
    score: 4,
    confidence: 'low',
    strengths: [
      'Correctly named salt and water as the products.',
      'Offered a valid real-world application — antacids neutralising stomach acid.',
    ],
    weaknesses: ['Did not explicitly state the reaction releases heat, which the guide rewards.'],
    note: 'The answer adds real-world context the marking guide doesn’t cover. A human eye will judge best whether the “antacids” point earns the application mark.',
  },
  's3:q4': { score: 0, confidence: 'high', strengths: [], weaknesses: ['Chose pH 10, which is alkaline. A neutral solution is pH 7.'] },
}

function gradeFor(sid, qid) {
  return GRADES[`${sid}:${qid}`]
}

function questionById(qid) {
  return SEED.questions.find((q) => q.id === qid)
}

// Effective mark = teacher override if present, otherwise the AI score.
function markFor(sid, qid, overrides) {
  const key = `${sid}:${qid}`
  if (key in overrides) return overrides[key]
  return gradeFor(sid, qid).score
}

function studentTotal(student, overrides) {
  return SEED.questions.reduce(
    (sum, q) => sum + markFor(student.id, q.id, overrides),
    0,
  )
}

const TOTAL_MARKS = SEED.questions.reduce((s, q) => s + q.marks, 0)

function flaggedCount(student) {
  return SEED.questions.filter((q) => gradeFor(student.id, q.id).confidence === 'low').length
}

/* ─────────────────────────── SCREEN 4 — ANSWERS ──────────────────────────── */

function AnswersScreen({ assessmentName, students, setStudents, onBack, onGrade }) {
  const [selectedId, setSelectedId] = useState(students[0]?.id)
  const [newName, setNewName] = useState('')
  const selected = students.find((s) => s.id === selectedId) || students[0]

  function addStudent(e) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    const id = `s${Date.now()}`
    setStudents((list) => [...list, { id, name, answers: {} }])
    setSelectedId(id)
    setNewName('')
  }

  function setAnswer(qid, value) {
    setStudents((list) =>
      list.map((s) =>
        s.id === selected.id ? { ...s, answers: { ...s.answers, [qid]: value } } : s,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <BackButton onClick={onBack} />
            <Wordmark small />
          </div>
          <button
            onClick={onGrade}
            className="rounded-full bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
          >
            Grade all answers
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:py-12">
        <div className="mb-8 animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Add answers</p>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight sm:text-4xl">{assessmentName}</h1>
          <p className="mt-2 text-slate-500">
            Add your students' answers and we'll grade them against your marking guide.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
          {/* Students */}
          <aside>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Students · {students.length}
            </h2>
            <ul className="space-y-2">
              {students.map((s) => {
                const answered = SEED.questions.filter((q) => hasAnswer(s.answers[q.id])).length
                const active = s.id === selected?.id
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setSelectedId(s.id)}
                      className={
                        'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ' +
                        (active
                          ? 'border-cyan-500 bg-white shadow-sm ring-2 ring-cyan-100'
                          : 'border-slate-200 bg-white hover:border-slate-300')
                      }
                    >
                      <Avatar name={s.name} active={active} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-800">{s.name}</span>
                        <span className="block text-xs text-slate-400">
                          {answered}/{SEED.questions.length} answered
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <form onSubmit={addStudent} className="mt-3 flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Add a student…"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-300 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-slate-500 transition hover:border-cyan-300 hover:text-cyan-700"
                aria-label="Add student"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </form>
          </aside>

          {/* Selected student's answers */}
          <section className="animate-fade-up">
            {selected && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar name={selected.name} active size="lg" />
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900">{selected.name}</h2>
                    <p className="text-sm text-slate-400">{SEED.questions.length} questions</p>
                  </div>
                </div>

                {SEED.questions.map((q, i) => (
                  <div key={q.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Question {i + 1} · {q.marks} mark{q.marks === 1 ? '' : 's'}
                      </span>
                      <TypePill type={q.type} />
                    </div>
                    <p className="mt-2 text-[15px] font-semibold leading-relaxed text-slate-800">{q.prompt}</p>

                    <div className="mt-4">
                      {q.type === 'written' ? (
                        <textarea
                          rows={4}
                          value={selected.answers[q.id] || ''}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          placeholder="Type the student's answer…"
                          className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[15px] leading-relaxed placeholder:text-slate-300 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-100"
                        />
                      ) : (
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => {
                            const chosen = selected.answers[q.id] === oi
                            return (
                              <button
                                key={oi}
                                type="button"
                                onClick={() => setAnswer(q.id, oi)}
                                className={
                                  'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] transition ' +
                                  (chosen
                                    ? 'border-cyan-500 bg-cyan-50/60 ring-2 ring-cyan-100'
                                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300')
                                }
                              >
                                <span
                                  className={
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ' +
                                    (chosen ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-slate-300 text-slate-400')
                                  }
                                >
                                  {String.fromCharCode(65 + oi)}
                                </span>
                                <span className="text-slate-700">{opt.text}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-6 py-5 sm:flex-row">
                  <p className="text-sm text-slate-600">
                    {students.length} student{students.length === 1 ? '' : 's'} ready. We'll grade
                    every answer against your marking guide.
                  </p>
                  <button
                    onClick={onGrade}
                    className="w-full rounded-full bg-cyan-600 px-8 py-3 text-base font-semibold text-white shadow-sm shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 sm:w-auto"
                  >
                    Grade all answers
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

function hasAnswer(v) {
  if (typeof v === 'number') return true
  return typeof v === 'string' && v.trim().length > 0
}

/* ─────────────────────────── SCREEN 5 — GRADING ──────────────────────────── */

function GradingScreen({ total, onDone }) {
  const [done, setDone] = useState(0)

  useEffect(() => {
    const perTick = Math.max(700 / total, 90) // pace it so it reads as real work
    const tick = setInterval(() => {
      setDone((d) => {
        if (d >= total) return d
        return d + 1
      })
    }, perTick)
    return () => clearInterval(tick)
  }, [total])

  useEffect(() => {
    if (done >= total) {
      const t = setTimeout(onDone, 850)
      return () => clearTimeout(t)
    }
  }, [done, total, onDone])

  const pct = Math.round((done / total) * 100)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="px-6 pt-8 sm:px-10">
        <Wordmark />
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="-mt-12 w-full max-w-md text-center animate-fade-in">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <span className="relative flex h-8 w-8">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-40" />
              <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Grading against your marking guide…
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
            Every answer is scored against your guide — the same way, every time.
          </p>

          <div className="mt-9">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-200 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-500">
              Graded {Math.min(done, total)} of {total} answers
            </p>
          </div>
        </div>
      </main>

      <footer className="px-6 pb-8 text-center text-sm text-slate-400 sm:px-10">
        Hang tight — this only takes a moment.
      </footer>
    </div>
  )
}

/* ─────────────────────────── SCREEN 6 — RESULTS ──────────────────────────── */

function ResultsScreen({ assessmentName, students, overrides, setOverrides, onConfirm }) {
  const [selectedId, setSelectedId] = useState(() => {
    const flagged = students.find((s) => flaggedCount(s) > 0)
    return (flagged || students[0]).id
  })
  const selected = students.find((s) => s.id === selectedId) || students[0]

  const totalFlags = students.reduce((n, s) => n + flaggedCount(s), 0)

  function setMark(qid, value) {
    const q = questionById(qid)
    const clamped = Math.max(0, Math.min(q.marks, value))
    setOverrides((o) => ({ ...o, [`${selected.id}:${qid}`]: clamped }))
  }

  // Surface flagged questions first so attention lands on edge cases.
  const orderedQuestions = [...SEED.questions].sort((a, b) => {
    const fa = gradeFor(selected.id, a.id).confidence === 'low' ? 0 : 1
    const fb = gradeFor(selected.id, b.id).confidence === 'low' ? 0 : 1
    return fa - fb
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 sm:px-8">
          <Wordmark small />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:inline">Nothing is final until you confirm</span>
            <button
              onClick={onConfirm}
              className="rounded-full bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
            >
              Confirm results
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:py-10">
        <div className="mb-7 animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Results &amp; review</p>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight sm:text-4xl">{assessmentName}</h1>
          <p className="mt-2 text-slate-500">
            Every score comes with the reason behind it. Read through, adjust anything, then confirm.
          </p>
          {totalFlags > 0 && (
            <div className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
              <FlagIcon className="text-amber-500" />
              {totalFlags} answer{totalFlags === 1 ? '' : 's'} need your review — we've put {totalFlags === 1 ? 'it' : 'them'} first.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr] lg:gap-10">
          {/* Student selector with totals + flags */}
          <aside>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Class · {students.length}</h2>
            <ul className="space-y-2">
              {students.map((s) => {
                const flags = flaggedCount(s)
                const total = studentTotal(s, overrides)
                const active = s.id === selected.id
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setSelectedId(s.id)}
                      className={
                        'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ' +
                        (active
                          ? 'border-cyan-500 bg-white shadow-sm ring-2 ring-cyan-100'
                          : 'border-slate-200 bg-white hover:border-slate-300')
                      }
                    >
                      <Avatar name={s.name} active={active} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-800">{s.name}</span>
                        {flags > 0 ? (
                          <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <FlagIcon size={11} className="text-amber-500" /> {flags} to review
                          </span>
                        ) : (
                          <span className="block text-xs text-slate-400">All clear</span>
                        )}
                      </span>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-slate-700">
                        {total}
                        <span className="font-medium text-slate-400">/{TOTAL_MARKS}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>

          {/* Graded answers — the hero */}
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} active size="lg" />
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">{selected.name}</h2>
                  <p className="text-sm text-slate-400">
                    {flaggedCount(selected) > 0
                      ? `${flaggedCount(selected)} answer to review`
                      : 'No answers flagged'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold tabular-nums text-slate-900">
                  {studentTotal(selected, overrides)}
                  <span className="text-lg font-semibold text-slate-400">/{TOTAL_MARKS}</span>
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total score</p>
              </div>
            </div>

            {orderedQuestions.map((q) => (
              <AnswerCard
                key={q.id}
                question={q}
                student={selected}
                grade={gradeFor(selected.id, q.id)}
                mark={markFor(selected.id, q.id, overrides)}
                edited={`${selected.id}:${q.id}` in overrides}
                onSetMark={(v) => setMark(q.id, v)}
              />
            ))}

            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-6 py-5 sm:flex-row">
              <p className="text-sm text-slate-600">
                Nothing is final until you confirm. You can adjust any mark above.
              </p>
              <button
                onClick={onConfirm}
                className="w-full rounded-full bg-cyan-600 px-8 py-3 text-base font-semibold text-white shadow-sm shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 sm:w-auto"
              >
                Confirm results
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function AnswerCard({ question, student, grade, mark, edited, onSetMark }) {
  const flagged = grade.confidence === 'low'
  const answer = student.answers[question.id]
  const answerText =
    question.type === 'mcq'
      ? question.options[answer]?.text ?? '— no answer —'
      : answer || '— no answer —'
  const correctOption =
    question.type === 'mcq' ? question.options.find((o) => o.correct)?.text : null
  const mcqCorrect = question.type === 'mcq' && question.options[answer]?.correct

  return (
    <article
      className={
        'overflow-hidden rounded-3xl border bg-white shadow-sm transition ' +
        (flagged ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200')
      }
    >
      {flagged && (
        <div className="flex items-center gap-2 bg-amber-50 px-6 py-2.5 text-sm font-semibold text-amber-800">
          <FlagIcon className="text-amber-500" /> Needs your review
          <span className="font-normal text-amber-600">· the AI wasn't fully sure here</span>
        </div>
      )}

      <div className="p-6 sm:p-7">
        {/* Question + answer + score */}
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {question.type === 'mcq' ? 'Multiple choice' : 'Written answer'}
            </span>
            <p className="mt-1 text-[15px] font-semibold leading-relaxed text-slate-800">{question.prompt}</p>
          </div>
          <ConfidencePill flagged={flagged} />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Their answer</p>
          <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{answerText}</p>
          {question.type === 'mcq' && !mcqCorrect && (
            <p className="mt-2 text-sm text-slate-500">
              Correct answer: <span className="font-semibold text-slate-700">{correctOption}</span>
            </p>
          )}
        </div>

        {/* THE EXPLANATION — the hero of the product */}
        <div className="mt-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white p-5 ring-1 ring-slate-100 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold tracking-tight text-slate-900">Why this score</h3>
            <MarkEditor mark={mark} max={question.marks} edited={edited} onSetMark={onSetMark} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Explanation
              tone="good"
              title="What they got right"
              items={grade.strengths}
              empty="Nothing matched the marking guide here."
            />
            <Explanation
              tone="missing"
              title="What was missing"
              items={grade.weaknesses}
              empty="Nothing missing — full marks against the guide."
            />
          </div>

          {grade.note && (
            <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
              <FlagIcon className="mt-0.5 shrink-0 text-amber-500" />
              <span>{grade.note}</span>
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

function Explanation({ tone, title, items, empty }) {
  const good = tone === 'good'
  return (
    <div>
      <h4
        className={
          'mb-3 flex items-center gap-2 text-sm font-bold ' +
          (good ? 'text-cyan-800' : 'text-amber-800')
        }
      >
        <span
          className={
            'flex h-5 w-5 items-center justify-center rounded-full ' +
            (good ? 'bg-cyan-100 text-cyan-700' : 'bg-amber-100 text-amber-700')
          }
        >
          {good ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
          )}
        </span>
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm leading-relaxed text-slate-400">{empty}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-slate-700">
              <span
                className={
                  'mt-2 h-1.5 w-1.5 shrink-0 rounded-full ' +
                  (good ? 'bg-cyan-500' : 'bg-amber-500')
                }
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function MarkEditor({ mark, max, edited, onSetMark }) {
  return (
    <div className="flex items-center gap-2.5">
      {edited && (
        <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[11px] font-semibold text-cyan-700">Edited</span>
      )}
      <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => onSetMark(mark - 1)}
          disabled={mark <= 0}
          className="px-3 py-2 text-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"
          aria-label="Lower mark"
        >
          −
        </button>
        <span className="min-w-[3.5rem] text-center text-lg font-extrabold tabular-nums text-slate-900">
          {mark}
          <span className="text-sm font-semibold text-slate-400"> / {max}</span>
        </span>
        <button
          type="button"
          onClick={() => onSetMark(mark + 1)}
          disabled={mark >= max}
          className="px-3 py-2 text-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"
          aria-label="Raise mark"
        >
          +
        </button>
      </div>
    </div>
  )
}

function ConfidencePill({ flagged }) {
  if (flagged) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        <FlagIcon size={11} className="text-amber-500" /> Low confidence
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> High confidence
    </span>
  )
}

/* ──────────────────────────── SCREEN 7 — DONE ────────────────────────────── */

function DoneScreen({ assessmentName, students, overrides, onRestart }) {
  const totalScore = students.reduce((sum, s) => sum + studentTotal(s, overrides), 0)
  const maxScore = students.length * TOTAL_MARKS
  const avg = Math.round((totalScore / maxScore) * 100)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="px-6 pt-8 sm:px-10">
        <Wordmark />
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="-mt-12 w-full max-w-md text-center animate-fade-up">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-sm shadow-cyan-600/30">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Results confirmed</h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-slate-500">
            {assessmentName} is graded and finalised. Every student has a score — and the reason
            behind it.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <Stat value={students.length} label="Students" />
            <Stat value={`${avg}%`} label="Class average" />
            <Stat value={students.length * SEED.questions.length} label="Answers graded" />
          </div>

          <button
            onClick={onRestart}
            className="mt-8 text-sm font-semibold text-cyan-700 transition hover:text-cyan-800"
          >
            ← Back to answers
          </button>
        </div>
      </main>

      <footer className="px-6 pb-8 text-center text-sm text-slate-400 sm:px-10">
        Grading that explains itself.
      </footer>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-4 shadow-sm">
      <div className="text-2xl font-extrabold tabular-nums text-slate-900">{value}</div>
      <div className="mt-0.5 text-xs font-medium text-slate-400">{label}</div>
    </div>
  )
}

/* ───────────────────────── More shared bits ──────────────────────────────── */

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
      aria-label="Back"
      title="Back"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
    </button>
  )
}

function Avatar({ name, active, size = 'md' }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const dim = size === 'lg' ? 'h-11 w-11 text-sm' : 'h-9 w-9 text-xs'
  return (
    <span
      className={
        'flex shrink-0 items-center justify-center rounded-full font-bold ' +
        dim +
        ' ' +
        (active ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-500')
      }
    >
      {initials}
    </span>
  )
}

function TypePill({ type }) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
      {type === 'mcq' ? 'Multiple choice' : 'Written answer'}
    </span>
  )
}

function FlagIcon({ size = 13, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}
