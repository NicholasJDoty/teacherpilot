type SlideContent = {
  title: string
  subtitle?: string
  bullets: string[]
  type: 'title' | 'objective' | 'content' | 'question' | 'activity' | 'exit_ticket'
}

type GooglePageElement = {
  objectId?: string
}

type GoogleSlide = {
  objectId?: string
  pageElements?: GooglePageElement[]
}

type GooglePresentation = {
  presentationId: string
  slides?: GoogleSlide[]
}

declare global {
  interface Window {
    google?: any
  }
}

let cachedAccessToken: string | null = null
let cachedTokenExpiresAt = 0

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function stripMarkdown(text: string) {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim()
}

function extractTeacherSlidesSection(markdown: string) {
  const bundleMatch = markdown.match(
    /##\s*Teacher Slides([\s\S]*?)(?=\n##\s+|$)/i
  )

  if (bundleMatch?.[1]) {
    return bundleMatch[1].trim()
  }

  return markdown.trim()
}

function detectSlideType(title: string, index: number): SlideContent['type'] {
  const lower = title.toLowerCase()

  if (index === 0) return 'title'
  if (lower.includes('objective')) return 'objective'
  if (lower.includes('discussion') || lower.includes('think-pair-share') || lower.includes('question')) {
    return 'question'
  }
  if (lower.includes('activity') || lower.includes('guided practice') || lower.includes('practice')) {
    return 'activity'
  }
  if (lower.includes('exit ticket')) return 'exit_ticket'

  return 'content'
}

function parseSlides(markdown: string, titleHint?: string) {
  const source = extractTeacherSlidesSection(markdown)
  const slideBlocks = source
    .split(/\n(?=###\s*Slide\s+\d+)/i)
    .map((block) => block.trim())
    .filter(Boolean)

  const slides: SlideContent[] = []

  for (let blockIndex = 0; blockIndex < slideBlocks.length; blockIndex += 1) {
    const block = slideBlocks[blockIndex]
    const lines = block.split('\n').map((line) => line.trim())
    let title = ''
    let subtitle = ''
    const bullets: string[] = []

    for (const line of lines) {
      if (/^###\s*Slide\s+\d+/i.test(line)) continue

      if (/^Title:\s*/i.test(line)) {
        title = line.replace(/^Title:\s*/i, '').trim()
        continue
      }

      if (/^Subtitle:\s*/i.test(line)) {
        subtitle = line.replace(/^Subtitle:\s*/i, '').trim()
        continue
      }

      if (/^Bullets:\s*/i.test(line)) {
        const after = line.replace(/^Bullets:\s*/i, '').trim()
        if (after) bullets.push(stripMarkdown(after))
        continue
      }

      if (/^-\s+/.test(line)) {
        bullets.push(stripMarkdown(line.replace(/^-\s+/, '')))
      }
    }

    if (title || subtitle || bullets.length > 0) {
      slides.push({
        title: title || 'Content',
        subtitle: subtitle || undefined,
        bullets,
        type: detectSlideType(title || 'Content', blockIndex),
      })
    }
  }

  if (slides.length === 0) {
    const fallbackTitle =
      titleHint ||
      markdown
        .split('\n')
        .map((line) => line.trim())
        .find(Boolean) ||
      'TeacherPilot Slide Deck'

    return [
      {
        title: fallbackTitle,
        subtitle: 'Created with TeacherPilot',
        bullets: [
          'This export needs structured slide formatting.',
          'Use the Slide Deck or Complete Lesson Bundle generator for best results.',
        ],
        type: 'title' as const,
      },
    ]
  }

  return slides
}

function loadGoogleIdentityScript() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Slides export must run in the browser.'))
      return
    }

    if (window.google?.accounts?.oauth2) {
      resolve()
      return
    }

    const existing = document.getElementById('google-identity-services-script')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Google Identity Services.'))
      )
      return
    }

    const script = document.createElement('script')
    script.id = 'google-identity-services-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Identity Services.'))
    document.head.appendChild(script)
  })
}

async function getGoogleAccessToken() {
  if (cachedAccessToken && Date.now() < cachedTokenExpiresAt) {
    return cachedAccessToken
  }

  await loadGoogleIdentityScript()

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  if (!clientId) {
    throw new Error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local')
  }

  return new Promise<string>((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/presentations',
      callback: (response: any) => {
        if (!response?.access_token) {
          reject(new Error('Google did not return an access token.'))
          return
        }

        cachedAccessToken = response.access_token
        cachedTokenExpiresAt = Date.now() + ((response.expires_in || 3600) - 60) * 1000
        resolve(response.access_token)
      },
      error_callback: () => {
        reject(new Error('Google authorization failed or was cancelled.'))
      },
    })

    tokenClient.requestAccessToken({
      prompt: cachedAccessToken ? '' : 'consent',
    })
  })
}

async function googleApiFetch<T>(url: string, accessToken: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (!response.ok) {
    throw new Error(data.error?.message || 'Google API request failed.')
  }

  return data as T
}

function buildTitleSlideRequests(firstSlideId: string, slide: SlideContent) {
  const titleBoxId = makeId('title_box')
  const subtitleBoxId = makeId('subtitle_box')
  const accentBoxId = makeId('accent_box')

  return [
    {
      createShape: {
        objectId: accentBoxId,
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: firstSlideId,
          size: {
            width: { magnitude: 720, unit: 'PT' },
            height: { magnitude: 24, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0,
            unit: 'PT',
          },
        },
      },
    },
    {
      updateShapeProperties: {
        objectId: accentBoxId,
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: {
              color: {
                rgbColor: {
                  red: 0.06,
                  green: 0.09,
                  blue: 0.16,
                },
              },
            },
          },
          outline: {
            propertyState: 'NOT_RENDERED',
          },
        },
        fields: 'shapeBackgroundFill.solidFill.color,outline.propertyState',
      },
    },
    {
      createShape: {
        objectId: titleBoxId,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: firstSlideId,
          size: {
            width: { magnitude: 560, unit: 'PT' },
            height: { magnitude: 90, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 70,
            translateY: 135,
            unit: 'PT',
          },
        },
      },
    },
    {
      insertText: {
        objectId: titleBoxId,
        insertionIndex: 0,
        text: slide.title,
      },
    },
    {
      updateTextStyle: {
        objectId: titleBoxId,
        style: {
          fontFamily: 'Arial',
          fontSize: { magnitude: 28, unit: 'PT' },
          bold: true,
          foregroundColor: {
            opaqueColor: {
              rgbColor: {
                red: 0.06,
                green: 0.09,
                blue: 0.16,
              },
            },
          },
        },
        textRange: {
          type: 'ALL',
        },
        fields: 'fontFamily,fontSize,bold,foregroundColor',
      },
    },
    {
      createShape: {
        objectId: subtitleBoxId,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: firstSlideId,
          size: {
            width: { magnitude: 560, unit: 'PT' },
            height: { magnitude: 40, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 70,
            translateY: 255,
            unit: 'PT',
          },
        },
      },
    },
    {
      insertText: {
        objectId: subtitleBoxId,
        insertionIndex: 0,
        text: slide.subtitle || 'Created with TeacherPilot',
      },
    },
    {
      updateTextStyle: {
        objectId: subtitleBoxId,
        style: {
          fontFamily: 'Arial',
          fontSize: { magnitude: 18, unit: 'PT' },
          foregroundColor: {
            opaqueColor: {
              rgbColor: {
                red: 0.28,
                green: 0.35,
                blue: 0.45,
              },
            },
          },
        },
        textRange: {
          type: 'ALL',
        },
        fields: 'fontFamily,fontSize,foregroundColor',
      },
    },
  ]
}

function buildStandardSlideRequests(slideId: string, slide: SlideContent, index: number) {
  const titleId = makeId(`slide_title_${index}`)
  const bodyId = makeId(`slide_body_${index}`)
  const accentId = makeId(`slide_accent_${index}`)

  const isQuestion = slide.type === 'question'
  const isActivity = slide.type === 'activity'
  const isObjective = slide.type === 'objective'
  const isExitTicket = slide.type === 'exit_ticket'

  const bodyText =
    slide.type === 'question'
      ? slide.bullets.join('\n')
      : slide.bullets.map((bullet) => `• ${bullet}`).join('\n')

  const titleColor = isQuestion
    ? { red: 0.11, green: 0.23, blue: 0.54 }
    : isActivity
    ? { red: 0.04, green: 0.39, blue: 0.27 }
    : isExitTicket
    ? { red: 0.49, green: 0.20, blue: 0.04 }
    : { red: 0.06, green: 0.09, blue: 0.16 }

  const accentColor = isQuestion
    ? { red: 0.86, green: 0.92, blue: 1.0 }
    : isActivity
    ? { red: 0.89, green: 0.97, blue: 0.92 }
    : isExitTicket
    ? { red: 1.0, green: 0.95, blue: 0.89 }
    : isObjective
    ? { red: 0.93, green: 0.96, blue: 1.0 }
    : { red: 0.97, green: 0.98, blue: 1.0 }

  return [
    {
      createShape: {
        objectId: accentId,
        shapeType: 'ROUND_RECTANGLE',
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: 'PT' },
            height: { magnitude: isQuestion ? 230 : 300, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 60,
            translateY: 90,
            unit: 'PT',
          },
        },
      },
    },
    {
      updateShapeProperties: {
        objectId: accentId,
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: {
              color: {
                rgbColor: accentColor,
              },
            },
          },
          outline: {
            propertyState: 'NOT_RENDERED',
          },
        },
        fields: 'shapeBackgroundFill.solidFill.color,outline.propertyState',
      },
    },
    {
      createShape: {
        objectId: titleId,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 560, unit: 'PT' },
            height: { magnitude: 40, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 80,
            translateY: 35,
            unit: 'PT',
          },
        },
      },
    },
    {
      insertText: {
        objectId: titleId,
        insertionIndex: 0,
        text: slide.title,
      },
    },
    {
      updateTextStyle: {
        objectId: titleId,
        style: {
          fontFamily: 'Arial',
          fontSize: { magnitude: 22, unit: 'PT' },
          bold: true,
          foregroundColor: {
            opaqueColor: {
              rgbColor: titleColor,
            },
          },
        },
        textRange: {
          type: 'ALL',
        },
        fields: 'fontFamily,fontSize,bold,foregroundColor',
      },
    },
    {
      createShape: {
        objectId: bodyId,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 520, unit: 'PT' },
            height: { magnitude: isQuestion ? 170 : 220, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 95,
            translateY: isQuestion ? 140 : 125,
            unit: 'PT',
          },
        },
      },
    },
    {
      insertText: {
        objectId: bodyId,
        insertionIndex: 0,
        text: bodyText || ' ',
      },
    },
    {
      updateTextStyle: {
        objectId: bodyId,
        style: {
          fontFamily: 'Arial',
          fontSize: { magnitude: isQuestion ? 20 : 17, unit: 'PT' },
          foregroundColor: {
            opaqueColor: {
              rgbColor: {
                red: 0.2,
                green: 0.25,
                blue: 0.3,
              },
            },
          },
          bold: isQuestion,
        },
        textRange: {
          type: 'ALL',
        },
        fields: 'fontFamily,fontSize,foregroundColor,bold',
      },
    },
  ]
}

function buildCreatePresentationRequests(firstSlide: GoogleSlide, slides: SlideContent[]) {
  const requests: any[] = []

  const first = slides[0] || {
    title: 'TeacherPilot Deck',
    subtitle: 'Created with TeacherPilot',
    bullets: [],
    type: 'title' as const,
  }

  const firstSlideId = firstSlide.objectId
  if (!firstSlideId) {
    throw new Error('Missing first slide ID.')
  }

  const firstPageElements = firstSlide.pageElements || []
  for (const element of firstPageElements) {
    if (element.objectId) {
      requests.push({
        deleteObject: {
          objectId: element.objectId,
        },
      })
    }
  }

  requests.push(...buildTitleSlideRequests(firstSlideId, first))

  for (let i = 1; i < slides.length; i += 1) {
    const slide = slides[i]
    const slideId = makeId(`slide_${i + 1}`)

    requests.push({
      createSlide: {
        objectId: slideId,
        insertionIndex: i,
        slideLayoutReference: {
          predefinedLayout: 'BLANK',
        },
      },
    })

    requests.push(...buildStandardSlideRequests(slideId, slide, i + 1))
  }

  return requests
}

export async function exportMarkdownToGoogleSlides(markdown: string, titleHint?: string) {
  const accessToken = await getGoogleAccessToken()
  const slides = parseSlides(markdown, titleHint)
  const presentationTitle = titleHint || slides[0]?.title || 'TeacherPilot Deck'

  const created = await googleApiFetch<GooglePresentation>(
    'https://slides.googleapis.com/v1/presentations',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        title: presentationTitle,
      }),
    }
  )

  const fullPresentation = await googleApiFetch<GooglePresentation>(
    `https://slides.googleapis.com/v1/presentations/${created.presentationId}`,
    accessToken
  )

  const firstSlide = fullPresentation.slides?.[0]
  if (!firstSlide?.objectId) {
    throw new Error('Google Slides did not return the first slide.')
  }

  const requests = buildCreatePresentationRequests(firstSlide, slides)

  await googleApiFetch(
    `https://slides.googleapis.com/v1/presentations/${created.presentationId}:batchUpdate`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({ requests }),
    }
  )

  const url = `https://docs.google.com/presentation/d/${created.presentationId}/edit`
  window.open(url, '_blank', 'noopener,noreferrer')

  return {
    presentationId: created.presentationId,
    url,
  }
}