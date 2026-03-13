import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard-shell'
import { requireUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { FREE_PLAN_MONTHLY_LIMIT, getPlan, getUsageForMonth } from '@/lib/usage'

type SavedOutputRow = {
  id: string
  tool?: string | null
  topic?: string | null
  subject?: string | null
  grade_level?: string | null
  created_at?: string | null
  content?: string | null
}

function formatDate(value?: string | null) {
  if (!value) return 'Recently saved'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently saved'

  return date.toLocaleDateString()
}

function makeOutputTitle(output: SavedOutputRow) {
  if (output.topic && output.subject) {
    return `${output.subject} — ${output.topic}`
  }

  if (output.topic) return output.topic
  if (output.subject) return output.subject
  if (output.tool) return output.tool.replaceAll('_', ' ')
  return 'Saved resource'
}

export default async function DashboardPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const plan = await getPlan(user.id)
  const usage = await getUsageForMonth(user.id)

  const { data } = await supabase
    .from('saved_outputs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(8)

  const savedOutputs = (data ?? []) as SavedOutputRow[]
  const usageLabel = plan === 'pro' ? 'Unlimited' : `${usage} / ${FREE_PLAN_MONTHLY_LIMIT}`
  const usagePercent =
    plan === 'pro'
      ? 100
      : Math.min((usage / FREE_PLAN_MONTHLY_LIMIT) * 100, 100)

  return (
    <DashboardShell>
      <div style={{ marginBottom: '28px' }}>
        <p
          style={{
            margin: '0 0 8px 0',
            color: '#64748b',
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          TeacherPilot workspace
        </p>

        <h1
          style={{
            margin: '0 0 10px 0',
            fontSize: '32px',
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          Welcome back
        </h1>

        <p
          style={{
            margin: 0,
            color: '#475569',
            fontSize: '15px',
            lineHeight: 1.7,
            maxWidth: '760px',
          }}
        >
          Generate classroom materials quickly, reopen saved work, and keep your teacher workflow in one place.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '18px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          marginBottom: '26px',
        }}
      >
        <div className="card" style={{ padding: '22px' }}>
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '12px',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Current plan
          </p>

          <h2
            style={{
              margin: '0 0 6px 0',
              fontSize: '28px',
              fontWeight: 800,
              color: '#0f172a',
            }}
          >
            {plan === 'pro' ? 'Pro' : 'Free'}
          </h2>

          <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
            {plan === 'pro'
              ? 'Unlimited classroom generation access.'
              : 'Free plan with limited monthly generations.'}
          </p>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '12px',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            This month’s usage
          </p>

          <h2
            style={{
              margin: '0 0 12px 0',
              fontSize: '28px',
              fontWeight: 800,
              color: '#0f172a',
            }}
          >
            {usageLabel}
          </h2>

          <div
            style={{
              width: '100%',
              height: '10px',
              background: '#e2e8f0',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${usagePercent}%`,
                height: '100%',
                background: '#0f172a',
              }}
            />
          </div>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '12px',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Quick actions
          </p>

          <div style={{ display: 'grid', gap: '10px' }}>
            <Link href="/generate" className="btn-primary">
              Generate new resource
            </Link>
            <Link href="/workflows" className="btn-secondary">
              Open workflow hub
            </Link>
            <Link href="/history" className="btn-secondary">
              View saved history
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.8fr)',
        }}
      >
        <div className="card" style={{ padding: '22px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2
                style={{
                  margin: '0 0 4px 0',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#0f172a',
                }}
              >
                Recent saved materials
              </h2>

              <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>
                Saved outputs teachers can reopen and reuse.
              </p>
            </div>

            <Link href="/history" style={{ color: '#0f172a', fontWeight: 700 }}>
              View all →
            </Link>
          </div>

          {savedOutputs.length === 0 ? (
            <div
              style={{
                border: '1px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '20px',
                color: '#64748b',
                lineHeight: 1.7,
              }}
            >
              No saved materials yet. Generate something, click save, and it will show up here.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {savedOutputs.map((output: SavedOutputRow) => (
                <Link
                  key={output.id}
                  href={`/history/${output.id}`}
                  style={{
                    display: 'block',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '16px',
                    background: '#ffffff',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '14px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: '0 0 6px 0',
                          fontSize: '17px',
                          fontWeight: 700,
                          color: '#0f172a',
                        }}
                      >
                        {makeOutputTitle(output)}
                      </h3>

                      <p
                        style={{
                          margin: '0 0 4px 0',
                          color: '#475569',
                          lineHeight: 1.6,
                          textTransform: 'capitalize',
                        }}
                      >
                        {(output.tool ?? 'resource').replaceAll('_', ' ')}
                      </p>

                      <p
                        style={{
                          margin: 0,
                          color: '#64748b',
                          fontSize: '13px',
                        }}
                      >
                        {output.grade_level ?? 'K–12'} • {formatDate(output.created_at)}
                      </p>
                    </div>

                    <div
                      style={{
                        borderRadius: '999px',
                        background: '#f1f5f9',
                        color: '#334155',
                        padding: '6px 10px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      Open
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          <div className="card" style={{ padding: '22px' }}>
            <h2
              style={{
                margin: '0 0 12px 0',
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
              }}
            >
              Best workflows
            </h2>

            <div style={{ display: 'grid', gap: '10px' }}>
              <Link href="/generate?tool=lesson_bundle" className="btn-secondary">
                Full lesson bundle
              </Link>
              <Link href="/generate?tool=slide_deck" className="btn-secondary">
                Teacher slides
              </Link>
              <Link href="/generate?tool=quiz_test" className="btn-secondary">
                Quiz / test
              </Link>
              <Link href="/generate?tool=parent_email" className="btn-secondary">
                Parent communication
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: '22px' }}>
            <h2
              style={{
                margin: '0 0 10px 0',
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
              }}
            >
              Upgrade value
            </h2>

            <p style={{ margin: '0 0 14px 0', color: '#475569', lineHeight: 1.7 }}>
              Teachers should feel like this tool saves real weekly planning time, not just produce text.
            </p>

            <Link href="/pricing" className="btn-primary">
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}