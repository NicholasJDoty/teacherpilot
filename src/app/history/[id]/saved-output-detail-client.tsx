'use client'

import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { exportMarkdownToGoogleSlides } from '@/lib/google-slides-export'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

function getBundleSections(content: string) {
  const sections = [
    'Teacher Slides',
    'Student Worksheet',
    'Exit Ticket',
    'Google Form Quiz',
  ]

  return sections.filter((section) =>
    content.toLowerCase().includes(`## ${section}`.toLowerCase())
  )
}

export default function SavedOutputDetailClient({
  content,
  title,
  meta,
}: {
  content: string
  title: string
  meta: string
}) {
  const [copied, setCopied] = useState(false)
  const [exportingSlides, setExportingSlides] = useState(false)

  const bundleSections = useMemo(() => getBundleSections(content), [content])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleExportPdf = () => {
    window.print()
  }

  const handleExportSlides = async () => {
    try {
      setExportingSlides(true)
      await exportMarkdownToGoogleSlides(content, title)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Google Slides export failed.')
    } finally {
      setExportingSlides(false)
    }
  }

  const jumpToSection = (section: string) => {
    const id = slugify(section)
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="card p-6 print-surface">
      <div className="print-doc-header">
        <div className="print-doc-brand">TeacherPilot</div>
        <div className="print-doc-subtitle">{title}</div>
        <div className="print-doc-meta">{meta}</div>
      </div>

      <div
        className="no-print"
        style={{
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 700,
            color: '#0f172a',
          }}
        >
          Full saved content
        </h2>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button type="button" className="btn-secondary" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button type="button" className="btn-secondary" onClick={handleExportPdf}>
            Export PDF
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleExportSlides}
            disabled={exportingSlides}
          >
            {exportingSlides ? 'Exporting...' : 'Google Slides'}
          </button>
        </div>
      </div>

      {bundleSections.length > 0 && (
        <div
          className="no-print"
          style={{
            marginBottom: '18px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          {bundleSections.map((section) => (
            <button
              key={section}
              type="button"
              className="btn-secondary"
              onClick={() => jumpToSection(section)}
            >
              {section}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          color: '#334155',
          fontSize: '14px',
          lineHeight: 1.7,
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '20px 0 12px' }}>
                {children}
              </h1>
            ),
            h2: ({ children }) => {
              const text = String(children)
              return (
                <h2
                  id={slugify(text)}
                  style={{ fontSize: '22px', fontWeight: 700, margin: '22px 0 10px' }}
                >
                  {children}
                </h2>
              )
            },
            h3: ({ children }) => (
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '16px 0 8px' }}>
                {children}
              </h3>
            ),
            p: ({ children }) => <p style={{ margin: '10px 0' }}>{children}</p>,
            ul: ({ children }) => (
              <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol style={{ paddingLeft: '20px', margin: '10px 0' }}>{children}</ol>
            ),
            li: ({ children }) => <li style={{ marginBottom: '6px' }}>{children}</li>,
            strong: ({ children }) => (
              <strong style={{ color: '#0f172a' }}>{children}</strong>
            ),
            hr: () => (
              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid #e2e8f0',
                  margin: '20px 0',
                }}
              />
            ),
            code: ({ children }) => (
              <code
                style={{
                  background: '#f1f5f9',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  fontSize: '13px',
                }}
              >
                {children}
              </code>
            ),
            table: ({ children }) => (
              <div style={{ overflowX: 'auto', margin: '16px 0' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '720px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                  }}
                >
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead style={{ background: '#f8fafc' }}>{children}</thead>
            ),
            th: ({ children }) => (
              <th
                style={{
                  border: '1px solid #e2e8f0',
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0f172a',
                  verticalAlign: 'top',
                }}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td
                style={{
                  border: '1px solid #e2e8f0',
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  color: '#334155',
                  verticalAlign: 'top',
                }}
              >
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}