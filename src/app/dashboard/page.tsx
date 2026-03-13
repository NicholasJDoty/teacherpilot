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
}

type ReferralRow = {
  code: string
  commission_percent: number
}

type CommissionRow = {
  commission_amount: number
}

function formatDate(value?: string | null) {
  if (!value) return 'Recently saved'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently saved'

  return date.toLocaleDateString()
}

function makeOutputTitle(output: SavedOutputRow) {
  if (output.topic && output.subject) return `${output.subject} — ${output.topic}`
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

  const { data: savedData } = await supabase
    .from('saved_outputs')
    .select('id, tool, topic, subject, grade_level, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(8)

  const { data: referralData } = await supabase
    .from('referrals')
    .select('code, commission_percent')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: commissionData } = await supabase
    .from('commissions')
    .select('commission_amount')
    .eq('referrer_user_id', user.id)

  const savedOutputs = (savedData ?? []) as SavedOutputRow[]
  const referral = (referralData ?? null) as ReferralRow | null
  const commissions = (commissionData ?? []) as CommissionRow[]

  const usageLabel =
    plan === 'pro' ? 'Unlimited' : `${usage} / ${FREE_PLAN_MONTHLY_LIMIT}`
  const usagePercent =
    plan === 'pro' ? 100 : Math.min((usage / FREE_PLAN_MONTHLY_LIMIT) * 100, 100)

  const totalCommissionCents = commissions.reduce(
    (sum, item) => sum + (item.commission_amount ?? 0),
    0
  )
  const totalCommissionDollars = (totalCommissionCents / 100).toFixed(2)
  const referralLink =
    referral && process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/?ref=${referral.code}`
      : null

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
          Generate classroom materials quickly, reopen saved work, and keep your teaching workflow in one place.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          marginBottom: '24px',
        }}
      >
        <Link href="/generate?tool=lesson_plan" className="btn-primary">
          Lesson Plan
        </Link>
        <Link href="/generate?tool=quiz_test" className="btn-secondary">
          Quiz / Test
        </Link>
        <Link href="/generate?tool=slide_deck" className="btn-secondary">
          Teacher Slides
        </Link>
        <Link href="/generate?tool=parent_email" className="btn-secondary">
          Parent Email
        </Link>
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
              marginBottom: '12px',
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

          {plan !== 'pro' && usage >= FREE_PLAN_MONTHLY_LIMIT && (
            <Link href="/pricing" className="btn-primary">
              Upgrade to Pro
            </Link>
          )}
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
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 0.85fr)',
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
              {savedOutputs.map((output) => (
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
          {referral && (
            <div className="card" style={{ padding: '22px' }}>
              <h2
                style={{
                  margin: '0 0 10px 0',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0f172a',
                }}
              >
                Partner link
              </h2>

              <p style={{ margin: '0 0 8px 0', color: '#475569', lineHeight: 1.7 }}>
                Referral code: <strong>{referral.code}</strong>
              </p>

              <p style={{ margin: '0 0 12px 0', color: '#475569', lineHeight: 1.7 }}>
                Commission rate: <strong>{referral.commission_percent}%</strong>
              </p>

              {referralLink && (
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '12px',
                    background: '#f8fafc',
                    wordBreak: 'break-all',
                    color: '#334155',
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}
                >
                  {referralLink}
                </div>
              )}
            </div>
          )}

          {referral && (
            <div className="card" style={{ padding: '22px' }}>
              <h2
                style={{
                  margin: '0 0 10px 0',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0f172a',
                }}
              >
                Tracked commissions
              </h2>

              <p style={{ margin: '0 0 12px 0', color: '#475569', lineHeight: 1.7 }}>
                Total commission value recorded from paid referrals.
              </p>

              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#0f172a',
                }}
              >
                ${totalCommissionDollars}
              </div>
            </div>
          )}

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
        </div>
      </div>
    </DashboardShell>
  )
}