export const BUNDLE_SECTION_NAMES = [
  'Teacher Slides',
  'Student Worksheet',
  'Exit Ticket',
  'Google Form Quiz',
] as const

export function slugifySection(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function getBundleSections(content: string) {
  return BUNDLE_SECTION_NAMES.filter((section) =>
    content.toLowerCase().includes(`## ${section}`.toLowerCase())
  )
}

export function extractBundleSection(content: string, sectionName: string) {
  const escaped = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`##\\s*${escaped}([\\s\\S]*?)(?=\\n##\\s+|$)`, 'i')
  const match = content.match(regex)

  if (!match?.[1]) return ''

  return `## ${sectionName}\n${match[1].trim()}`
}