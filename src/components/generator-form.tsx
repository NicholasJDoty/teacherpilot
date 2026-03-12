'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { GeneratePayload, GeneratorType } from '@/types'
import { OutputCard } from './output-card'

const tools: { value: GeneratorType; label: string }[] = [
  { value: 'lesson_plan', label: 'Lesson Plan' },
  { value: 'unit_plan', label: 'Unit Plan' },
  { value: 'lesson_bundle', label: 'Complete Lesson Bundle' },
  { value: 'slide_deck', label: 'Slide Deck (Google Slides style)' },
  { value: 'interactive_poll', label: 'Interactive Polls / Engagement' },
  { value: 'bell_ringer', label: 'Bell Ringer / Warm-Up' },
  { value: 'assignment', label: 'Assignment / Homework' },
  { value: 'quiz_test', label: 'Quiz / Test + Answer Key' },
  { value: 'rubric', label: 'Rubric' },
  { value: 'parent_email', label: 'Parent Email' },
  { value: 'sub_plan', label: 'Sub Plan' },
  { value: 'report_card_comments', label: 'Report Card Comments' },
  { value: 'differentiation', label: 'Differentiation & Accommodations' },
]

const toolDescriptions: Record<GeneratorType, string> = {
  lesson_plan:
    'Create a full lesson with objective, activities, accommodations, exit ticket, and homework.',
  unit_plan:
    'Build a multi-day unit outline with sequence, assessments, and pacing suggestions.',
  lesson_bundle:
    'Generate teacher slides, worksheet, exit ticket, and Google Form-ready quiz from one prompt.',
  slide_deck:
    'Create a slide-by-slide teaching deck that can export to Google Slides.',
  interactive_poll:
    'Create live engagement questions, warm-up polls, checks for understanding, and exit polls.',
  bell_ringer:
    'Create quick warmups or bell ringers with sample answers and brief directions.',
  assignment:
    'Create a classroom-ready assignment or homework task students can complete.',
  quiz_test:
    'Create a structured quiz or test with student version and answer key.',
  rubric:
    'Create a clear 4-level rubric with meaningful performance descriptors.',
  parent_email:
    'Draft professional parent communication quickly and clearly.',
  sub_plan:
    'Build a substitute plan with schedule, instructions, and classroom notes.',
  report_card_comments:
    'Generate report card comments across strong, average, and struggling performance levels.',
  differentiation:
    'Create supports for ELL, IEP/504, struggling, on-level, and advanced learners.',
}

function isValidTool(value: string): value is GeneratorType {
  return tools.some((tool) => tool.value === value)
}

export function GeneratorForm() {
  const searchParams = useSearchParams()

  const [form, setForm] = useState<GeneratePayload>({
    tool: 'lesson_plan',
    gradeLevel: '',
    subject: '',
    topic: '',
    standards: '',
    duration: '',
    learningObjective: '',
    notes: '',
    studentNeeds: '',
  })

  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const nextTool = searchParams.get('tool')
    const nextGradeLevel = searchParams.get('gradeLevel')
    const nextSubject = searchParams.get('subject')
    const nextTopic = searchParams.get('topic')
    const nextStandards = searchParams.get('standards')
    const nextDuration = searchParams.get('duration')
    const nextLearningObjective = searchParams.get('learningObjective')
    const nextNotes = searchParams.get('notes')
    const nextStudentNeeds = searchParams.get('studentNeeds')

    setForm((current) => ({
      ...current,
      tool: nextTool && isValidTool(nextTool) ? nextTool : current.tool,
      gradeLevel: nextGradeLevel ?? current.gradeLevel,
      subject: nextSubject ?? current.subject,
      topic: nextTopic ?? current.topic,
      standards: nextStandards ?? current.standards,
      duration: nextDuration ?? current.duration,
      learningObjective: nextLearningObjective ?? current.learningObjective,
      notes: nextNotes ?? current.notes,
      studentNeeds: nextStudentNeeds ?? current.studentNeeds,
    }))
  }, [searchParams])

  const currentToolLabel = useMemo(
    () => tools.find((tool) => tool.value === form.tool)?.label || 'Workflow',
    [form.tool]
  )

  const update = (key: keyof GeneratePayload, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const generate = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setContent('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setContent(data.content || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const saveOutput = async () => {
    await fetch('/api/save-output', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, content }),
    })
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      }}
    >
      <form onSubmit={generate} className="card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>
            Teacher workspace
          </h2>
          <p style={{ marginTop: '6px', fontSize: '14px', color: '#64748b' }}>
            Fill this out once. TeacherPilot builds the resource for you.
          </p>
        </div>

        <div
          style={{
            marginBottom: '16px',
            borderRadius: '14px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '14px',
          }}
        >
          <p
            style={{
              margin: '0 0 6px 0',
              fontSize: '12px',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Current workflow
          </p>

          <p
            style={{
              margin: '0 0 6px 0',
              fontSize: '16px',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            {currentToolLabel}
          </p>

          <p
            style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#475569',
            }}
          >
            {toolDescriptions[form.tool]}
          </p>
        </div>

        <div style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label className="label">Tool</label>

            <select
              className="input"
              value={form.tool}
              onChange={(e) => update('tool', e.target.value as GeneratorType)}
            >
              {tools.map((tool) => (
                <option key={tool.value} value={tool.value}>
                  {tool.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Grade level</label>

            <input
              className="input"
              value={form.gradeLevel}
              onChange={(e) => update('gradeLevel', e.target.value)}
              placeholder="Example: 6th grade"
              required
            />
          </div>

          <div>
            <label className="label">Subject</label>

            <input
              className="input"
              value={form.subject}
              onChange={(e) => update('subject', e.target.value)}
              placeholder="Example: Science"
              required
            />
          </div>

          <div>
            <label className="label">Topic</label>

            <input
              className="input"
              value={form.topic}
              onChange={(e) => update('topic', e.target.value)}
              placeholder="Example: Photosynthesis"
              required
            />
          </div>

          <div>
            <label className="label">Standards</label>

            <input
              className="input"
              value={form.standards}
              onChange={(e) => update('standards', e.target.value)}
              placeholder="Paste standards if available"
            />
          </div>

          <div>
            <label className="label">Duration</label>

            <input
              className="input"
              value={form.duration}
              onChange={(e) => update('duration', e.target.value)}
              placeholder="Example: 45 minutes"
            />
          </div>

          <div>
            <label className="label">Learning objective</label>

            <textarea
              className="input"
              style={{ minHeight: '90px', resize: 'vertical' }}
              value={form.learningObjective}
              onChange={(e) => update('learningObjective', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Student needs</label>

            <textarea
              className="input"
              style={{ minHeight: '90px', resize: 'vertical' }}
              value={form.studentNeeds}
              onChange={(e) => update('studentNeeds', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Additional notes</label>

            <textarea
              className="input"
              style={{ minHeight: '90px', resize: 'vertical' }}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>
          )}

          <button className="btn-primary" disabled={loading} type="submit">
            {loading ? 'Generating...' : 'Generate resource'}
          </button>
        </div>
      </form>

      <div>
        {content ? (
          <OutputCard content={content} onSave={saveOutput} />
        ) : (
          <div
            className="card"
            style={{
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              color: '#64748b',
            }}
          >
            Your generated resource will appear here.
          </div>
        )}
      </div>
    </div>
  )
}