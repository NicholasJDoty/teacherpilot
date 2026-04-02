import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { situation, currentStep, topic, grade, subject } = await req.json()

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      system: `You are a master teacher giving instant, actionable advice to a teacher mid-lesson. Be specific, practical, and immediate. Give ONE clear suggestion in 2-4 sentences max. Start with an action verb.`,
      messages: [{
        role: 'user',
        content: `A ${grade} ${subject} teacher is teaching "${topic}". They are currently on: "${currentStep}". Problem: ${situation}. What should they do RIGHT NOW?`
      }],
    })

    const suggestion = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ suggestion })
  } catch (error: any) {
    console.error('Pivot error:', error)
    return NextResponse.json({ suggestion: 'Pause the class, take a breath, and ask students to write down one thing they understand and one question they have. This resets energy and gives you useful data.' })
  }
}