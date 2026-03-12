import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <section className="container-page" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
        <div className="hero-grid">
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#e2e8f0',
                color: '#334155',
                borderRadius: '999px',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '18px',
              }}
            >
              Built for real K–12 teachers
            </div>

            <h1 className="hero-title">
              Create lesson plans, quizzes, rubrics, and parent emails in minutes.
            </h1>

            <p className="hero-subtitle">
              TeacherPilot helps teachers turn one classroom need into a ready-to-use resource.
              Generate structured materials, save them, reopen them later, and export them to PDF
              without starting from scratch every time.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '24px',
              }}
            >
              <Link href="/signup" className="btn-primary">
                Start free
              </Link>

              <Link href="/pricing" className="btn-secondary">
                See pricing
              </Link>
            </div>

            <div className="hero-checks">
              <span>✓ 10 free generations each month</span>
              <span>✓ Save and reopen outputs</span>
              <span>✓ Export to PDF</span>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '24px',
              background: '#ffffff',
            }}
          >
            <div
              style={{
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '14px',
                marginBottom: '16px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Example workflow
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '14px',
              }}
            >
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '14px',
                  background: '#f8fafc',
                }}
              >
                <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#64748b' }}>
                  Input
                </p>
                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
                  5th Grade Science — The Water Cycle
                </p>
                <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                  Need a 45-minute lesson plan with ELL supports, exit ticket, and homework.
                </p>
              </div>

              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '14px',
                  background: '#ffffff',
                }}
              >
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' }}>
                  Output
                </p>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div
                    style={{
                      background: '#eff6ff',
                      color: '#1e3a8a',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    Full lesson plan
                  </div>
                  <div
                    style={{
                      background: '#f8fafc',
                      color: '#334155',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      fontSize: '14px',
                    }}
                  >
                    Bell ringer + mini-lesson
                  </div>
                  <div
                    style={{
                      background: '#f8fafc',
                      color: '#334155',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      fontSize: '14px',
                    }}
                  >
                    Accommodations for ELL / IEP / 504
                  </div>
                  <div
                    style={{
                      background: '#f8fafc',
                      color: '#334155',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      fontSize: '14px',
                    }}
                  >
                    Exit ticket + homework
                  </div>
                </div>
              </div>

              <div className="stats-grid">
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '14px',
                  }}
                >
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#64748b' }}>
                    Time saved
                  </p>
                  <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
                    1–3 hrs
                  </p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                    per week for many teachers
                  </p>
                </div>

                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '14px',
                  }}
                >
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#64748b' }}>
                    Built for
                  </p>
                  <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
                    K–12
                  </p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                    classroom workflows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page" style={{ paddingBottom: '72px' }}>
        <div className="three-col-grid">
          <div className="card" style={{ padding: '24px' }}>
            <h3
              style={{
                margin: '0 0 12px 0',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              Generate classroom-ready materials
            </h3>
            <p style={{ margin: 0, color: '#475569', lineHeight: 1.7 }}>
              Create lesson plans, unit outlines, quizzes, answer keys, rubrics, sub plans,
              parent emails, and more from one structured prompt.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3
              style={{
                margin: '0 0 12px 0',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              Save, reopen, and reuse
            </h3>
            <p style={{ margin: 0, color: '#475569', lineHeight: 1.7 }}>
              Keep a growing library of your teacher resources. Reopen saved work later,
              copy it into Docs or Slides, or export it as a PDF.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3
              style={{
                margin: '0 0 12px 0',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              Built for actual teacher pain points
            </h3>
            <p style={{ margin: 0, color: '#475569', lineHeight: 1.7 }}>
              TeacherPilot is focused on repetitive teacher work that eats time every week:
              planning, assessment, differentiation, communication, and admin tasks.
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div className="container-page" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p
              style={{
                margin: '0 0 10px 0',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              What teachers can create
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: '38px',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.03em',
              }}
            >
              The tools teachers use every week
            </h2>
          </div>

          <div className="feature-chip-grid">
            {[
              'Lesson plans',
              'Unit plans',
              'Bell ringers',
              'Assignments',
              'Quizzes and tests',
              'Answer keys',
              'Rubrics',
              'Parent emails',
              'Sub plans',
              'Differentiation supports',
              'Report card comments',
              'Study guides',
            ].map((item) => (
              <div
                key={item}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  background: '#f8fafc',
                  padding: '16px 18px',
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
        <div
          className="card"
          style={{
            padding: '36px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          <p
            style={{
              margin: '0 0 12px 0',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#64748b',
              textTransform: 'uppercase',
            }}
          >
            Simple pricing
          </p>

          <h2
            style={{
              margin: '0 0 12px 0',
              fontSize: '40px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em',
            }}
          >
            Start free. Upgrade when it becomes part of your workflow.
          </h2>

          <p
            style={{
              margin: '0 auto 22px auto',
              maxWidth: '760px',
              color: '#475569',
              lineHeight: 1.7,
              fontSize: '18px',
            }}
          >
            Free includes 10 generations each month. Pro unlocks unlimited generations,
            full history, and the features teachers use repeatedly.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary">
              Start free
            </Link>

            <Link href="/pricing" className="btn-secondary">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}