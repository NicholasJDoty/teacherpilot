import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
    }

    const priceId = process.env.STRIPE_PRICE_ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing STRIPE_PRICE_ID in environment variables.' },
        { status: 500 }
      )
    }

    if (!appUrl) {
      return NextResponse.json(
        { error: 'Missing NEXT_PUBLIC_APP_URL in environment variables.' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    const referralCode = cookieStore.get('referral_code')?.value ?? null

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id ?? null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      })

      customerId = customer.id

      await supabaseAdmin
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
        })
        .eq('id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/settings?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      metadata: {
        supabase_user_id: user.id,
        referral_code: referralCode ?? '',
      },
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe checkout URL was not returned.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to start checkout.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}