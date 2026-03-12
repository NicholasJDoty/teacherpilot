import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <section className="container-page" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
        <div className="card" style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
          <h1
            style={{
              margin: '0 0 16px 0',
              fontSize: '36px',
              fontWeight: 800,
              color: '#0f172a',
            }}
          >
            Terms of Service
          </h1>

          <div style={{ color: '#475569', lineHeight: 1.8, display: 'grid', gap: '16px' }}>
            <p>
              TeacherPilot provides AI-assisted teacher workflow tools for lesson planning,
              assessment creation, communication drafting, and related classroom preparation.
            </p>

            <p>
              Users are responsible for reviewing generated content before classroom use.
              TeacherPilot may produce mistakes, and outputs should be checked for accuracy,
              appropriateness, and alignment with local standards and school policies.
            </p>

            <p>
              Paid subscriptions renew according to the billing terms shown at checkout.
              Billing is managed through Stripe.
            </p>

            <p>
              TeacherPilot may update, improve, or discontinue features over time.
              Misuse of the service, including unlawful or harmful activity, may result in account termination.
            </p>

            <p>
              By using TeacherPilot, you agree to use the product responsibly and review generated materials before distribution.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}