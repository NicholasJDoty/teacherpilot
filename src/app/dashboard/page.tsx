import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard-shell'
import { requireUser } from '@/lib/auth'
import { FREE_PLAN_MONTHLY_LIMIT, getUsageForMonth, getPlan } from '@/lib/usage'

export default async function DashboardPage() {
  const user = await requireUser()

  const usage = await getUsageForMonth(user.id)
  const plan = await getPlan(user.id)

  const limitLabel = plan === 'pro' ? 'Unlimited' : String(FREE_PLAN_MONTHLY_LIMIT)
  const usagePercent =
    plan === 'pro'
      ? 0
      : Math.min((usage / FREE_PLAN_MONTHLY_LIMIT) * 100, 100)

  return (
    <DashboardShell>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '6px',
          }}
        >
          Dashboard
        </h1>

        <p style={{ color: '#64748b' }}>
          Manage your teacher workspace and generation usage.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '30px',
        }}
      >
        <div className="card" style={{ padding: '20px' }}>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Current plan</p>

          <p
            style={{
              fontSize: '22px',
              fontWeight: 700,
              marginTop: '6px',
              marginBottom: '8px',
            }}
          >
            {plan === 'pro' ? 'Pro' : 'Free'}
          </p>

          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            {plan === 'pro'
              ? 'Unlimited generations and full history access.'
              : 'Upgrade for unlimited generations and full workflow access.'}
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            This month&apos;s generations
          </p>

          <p
            style={{
              fontSize: '22px',
              fontWeight: 700,
              marginTop: '6px',
              marginBottom: '12px',
            }}
          >
            {usage} / {limitLabel}
          </p>

          {plan !== 'pro' && (
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
          )}
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Best next step</p>

          <Link
            href="/workflows"
            style={{
              display: 'inline-block',
              marginTop: '8px',
              fontWeight: 600,
              color: '#0f172a',
            }}
          >
            Open workflow hub →
          </Link>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <div className="card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>
            Fast actions
          </h2>

          <div style={{ marginTop: '12px', display: 'grid', gap: '8px' }}>
            <Link href="/workflows" className="btn-secondary">
              Open workflow hub
            </Link>

            <Link href="/generate?tool=lesson_bundle" className="btn-secondary">
              Build full lesson bundle
            </Link>

            <Link href="/generate?tool=slide_deck" className="btn-secondary">
              Build slide deck
            </Link>

            <Link href="/history" className="btn-secondary">
              View saved history
            </Link>
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>
            Recommended teacher workflows
          </h2>

          <ul
            style={{
              marginTop: '12px',
              paddingLeft: '16px',
              color: '#475569',
              lineHeight: 1.6,
            }}
          >
            <li>Complete lesson bundle for tomorrow</li>
            <li>Quiz / test with answer key</li>
            <li>Google Slides export for direct teaching</li>
            <li>Differentiation support for mixed readiness levels</li>
          </ul>
        </div>
      </div>
    </DashboardShell>
  )
}