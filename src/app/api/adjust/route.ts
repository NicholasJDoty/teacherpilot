import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase-server'

type AdjustPayload = {
  currentContent?: string
  adjustment?: string
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const FREE_LIMIT = 10

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AdjustPayload
    const currentContent = body.currentContent?.trim() ?? ''
    const adjustment = body.adjustment?.trim() ?? ''

    if (!currentContent) {
      return NextResponse.json({ error: 'Missing current content.' }, { status: 400 })
    }

    if (!adjustment) {
      return NextResponse.json({ error: 'Enter an adjustment request.' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan, generations_used')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Unable to load your account usage right now.' },
        { status: 500 }
      )
    }

    const plan = profile?.plan ?? 'free'
    const generationsUsed = profile?.generations_used ?? 0

    if (plan !== 'pro' && generationsUsed >= FREE_LIMIT) {
      return NextResponse.json(
        {
          error: `You have used all ${FREE_LIMIT} free generations. Upgrade to Pro to keep generating.`,
        },
        { status: 403 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'You are TeacherPilot, an expert K-12 teacher assistant. Update the existing classroom resource by applying only the requested change. Keep everything else intact unless a small consistency fix is necessary. Return the full updated resource in polished markdown. Do not ask follow-up questions.',
        },
        {
          role: 'user',
          content: `Current resource:\n\n${currentContent}\n\nRequested adjustment:\n\n${adjustment}`,
        },
      ],
    })

    const content = completion.choices[0]?.message?.content?.trim()

    if (!content) {
      return NextResponse.json(
        { error: 'No adjusted content was generated. Please try again.' },
        { status: 500 }
      )
    }

    if (plan !== 'pro') {
      const nextCount = generationsUsed + 1

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ generations_used: nextCount })
        .eq('id', user.id)

      if (updateError) {
        return NextResponse.json(
          { error: 'Content updated, but usage could not be updated.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ content })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Adjustment failed.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}