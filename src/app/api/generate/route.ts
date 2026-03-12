import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { canGenerate } from '@/lib/usage'
import { buildTeacherPrompt } from '@/lib/prompts'
import { openai } from '@/lib/openai'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { GeneratePayload } from '@/types'

function cleanEnding(text: string) {
  return text
    .replace(/\n+If you want, I can:[\s\S]*$/i, '')
    .replace(/\n+Would you like[\s\S]*$/i, '')
    .replace(/\n+Which would you like[\s\S]*$/i, '')
    .replace(/\n+Let me know if you'd like[\s\S]*$/i, '')
    .trim()
}

function cleanRubricTable(text: string) {
  return text.replace(/\|[ \t]*\n/g, '|\n')
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
    }

    const body = (await req.json()) as GeneratePayload

    const permission = await canGenerate(user.id)

    if (!permission.allowed) {
      return NextResponse.json(
        { error: 'Free plan limit reached. Upgrade to Pro.' },
        { status: 403 }
      )
    }

    const prompt = buildTeacherPrompt(body)

    const response = await openai.responses.create({
      model: 'gpt-5-mini',
      input: prompt,
    })

    let content = response.output_text || ''

    content = cleanEnding(content)

    if (body.tool === 'rubric') {
      content = cleanRubricTable(content)
    }

    await supabaseAdmin.from('usage_events').insert({
      user_id: user.id,
      event_type: 'generation',
      tool: body.tool,
    })

    return NextResponse.json({ content })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Generation failed.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}