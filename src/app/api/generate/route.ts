import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const BASE_SYSTEM_PROMPT = `You are TeachersPilot, an expert AI assistant built specifically for K–12 teachers.

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

function buildSystemPrompt(profile: any): string {
  if (!profile || !profile.profile_complete) return BASE_SYSTEM_PROMPT

  const parts: string[] = [BASE_SYSTEM_PROMPT, '\n\n--- TEACHER\'S CLASSROOM CONTEXT (use this automatically in every response) ---']

  if (profile.display_name)
    parts.push(`Teacher name: ${profile.display_name}`)
  if (profile.school_name)
    parts.push(`School: ${profile.school_name}`)
  if (profile.state)
    parts.push(`State: ${profile.state}`)
  if (profile.grade_levels?.length)
    parts.push(`Grade levels: ${profile.grade_levels.join(', ')}`)
  if (profile.subjects?.length)
    parts.push(`Subjects: ${profile.subjects.join(', ')}`)
  if (profile.standards)
    parts.push(`Standards: ${profile.standards} — align all outputs to these standards`)
  if (profile.teaching_style)
    parts.push(`Teaching style: ${profile.teaching_style} — design activities to match this approach`)
  if (profile.class_size)
    parts.push(`Class size: ${profile.class_size} students`)
  if (profile.ell_percent > 0)
    parts.push(`ELL students: ${profile.ell_percent}% — always include ELL scaffolds and language supports`)
  if (profile.iep_percent > 0)
    parts.push(`IEP/504 students: ${profile.iep_percent}% — always include differentiation and accommodations`)
  if (profile.additional_context)
    parts.push(`Additional context: ${profile.additional_context}`)

  parts.push('\nIMPORTANT: Never ask the teacher to provide information that is already in their classroom context above. Use it automatically and silently.')

  return parts.join('\n')
}

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

    // Get profile for context injection + pro check
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Check usage for free users
    if (!profile?.is_pro) {
      const start = new Date(); start.setDate(1); start.setHours(0,0,0,0)
      const { count } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', start.toISOString())
      if ((count || 0) >= 10)
        return NextResponse.json({ error: 'Monthly limit reached. Upgrade to Pro.' }, { status: 403 })
    }

    // Build personalized system prompt
    const systemPrompt = buildSystemPrompt(profile)

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Please create a ${toolLabel} for the following:\n\n${prompt}` }],
    })

    const output = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ output })
  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 })
  }
}