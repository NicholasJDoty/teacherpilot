import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'

function getPlanFromSubscriptionStatus(status: string) {
  if (status === 'active' || status === 'trialing') {
    return 'pro'
  }

  return 'free'
}

async function updateProfileByCustomerId(
  customerId: string,
  updates: {
    plan?: 'free' | 'pro'
    stripe_subscription_id?: string | null
    stripe_subscription_status?: string | null
  }
) {
  await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('stripe_customer_id', customerId)
}

async function attachCustomerToUser(customerId: string, userId: string) {
  await supabaseAdmin
    .from('profiles')
    .update({
      stripe_customer_id: customerId,
    })
    .eq('id', userId)
}

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Missing STRIPE_WEBHOOK_SECRET in environment variables.' },
        { status: 500 }
      )
    }

    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature header.' },
        { status: 400 }
      )
    }

    const body = await req.text()

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Invalid webhook signature.'

      return NextResponse.json({ error: message }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const customerId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id

        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id

        const userId = session.metadata?.supabase_user_id

        if (customerId && userId) {
          await attachCustomerToUser(customerId, userId)
        }

        if (customerId) {
          await updateProfileByCustomerId(customerId, {
            plan: 'pro',
            stripe_subscription_id: subscriptionId ?? null,
            stripe_subscription_status: 'active',
          })
        }

        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id

        await updateProfileByCustomerId(customerId, {
          plan: getPlanFromSubscriptionStatus(subscription.status),
          stripe_subscription_id: subscription.id,
          stripe_subscription_status: subscription.status,
        })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id

        await updateProfileByCustomerId(customerId, {
          plan: 'free',
          stripe_subscription_id: subscription.id,
          stripe_subscription_status: subscription.status,
        })

        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Stripe webhook failed.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}