import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getUserId(obj: any): string | null {
  return obj?.metadata?.userId || null
}

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub    = event.data.object as Stripe.Subscription
      const userId = getUserId(sub)
      if (!userId) break
      const isActive = ['active', 'trialing'].includes(sub.status)
      await supabase.from('profiles').upsert({
        id: userId,
        is_pro: isActive,
        stripe_customer_id:     sub.customer as string,
        stripe_subscription_id: sub.id,
        updated_at: new Date().toISOString(),
      })
      break
    }

    case 'customer.subscription.deleted': {
      const sub    = event.data.object as Stripe.Subscription
      const userId = getUserId(sub)
      if (!userId) break
      await supabase.from('profiles').update({
        is_pro: false,
        updated_at: new Date().toISOString(),
      }).eq('id', userId)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      // Pull subscription ID safely — it's a string ID or an expandable object
      const rawSub = (invoice as any).subscription
      const subId: string | null = typeof rawSub === 'string'
        ? rawSub
        : rawSub?.id ?? null
      if (!subId) break
      const sub    = await stripe.subscriptions.retrieve(subId)
      const userId = getUserId(sub)
      if (!userId) break
      await supabase.from('profiles').update({
        is_pro: false,
        updated_at: new Date().toISOString(),
      }).eq('id', userId)
      break
    }
  }

  return NextResponse.json({ received: true })
}