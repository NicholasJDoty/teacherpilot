import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

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

    const { topic, worked, didnt, struggled, userId } = await req.json()

    // Check pro status
    const { data: profile } = await supabase.from('profiles').select('is_pro, *').eq('id', userId).single()
    if (!profile?.is_pro) return NextResponse.json({ error: 'Pro required' }, { status: 403 })

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 800,
      system: `You are an expert instructional coach giving a teacher specific, actionable feedback after a lesson. Be encouraging but honest. Give concrete, implementable suggestions. Structure your response with clear sections.`,
      messages: [{
        role: 'user',
        content: `Lesson: ${topic}
What worked: ${worked || 'Not specified'}
What didn't work: ${didnt || 'Not specified'}
Who struggled: ${struggled || 'Not specified'}
${profile?.grade_levels ? `Grade: ${profile.grade_levels.join(', ')}` : ''}
${profile?.ell_percent > 0 ? `ELL students: ${profile.ell_percent}%` : ''}

Give me:
1. What to do differently next time (2-3 specific changes)
2. A targeted intervention for the students who struggled
3. How to reteach the parts that didn't land
4. One quick win to start the next class`
      }],
    })

    const suggestions = message.content[0].type === 'text' ? message.content[0].text : ''

    // Save to database
    await supabase.from('post_lessons').insert({
      user_id:        userId,
      what_worked:    worked,
      what_didnt:     didnt,
      who_struggled:  struggled,
      ai_suggestions: suggestions,
    })

    return NextResponse.json({ suggestions })
  } catch (error: any) {
    console.error('Post-lesson error:', error)
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}