import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const PROMPTS: Record<string, string> = {
  hook:     'Create an attention-grabbing lesson hook or opening activity. It should be surprising, curious, or provocative. Include exact wording for the teacher to use.',
  game:     'Create a fun, classroom-ready review game. Include exact instructions, rules, how to set it up, and how to run it. Should take 5-10 minutes.',
  debate:   'Create a debate or discussion activity. Include a clear controversial-but-appropriate prompt, sides students can take, sentence starters, and discussion facilitation tips.',
  movement: 'Create a movement break activity that connects to the lesson content. Should get students physically active while reinforcing learning. Include exact instructions.',
  scenario: 'Create a real-world scenario or application activity that connects the lesson to real life. Include a vivid scenario, guiding questions, and how to facilitate.',
  exit:     'Create an exit ticket with 3 questions: one factual recall, one application, one reflection. Include a simple grading rubric and what to do if students struggle.',
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { topic, activityType, activityLabel, userId } = await req.json()

    // Check pro status
    const { data: profile } = await supabase.from('profiles').select('is_pro, grade_levels, subjects, ell_percent, iep_percent').eq('id', userId).single()
    if (!profile?.is_pro) return NextResponse.json({ error: 'Pro required' }, { status: 403 })

    const contextLine = profile.grade_levels?.length
      ? `Grade: ${profile.grade_levels.join(', ')}, ELL: ${profile.ell_percent || 0}%, IEP: ${profile.iep_percent || 0}%`
      : ''

    const basePrompt = PROMPTS[activityType] || PROMPTS.hook

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 600,
      system: `You are a master K-12 teacher creating classroom-ready engagement activities. Be specific, practical, and immediately usable. Format clearly with headers.`,
      messages: [{
        role: 'user',
        content: `Topic: ${topic}\n${contextLine}\n\n${basePrompt}`
      }],
    })

    const output = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ output })
  } catch (error: any) {
    console.error('Engagement error:', error)
    return NextResponse.json({ error: 'Failed to generate activity' }, { status: 500 })
  }
}