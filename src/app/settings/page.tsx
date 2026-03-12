import { DashboardShell } from '@/components/dashboard-shell'
import { requireUser } from '@/lib/auth'
import { getPlan } from '@/lib/usage'
import { BillingPortalButton, UpgradeButton } from '@/components/billing-buttons'

export default async function SettingsPage() {
  const user = await requireUser()
  const plan = await getPlan(user.id)

  return (
    <DashboardShell>
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            margin: '0 0 8px 0',
            fontSize: '30px',
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          Settings
        </h1>

        <p
          style={{
            margin: 0,
            color: '#64748b',
            fontSize: '15px',
            lineHeight: 1.7,
          }}
        >
          Manage your plan and billing access.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <div className="card" style={{ padding: '22px' }}>
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '13px',
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
              margin: '0 0 10px 0',
              fontSize: '24px',
              fontWeight: 800,
              color: '#0f172a',
            }}
          >
            {plan === 'pro' ? 'Pro' : 'Free'}
          </h2>

          <p
            style={{
              margin: '0 0 16px 0',
              color: '#475569',
              lineHeight: 1.7,
            }}
          >
            {plan === 'pro'
              ? 'You have full access to TeacherPilot’s higher-volume workflow.'
              : 'Upgrade to unlock unlimited generations and your best teacher workflow.'}
          </p>

          {plan === 'pro' ? (
            <BillingPortalButton />
          ) : (
            <UpgradeButton />
          )}
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '13px',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Billing
          </p>

          <p
            style={{
              margin: '0 0 16px 0',
              color: '#475569',
              lineHeight: 1.7,
            }}
          >
            Use the billing portal to update payment details, manage your subscription,
            or cancel if needed.
          </p>

          <BillingPortalButton />
        </div>
      </div>
    </DashboardShell>
  )
}