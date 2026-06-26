# GradeWise

An AI grading product (placeholder name). It grades student answers against a
teacher's marking guide and explains every score.

This repo contains the first connected screens.

## The screens

**1 · Welcome / sign in** — A two-panel entry point. The left panel sells the
product in one breath (the promise, what it does, and a quiet "Built for
Nigerian classrooms" trust line); the right panel signs the user in with
minimal friction — a prominent **Continue with Google** button, an **or**
divider, and email + password fields that toggle between **Sign in** and
**Create an account**. No institution or role is asked here. Authenticating
leads to the start screen.

**2 · Start** — One decision to begin. Name the assessment and press **Start**.
Nothing else to configure — value first, settings later.

**3 · Marking guide** — Where the teacher teaches the AI how to grade. The
marking guide is the visual centre of the screen. Add questions one at a time:

- **Written answer** — a prominent marking guide text area. The AI grades
  strictly against this and explains every score using it. An empty guide
  prompts a gentle inline hint rather than letting you continue with nothing.
- **Multiple choice** — a list of options with one marked correct (the MCQ
  marking guide).

Each question has a **Marks** field (default 5). **Add next question** commits
the current question to the live list, clears the editor, and focuses the new
question field — questions auto-save (no separate save button). Once at least
one question exists, a clear **Continue** button leads forward.

**4 · Add answers** — Add students and type their answers (text areas for
written questions, option selection for MCQ). Three example students come
pre-filled with realistic answers so the screen feels alive. One primary
button: **Grade all answers**.

**5 · Grading** — A calm, reassuring processing beat: *"Grading against your
marking guide…"* with a live *"Graded X of N answers"* progress bar and the
trust line *"Every answer is scored against your guide — the same way, every
time."* It advances to the results automatically.

**6 · Results & review (the hero)** — Results and teacher review live together.
A class list on the left shows each student's total and a flag if any answer
needs review. The main panel shows each graded answer with the question, the
student's answer, the score, and — given the most visual weight — **the
explanation**: *What they got right* and *What was missing*, phrased against
the marking guide. Low-confidence answers are softly highlighted, badged
**Needs your review**, and surfaced first. The teacher can adjust any mark
inline; nothing is final until **Confirm results**.

> The grading journey (screens 4–6) runs on a curated, realistic SS3 Chemistry
> dataset with fully-authored explanations, so the hero results screen shows
> genuine reasoning. In production these come from the model. The assessment
> name the teacher typed carries through as the title.

## Design

A single accent colour — **cyan-blue** — over cool slate neutrals, Inter
typography with tight heading tracking, soft radii, hairline borders, and calm
entrance motion. The product is a single React component (`src/App.jsx`),
styled with Tailwind.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Build

```bash
npm run build
```
