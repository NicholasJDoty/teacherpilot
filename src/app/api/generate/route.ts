import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const SYSTEM_PROMPT = `You are TeacherPilot, an expert AI assistant built specifically for K–12 teachers.

You create complete, classroom-ready resources — not outlines or suggestions. Everything you produce should be fully written, structured, and immediately usable by a teacher without editing.

Guidelines:
- Always format output clearly with headers, sections, and numbered/bulleted content where appropriate
- Include time estimates where relevant (e.g., "5 min", "15 min")
- When a teacher mentions ELL, IEP, 504, or differentiation needs — incorporate those automatically
- For lesson plans: always include objective, materials, bell ringer/hook, instruction, practice, closure, and assessment
- For quizzes: include answer keys at the end
- For rubrics: use a 4-3-2-1 scale unless told otherwise
- For parent emails: be warm, professional, and solution-focused
- For sub plans: be extremely detailed — assume the sub knows nothing about the class
- Write at a teacher-to-teacher level. Be concise but complete.`

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll()  { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { toolLabel, prompt, userId } = await req.json()

    // Check usage for free users
    const { data: profile } = await supabase.from('profiles').select('is_pro').eq('id', userId).single()
    if (!profile?.is_pro) {
      const start = new Date(); start.setDate(1); start.setHours(0,0,0,0)
      const { count } = await supabase.from('generations').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', start.toISOString())
      if ((count || 0) >= 10) return NextResponse.json({ error: 'Monthly limit reached. Upgrade to Pro.' }, { status: 403 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Please create a ${toolLabel} for the following:\n\n${prompt}` }],
    })

    const output = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ output })
  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 })
  }
}