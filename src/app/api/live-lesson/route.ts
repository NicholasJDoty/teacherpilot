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
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { topic, subject, grade, duration, userId } = await req.json()

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    const contextLine = profile?.profile_complete
      ? `Teacher context: ${grade || profile.grade_levels?.[0] || ''} grade, ${subject || profile.subjects?.[0] || ''}, ELL: ${profile.ell_percent || 0}%, IEP: ${profile.iep_percent || 0}%`
      : `Grade: ${grade}, Subject: ${subject}`

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      system: `You are a master teacher creating a real-time lesson guide. Return ONLY valid JSON, nothing else, no markdown, no backticks. Use this exact format:
{"title":"lesson title","steps":[{"time":"0:00","title":"Step name","instruction":"Exact instruction for the teacher","tip":"Optional quick tip","duration_seconds":300}]}

Rules: 6-10 steps for the class duration. Times like 0:00, 3:00, 8:00. Instructions are specific and actionable. Include hook, instruction, practice, closure.`,
      messages: [{
        role: 'user',
        content: `Create a live lesson guide for: ${topic}\n${contextLine}\nDuration: ${duration} minutes`
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const clean = text.replace(/```json|```/g, '').trim()
    
    let parsed
    try {
      parsed = JSON.parse(clean)
    } catch {
      return NextResponse.json({ error: 'Failed to parse lesson structure' }, { status: 500 })
    }

    const { data: savedSession } = await supabase
      .from('live_sessions')
      .insert({
        user_id:      userId,
        title:        parsed.title || topic,
        subject:      subject,
        grade_level:  grade,
        duration_min: duration,
        steps:        parsed.steps,
        status:       'live',
        started_at:   new Date().toISOString(),
      })
      .select()
      .single()

    return NextResponse.json({
      session: {
        ...savedSession,
        steps: parsed.steps,
      }
    })
  } catch (error: any) {
    console.error('Live lesson error:', error)
    return NextResponse.json({ error: 'Failed to generate lesson' }, { status: 500 })
  }
}