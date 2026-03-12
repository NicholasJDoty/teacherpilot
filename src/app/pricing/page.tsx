import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PricingCard } from '@/components/pricing-card'

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <section className="container-page" style={{ paddingTop: '72px', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
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
            Pricing
          </p>

          <h1
            style={{
              margin: '0 0 14px 0',
              fontSize: '46px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em',
            }}
          >
            Pay for it only if it actually saves you time.
          </h1>

          <p
            style={{
              margin: '0 auto',
              maxWidth: '700px',
              color: '#475569',
              fontSize: '18px',
              lineHeight: 1.7,
            }}
          >
            TeacherPilot is built for repetitive teacher work that shows up every week:
            planning, assessment, differentiation, communication, and classroom admin.
            Start free. Upgrade when it becomes part of your routine.
          </p>
        </div>
      </section>

      <section className="container-page" style={{ paddingBottom: '40px' }}>
        <div
          style={{
            maxWidth: '980px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <PricingCard
            title="Free"
            price="$0"
            cta="Create free account"
            features={[
              '10 generations per month',
              'Lesson plans, quizzes, rubrics, emails, and more',
              'Save and reopen outputs',
              'Copy and PDF export',
            ]}
          />

          <PricingCard
            title="Pro"
            price="$19/month"
            cta="Upgrade to Pro"
            pro
            features={[
              'Unlimited generations',
              'Full workflow hub access',
              'Best for teachers who use it every week',
              'Google Slides export for teacher presentations',
            ]}
          />
        </div>
      </section>

      <section className="container-page" style={{ paddingBottom: '40px' }}>
        <div
          style={{
            maxWidth: '980px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          <div className="card" style={{ padding: '22px' }}>
            <h2
              style={{
                margin: '0 0 10px 0',
                fontSize: '18px',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              Free is for proving the value
            </h2>

            <p style={{ margin: 0, color: '#475569', lineHeight: 1.7 }}>
              Use the free plan to test the actual workflow: generate, save, reopen,
              export, and see whether it saves real teacher time.
            </p>
          </div>

          <div className="card" style={{ padding: '22px' }}>
            <h2
              style={{
                margin: '0 0 10px 0',
                fontSize: '18px',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              Pro is for weekly classroom use
            </h2>

            <p style={{ margin: 0, color: '#475569', lineHeight: 1.7 }}>
              The paid plan makes the most sense for teachers regularly building lesson
              plans, assessments, slides, accommodations, sub plans, and communication.
            </p>
          </div>

          <div className="card" style={{ padding: '22px' }}>
            <h2
              style={{
                margin: '0 0 10px 0',
                fontSize: '18px',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              Why teachers would pay
            </h2>

            <p style={{ margin: 0, color: '#475569', lineHeight: 1.7 }}>
              If TeacherPilot saves even 1–3 hours per week, the subscription is easy
              to justify. That is the standard the product should meet.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}