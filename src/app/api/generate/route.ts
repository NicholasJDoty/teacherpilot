import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase-server'

type GeneratePayload = {
  tool?: string
  gradeLevel?: string
  subject?: string
  topic?: string
  standards?: string
  duration?: string
  learningObjective?: string
  notes?: string
  studentNeeds?: string
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const FREE_LIMIT = 10

function labelTool(tool?: string) {
  if (!tool) return 'teacher resource'
  return tool.replaceAll('_', ' ')
}

function buildPrompt(payload: GeneratePayload) {
  return `
Create a classroom-ready ${labelTool(payload.tool)} for a teacher.

Requirements:
- Tool: ${labelTool(payload.tool)}
- Grade level: ${payload.gradeLevel || 'Not provided'}
- Subject: ${payload.subject || 'Not provided'}
- Topic: ${payload.topic || 'Not provided'}
- Standards: ${payload.standards || 'Not provided'}
- Duration: ${payload.duration || 'Not provided'}
- Learning objective: ${payload.learningObjective || 'Not provided'}
- Student needs / accommodations: ${payload.studentNeeds || 'Not provided'}
- Additional notes: ${payload.notes || 'Not provided'}

Instructions:
- Write for a real teacher who needs something usable immediately.
- Be specific and practical, not vague.
- Use clear section headings.
- Include accommodations when relevant.
- Do not ask follow-up questions.
- Do not end with an open-ended question.
- Make the output polished, professional, and classroom-ready.
`.trim()
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GeneratePayload
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
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are TeacherPilot, an expert K-12 teacher assistant that creates classroom-ready materials teachers can use quickly.',
        },
        {
          role: 'user',
          content: buildPrompt(body),
        },
      ],
    })

    const content = completion.choices[0]?.message?.content?.trim()

    if (!content) {
      return NextResponse.json(
        { error: 'No content was generated. Please try again.' },
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
          { error: 'Content generated, but usage could not be updated.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ content })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Generation failed.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}