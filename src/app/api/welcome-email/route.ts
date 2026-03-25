import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'No email provided' }, { status: 400 })

    await resend.emails.send({
      from: 'TeacherPilot <hello@teacherspilot.app>',
      to: email,
      subject: 'Welcome to TeacherPilot — here\'s how to save your first hour',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TeacherPilot</title>
</head>
<body style="margin:0;padding:0;background:#0D0F12;font-family:'DM Sans',Arial,sans-serif;color:#F0EDE6;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">

    <!-- Logo -->
    <div style="margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;background:#F5A623;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;color:#0D0F12;">T</div>
        <span style="font-size:20px;font-weight:600;color:#F0EDE6;">TeacherPilot</span>
      </div>
    </div>

    <!-- Headline -->
    <h1 style="font-size:28px;font-weight:700;color:#F0EDE6;margin:0 0 16px;line-height:1.2;">
      You just got your Sundays back.
    </h1>

    <p style="font-size:16px;color:#9BA3AF;line-height:1.7;margin:0 0 32px;">
      Welcome to TeacherPilot. You have <strong style="color:#F5A623;">10 free generations</strong> this month — here's how to make the most of them.
    </p>

    <!-- Steps -->
    <div style="background:#13161B;border:1px solid #252A33;border-radius:16px;padding:28px;margin-bottom:28px;">
      <p style="font-size:12px;font-weight:600;color:#5C6370;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px;">Start here</p>

      <div style="margin-bottom:20px;display:flex;gap:14px;align-items:flex-start;">
        <div style="width:28px;height:28px;background:#F5A623;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#0D0F12;flex-shrink:0;">1</div>
        <div>
          <div style="font-weight:600;color:#F0EDE6;margin-bottom:4px;">Generate your first lesson plan</div>
          <div style="font-size:14px;color:#9BA3AF;">Go to Dashboard → pick Lesson Plan → type your grade, subject, and topic. Done in 4 seconds.</div>
        </div>
      </div>

      <div style="margin-bottom:20px;display:flex;gap:14px;align-items:flex-start;">
        <div style="width:28px;height:28px;background:#F5A623;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#0D0F12;flex-shrink:0;">2</div>
        <div>
          <div style="font-weight:600;color:#F0EDE6;margin-bottom:4px;">Save it to your library</div>
          <div style="font-size:14px;color:#9BA3AF;">Hit "Save to library" and it lives in My Library forever. Export to PDF any time.</div>
        </div>
      </div>

      <div style="display:flex;gap:14px;align-items:flex-start;">
        <div style="width:28px;height:28px;background:#F5A623;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#0D0F12;flex-shrink:0;">3</div>
        <div>
          <div style="font-weight:600;color:#F0EDE6;margin-bottom:4px;">Try the Sub Plan tool</div>
          <div style="font-size:14px;color:#9BA3AF;">Called in sick? Generate a complete sub plan in 90 seconds. This one will change your life.</div>
        </div>
      </div>
    </div>

    <!-- Staffroom callout -->
    <div style="background:#13161B;border:1px solid rgba(245,166,35,0.3);border-radius:16px;padding:24px;margin-bottom:28px;">
      <div style="font-size:12px;font-weight:600;color:#F5A623;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Pro feature</div>
      <div style="font-weight:600;color:#F0EDE6;margin-bottom:6px;">🏫 The Staffroom</div>
      <div style="font-size:14px;color:#9BA3AF;line-height:1.6;">Upgrade to Pro to access The Staffroom — a community where teachers share lesson plans, quizzes, rubrics and more, organized by grade and subject.</div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:40px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
        style="display:inline-block;background:#F5A623;color:#0D0F12;font-weight:700;font-size:16px;padding:14px 32px;border-radius:12px;text-decoration:none;">
        Go to your dashboard →
      </a>
    </div>

    <!-- Tips -->
    <div style="margin-bottom:40px;">
      <p style="font-size:13px;font-weight:600;color:#5C6370;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 14px;">Pro tips</p>
      <div style="font-size:14px;color:#9BA3AF;line-height:1.8;">
        ✦ The more detail you give, the better the output — include grade, subject, time, and any student needs like ELL or IEP<br>
        ✦ Generate a quiz and an answer key together by using the Quiz tool and checking "include answer key"<br>
        ✦ Parent emails work best when you describe the situation and the student's name
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #252A33;padding-top:24px;">
      <p style="font-size:13px;color:#5C6370;margin:0;line-height:1.6;">
        You're receiving this because you signed up for TeacherPilot.<br>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#F5A623;text-decoration:none;">teacherpilot.app</a>
        · Made with ♥ for teachers everywhere
      </p>
    </div>

  </div>
</body>
</html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}