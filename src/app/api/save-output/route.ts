import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const user = await requireUser()
  const body = await req.json()

  const { error } = await supabaseAdmin.from('saved_outputs').insert({
    user_id: user.id,
    tool: body.tool,
    grade_level: body.gradeLevel,
    subject: body.subject,
    topic: body.topic,
    standards: body.standards,
    duration: body.duration,
    learning_objective: body.learningObjective,
    notes: body.notes,
    student_needs: body.studentNeeds,
    content: body.content,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}