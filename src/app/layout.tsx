import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TeacherPilot — Your AI Teaching Assistant',
  description: 'Create lesson plans, quizzes, rubrics, sub plans, and parent emails in minutes. Built for real K–12 teachers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}