import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// Simple in-memory rate limit — 1 demo per IP per hour
const demoUsage = new Map<string, number>()

export async function POST(req: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const lastUsed = demoUsage.get(ip) || 0
    const oneHour  = 60 * 60 * 1000

    if (Date.now() - lastUsed < oneHour) {
      return NextResponse.json({ error: 'Demo limit reached. Sign up free for 10 generations/month.' }, { status: 429 })
    }

    const { toolLabel, prompt } = await req.json()
    if (!toolLabel || !prompt) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    demoUsage.set(ip, Date.now())

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 800, // Shorter for demo
      system: `You are TeachersPilot, an AI assistant for K-12 teachers. Create a concise but complete ${toolLabel}. Format it clearly with headers and sections. This is a demo so keep it to about 300-400 words to give the teacher a strong taste of the quality.`,
      messages: [{ role: 'user', content: `Create a ${toolLabel} for: ${prompt}` }],
    })

    const output = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ output })
  } catch (error: any) {
    console.error('Demo error:', error)
    return NextResponse.json({ error: 'Demo failed. Please try again.' }, { status: 500 })
  }
}