import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TeacherPilot',
  description: 'AI lesson planning and teacher workflow software',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}