import Link from 'next/link'
import { UpgradeButton } from '@/components/billing-buttons'

export function PricingCard({
  title,
  price,
  cta,
  features,
  pro = false,
}: {
  title: string
  price: string
  cta: string
  features: string[]
  pro?: boolean
}) {
  return (
    <div
      className="card"
      style={{
        padding: '28px',
        border: pro ? '2px solid #0f172a' : '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {pro && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            borderRadius: '999px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '6px 10px',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          Best value
        </div>
      )}

      <p
        style={{
          margin: '0 0 8px 0',
          fontSize: '14px',
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </p>

      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            fontSize: '38px',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.03em',
          }}
        >
          {price}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '10px', marginBottom: '24px' }}>
        {features.map((feature) => (
          <div
            key={feature}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#475569',
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: '#0f172a', fontWeight: 700 }}>✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {pro ? (
        <UpgradeButton className="btn-primary" label={cta} />
      ) : (
        <Link href="/signup" className="btn-secondary">
          {cta}
        </Link>
      )}
    </div>
  )
}