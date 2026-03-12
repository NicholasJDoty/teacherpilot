import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard-shell'
import { requireUser } from '@/lib/auth'

type StarterChip = {
  label: string
  href: string
}

type WorkflowItem = {
  title: string
  description: string
  href: string
  tag: string
  chips: StarterChip[]
}

type WorkflowGroup = {
  title: string
  description: string
  items: WorkflowItem[]
}

const workflowGroups: WorkflowGroup[] = [
  {
    title: 'Planning',
    description: 'Build tomorrow’s lesson, a full bundle, or a ready-to-teach slide deck.',
    items: [
      {
        title: 'Tomorrow’s Lesson',
        description:
          'Create a ready-to-teach lesson plan with objective, activities, accommodations, exit ticket, and homework.',
        href:
          '/generate?tool=lesson_plan&gradeLevel=5th%20grade&subject=Science&topic=The%20Water%20Cycle&duration=45%20minutes&learningObjective=Students%20will%20explain%20evaporation%2C%20condensation%2C%20precipitation%2C%20and%20collection.&studentNeeds=Include%20ELL%20support%20and%20one%20reading%20accommodation.&notes=Make%20it%20hands-on%20and%20easy%20to%20teach.',
        tag: 'Most used',
        chips: [
          {
            label: 'Elementary Science',
            href:
              '/generate?tool=lesson_plan&gradeLevel=4th%20grade&subject=Science&topic=Plant%20Life%20Cycles&duration=45%20minutes&learningObjective=Students%20will%20describe%20the%20stages%20of%20a%20plant%20life%20cycle.&studentNeeds=Include%20ELL%20support%20and%20visual%20scaffolds.&notes=Make%20it%20clear%20and%20hands-on.',
          },
          {
            label: 'Middle School Math',
            href:
              '/generate?tool=lesson_plan&gradeLevel=7th%20grade&subject=Math&topic=Proportional%20Relationships&duration=50%20minutes&learningObjective=Students%20will%20identify%20and%20solve%20proportional%20relationships%20using%20tables%20and%20graphs.&studentNeeds=Include%20one%20support%20for%20struggling%20learners.&notes=Keep%20examples%20practical%20and%20easy%20to%20model.',
          },
          {
            label: 'ELA Writing',
            href:
              '/generate?tool=lesson_plan&gradeLevel=5th%20grade&subject=ELA&topic=Opinion%20Writing&duration=45%20minutes&learningObjective=Students%20will%20write%20a%20clear%20opinion%20statement%20with%20reasons%20and%20evidence.&studentNeeds=Include%20sentence%20frames%20for%20ELL%20students.&notes=Add%20a%20short%20model%20paragraph.',
          },
        ],
      },
      {
        title: 'Complete Lesson Bundle',
        description:
          'Generate teacher slides, student worksheet, exit ticket, and Google Form-ready quiz from one prompt.',
        href:
          '/generate?tool=lesson_bundle&gradeLevel=6th%20grade&subject=Science&topic=Photosynthesis&duration=45%20minutes&learningObjective=Students%20will%20explain%20photosynthesis%20and%20identify%20inputs%20and%20outputs.&studentNeeds=Include%20one%20support%20for%20ELL%20and%20one%20support%20for%20students%20who%20need%20reading%20support.&notes=Make%20the%20slides%20classroom-ready%20and%20the%20worksheet%20clear%20for%20middle%20school.',
        tag: 'Highest value',
        chips: [
          {
            label: 'Elementary Science Bundle',
            href:
              '/generate?tool=lesson_bundle&gradeLevel=5th%20grade&subject=Science&topic=The%20Water%20Cycle&duration=45%20minutes&learningObjective=Students%20will%20explain%20evaporation%2C%20condensation%2C%20precipitation%2C%20and%20collection.&studentNeeds=Include%20ELL%20support%20and%20one%20reading%20accommodation.&notes=Make%20the%20bundle%20easy%20to%20teach%20tomorrow.',
          },
          {
            label: 'Middle School Social Studies',
            href:
              '/generate?tool=lesson_bundle&gradeLevel=8th%20grade&subject=Social%20Studies&topic=The%20American%20Revolution&duration=50%20minutes&learningObjective=Students%20will%20explain%20major%20causes%20of%20the%20American%20Revolution.&studentNeeds=Include%20one%20ELL%20support%20and%20one%20support%20for%20students%20who%20need%20reading%20scaffolds.&notes=Include%20discussion%20and%20exit%20ticket%20questions.',
          },
          {
            label: 'Math Bundle',
            href:
              '/generate?tool=lesson_bundle&gradeLevel=6th%20grade&subject=Math&topic=Ratios&duration=45%20minutes&learningObjective=Students%20will%20write%20and%20interpret%20ratios%20using%20real-world%20examples.&studentNeeds=Include%20supports%20for%20struggling%20learners%20and%20advanced%20extension.&notes=Keep%20the%20worksheet%20clear%20and%20practice-focused.',
          },
        ],
      },
      {
        title: 'Slide Deck',
        description:
          'Create a slide-by-slide teaching deck and export it directly to Google Slides.',
        href:
          '/generate?tool=slide_deck&gradeLevel=6th%20grade&subject=Science&topic=Photosynthesis&duration=45%20minutes&learningObjective=Students%20will%20explain%20photosynthesis%20and%20identify%20its%20inputs%20and%20outputs.&notes=Keep%20the%20slides%20visually%20clear%20and%20ready%20to%20teach.',
        tag: 'Slides',
        chips: [
          {
            label: 'Science Slides',
            href:
              '/generate?tool=slide_deck&gradeLevel=6th%20grade&subject=Science&topic=Photosynthesis&duration=45%20minutes&learningObjective=Students%20will%20explain%20photosynthesis%20and%20identify%20its%20inputs%20and%20outputs.&notes=Make%20the%20slides%20ready%20for%20Google%20Slides%20export.',
          },
          {
            label: 'Math Slides',
            href:
              '/generate?tool=slide_deck&gradeLevel=5th%20grade&subject=Math&topic=Equivalent%20Fractions&duration=45%20minutes&learningObjective=Students%20will%20identify%20and%20create%20equivalent%20fractions%20using%20models%20and%20numbers.&notes=Use%20clear%20teaching%20slides%20and%20an%20exit%20ticket.',
          },
          {
            label: 'ELA Slides',
            href:
              '/generate?tool=slide_deck&gradeLevel=4th%20grade&subject=ELA&topic=Main%20Idea&duration=40%20minutes&learningObjective=Students%20will%20identify%20the%20main%20idea%20and%20supporting%20details%20in%20a%20short%20text.&notes=Add%20a%20discussion%20slide%20and%20guided%20practice.',
          },
        ],
      },
    ],
  },
  {
    title: 'Assessment',
    description: 'Build quizzes, tests, rubrics, and live checks for understanding.',
    items: [
      {
        title: 'Quiz / Test',
        description:
          'Create a classroom-ready assessment with directions, point values, and answer key.',
        href:
          '/generate?tool=quiz_test&gradeLevel=6th%20grade&subject=Science&topic=Phases%20of%20Matter&duration=20%20minutes&learningObjective=Students%20will%20identify%20solids%2C%20liquids%2C%20gases%2C%20and%20explain%20changes%20between%20them.&studentNeeds=Include%20one%20support%20for%20ELL%20students.&notes=Make%20it%20realistic%20for%20middle%20school.',
        tag: 'Assessment',
        chips: [
          {
            label: 'Science Quiz',
            href:
              '/generate?tool=quiz_test&gradeLevel=6th%20grade&subject=Science&topic=Phases%20of%20Matter&duration=20%20minutes&learningObjective=Students%20will%20identify%20solids%2C%20liquids%2C%20gases%2C%20and%20explain%20changes%20between%20them.&notes=Include%20multiple%20choice%20and%20short%20answer.',
          },
          {
            label: 'Math Quiz',
            href:
              '/generate?tool=quiz_test&gradeLevel=5th%20grade&subject=Math&topic=Equivalent%20Fractions&duration=20%20minutes&learningObjective=Students%20will%20identify%20and%20generate%20equivalent%20fractions.&notes=Include%20visual%20questions%20if%20useful.',
          },
          {
            label: 'ELA Quiz',
            href:
              '/generate?tool=quiz_test&gradeLevel=4th%20grade&subject=ELA&topic=Main%20Idea&duration=20%20minutes&learningObjective=Students%20will%20identify%20main%20idea%20and%20supporting%20details.&notes=Keep%20it%20clear%20and%20age-appropriate.',
          },
        ],
      },
      {
        title: 'Rubric',
        description:
          'Create a usable 4-level rubric with clear criteria and performance descriptors.',
        href:
          '/generate?tool=rubric&gradeLevel=5th%20grade&subject=ELA&topic=Paragraph%20writing%20about%20ecosystems&learningObjective=Students%20will%20write%20an%20organized%20paragraph%20with%20evidence%20and%20conventions.&notes=Make%20the%20rubric%20easy%20for%20a%20teacher%20to%20use%20right%20away.',
        tag: 'Rubric',
        chips: [
          {
            label: 'ELA Writing Rubric',
            href:
              '/generate?tool=rubric&gradeLevel=5th%20grade&subject=ELA&topic=Opinion%20Paragraph&learningObjective=Students%20will%20write%20an%20organized%20paragraph%20with%20evidence%20and%20conventions.&notes=Make%20the%20rubric%20teacher-friendly%20and%20specific.',
          },
          {
            label: 'Science Project Rubric',
            href:
              '/generate?tool=rubric&gradeLevel=6th%20grade&subject=Science&topic=Simple%20ecosystem%20poster%20project&learningObjective=Students%20will%20show%20understanding%20of%20ecosystems%20using%20accurate%20content%20and%20clear%20presentation.&notes=Use%20a%204-level%20rubric%20with%20clear%20criteria.',
          },
          {
            label: 'Presentation Rubric',
            href:
              '/generate?tool=rubric&gradeLevel=7th%20grade&subject=Social%20Studies&topic=Short%20historical%20presentation&learningObjective=Students%20will%20present%20historical%20information%20clearly%20with%20evidence%20and%20organization.&notes=Keep%20it%20simple%20for%20classroom%20grading.',
          },
        ],
      },
      {
        title: 'Interactive Polls',
        description:
          'Generate Slido-style warmups, checks for understanding, discussion prompts, and exit polls.',
        href:
          '/generate?tool=interactive_poll&gradeLevel=8th%20grade&subject=Social%20Studies&topic=The%20American%20Revolution&learningObjective=Students%20will%20explain%20major%20causes%20of%20the%20American%20Revolution.&notes=Include%20a%20warmup%20poll%2C%20knowledge%20checks%2C%20a%20discussion%20question%2C%20and%20an%20exit%20poll.',
        tag: 'Engagement',
        chips: [
          {
            label: 'History Polls',
            href:
              '/generate?tool=interactive_poll&gradeLevel=8th%20grade&subject=Social%20Studies&topic=The%20American%20Revolution&notes=Include%20multiple%20choice%20questions%20and%20discussion%20prompts.',
          },
          {
            label: 'Science Polls',
            href:
              '/generate?tool=interactive_poll&gradeLevel=6th%20grade&subject=Science&topic=Photosynthesis&notes=Make%20the%20questions%20good%20for%20quick%20checks%20and%20discussion.',
          },
          {
            label: 'Math Polls',
            href:
              '/generate?tool=interactive_poll&gradeLevel=7th%20grade&subject=Math&topic=Ratios&notes=Create%20warmup%20polls%20and%20knowledge%20check%20questions.',
          },
        ],
      },
    ],
  },
  {
    title: 'Communication',
    description: 'Write the classroom communication teachers repeatedly need.',
    items: [
      {
        title: 'Parent Email',
        description:
          'Draft calm, professional communication for families without starting from scratch.',
        href:
          '/generate?tool=parent_email&gradeLevel=4th%20grade&subject=Math&topic=Fractions%20quiz%20results&notes=Write%20a%20professional%20email%20to%20families%20explaining%20that%20students%20will%20get%20a%20reteach%20opportunity%20and%20a%20chance%20to%20show%20improvement.',
        tag: 'Communication',
        chips: [
          {
            label: 'Assessment Update',
            href:
              '/generate?tool=parent_email&gradeLevel=4th%20grade&subject=Math&topic=Fractions%20quiz%20results&notes=Write%20a%20professional%20family%20email%20about%20reteach%20and%20reassessment.',
          },
          {
            label: 'Behavior Concern',
            href:
              '/generate?tool=parent_email&gradeLevel=6th%20grade&subject=General%20Classroom&topic=Classroom%20behavior%20concern&notes=Write%20a%20professional%20email%20to%20a%20family%20about%20a%20repeated%20classroom%20behavior%20issue%20with%20a%20supportive%20tone.',
          },
          {
            label: 'Positive Update',
            href:
              '/generate?tool=parent_email&gradeLevel=3rd%20grade&subject=Reading&topic=Student%20growth%20update&notes=Write%20a%20warm%20professional%20email%20sharing%20positive%20student%20growth%20and%20encouragement.',
          },
        ],
      },
      {
        title: 'Report Card Comments',
        description:
          'Generate comment banks for strong, average, and struggling student performance.',
        href:
          '/generate?tool=report_card_comments&gradeLevel=3rd%20grade&subject=Reading&notes=Generate%2010%20report%20card%20comments%20that%20sound%20professional%2C%20specific%2C%20and%20realistic.',
        tag: 'Admin',
        chips: [
          {
            label: 'Reading Comments',
            href:
              '/generate?tool=report_card_comments&gradeLevel=3rd%20grade&subject=Reading&notes=Generate%2010%20reading%20report%20card%20comments%20across%20performance%20levels.',
          },
          {
            label: 'Math Comments',
            href:
              '/generate?tool=report_card_comments&gradeLevel=5th%20grade&subject=Math&notes=Generate%2010%20math%20report%20card%20comments%20that%20sound%20realistic%20and%20professional.',
          },
          {
            label: 'Behavior / Work Habits',
            href:
              '/generate?tool=report_card_comments&gradeLevel=4th%20grade&subject=Work%20Habits&notes=Generate%2010%20professional%20comments%20for%20behavior%2C%20organization%2C%20and%20work%20habits.',
          },
        ],
      },
      {
        title: 'Sub Plan',
        description:
          'Create a substitute plan with schedule, directions, and contingency notes.',
        href:
          '/generate?tool=sub_plan&gradeLevel=5th%20grade&subject=Science&topic=Review%20day%20on%20ecosystems&duration=1%20day&notes=Write%20a%20sub%20plan%20that%20is%20easy%20for%20a%20guest%20teacher%20to%20follow%20without%20extra%20context.',
        tag: 'Admin',
        chips: [
          {
            label: 'Elementary Sub Plan',
            href:
              '/generate?tool=sub_plan&gradeLevel=3rd%20grade&subject=ELA&topic=Reading%20review%20day&duration=1%20day&notes=Make%20this%20very%20clear%20for%20a%20substitute%20walking%20in%20cold.',
          },
          {
            label: 'Middle School Sub Plan',
            href:
              '/generate?tool=sub_plan&gradeLevel=7th%20grade&subject=Social%20Studies&topic=Map%20skills%20practice&duration=1%20day&notes=Include%20behavior%20notes%20and%20step-by-step%20instructions.',
          },
          {
            label: 'Science Lab Lite',
            href:
              '/generate?tool=sub_plan&gradeLevel=6th%20grade&subject=Science&topic=Simple%20photosynthesis%20review&duration=1%20day&notes=Keep%20it%20safe%2C%20simple%2C%20and%20doable%20for%20a%20substitute.',
          },
        ],
      },
    ],
  },
  {
    title: 'Support',
    description: 'Create supports for learners who need reteach, accommodations, or extension.',
    items: [
      {
        title: 'Differentiation Support',
        description:
          'Build supports for ELL, IEP/504, struggling, on-level, and advanced learners.',
        href:
          '/generate?tool=differentiation&gradeLevel=5th%20grade&subject=Math&topic=Multiplying%20fractions&learningObjective=Students%20will%20solve%20fraction%20multiplication%20problems%20and%20explain%20their%20reasoning.&notes=Include%20reteach%2C%20enrichment%2C%20ELL%2C%20and%20IEP%2F504%20supports.',
        tag: 'Support',
        chips: [
          {
            label: 'Math Support',
            href:
              '/generate?tool=differentiation&gradeLevel=5th%20grade&subject=Math&topic=Multiplying%20fractions&learningObjective=Students%20will%20solve%20fraction%20multiplication%20problems%20and%20explain%20their%20reasoning.&notes=Include%20reteach%2C%20enrichment%2C%20ELL%2C%20and%20IEP%2F504%20supports.',
          },
          {
            label: 'ELA Support',
            href:
              '/generate?tool=differentiation&gradeLevel=4th%20grade&subject=ELA&topic=Main%20Idea&learningObjective=Students%20will%20identify%20main%20idea%20and%20supporting%20details.&notes=Include%20supports%20for%20struggling%20readers%20and%20ELL%20students.',
          },
          {
            label: 'Science Support',
            href:
              '/generate?tool=differentiation&gradeLevel=6th%20grade&subject=Science&topic=Photosynthesis&learningObjective=Students%20will%20identify%20reactants%20and%20products%20of%20photosynthesis.&notes=Include%20visual%20supports%20and%20extension%20tasks.',
          },
        ],
      },
      {
        title: 'Bell Ringer / Warm-Up',
        description:
          'Generate quick, useful starters to settle the room and activate prior knowledge.',
        href:
          '/generate?tool=bell_ringer&gradeLevel=7th%20grade&subject=Science&topic=Cell%20theory&notes=Generate%205%20short%20warmups%20with%20sample%20answers%20and%20brief%20teacher%20directions.',
        tag: 'Planning support',
        chips: [
          {
            label: 'Science Warmups',
            href:
              '/generate?tool=bell_ringer&gradeLevel=7th%20grade&subject=Science&topic=Cell%20theory&notes=Generate%205%20warmups%20with%20sample%20answers.',
          },
          {
            label: 'Math Warmups',
            href:
              '/generate?tool=bell_ringer&gradeLevel=6th%20grade&subject=Math&topic=Ratios&notes=Generate%205%20warmups%20for%20ratios%20and%20proportional%20thinking.',
          },
          {
            label: 'ELA Warmups',
            href:
              '/generate?tool=bell_ringer&gradeLevel=5th%20grade&subject=ELA&topic=Inference&notes=Generate%205%20warmups%20that%20activate%20thinking%20about%20inference.',
          },
        ],
      },
      {
        title: 'Assignment / Homework',
        description:
          'Create a printable practice task with directions and success criteria.',
        href:
          '/generate?tool=assignment&gradeLevel=4th%20grade&subject=ELA&topic=Main%20idea&learningObjective=Students%20will%20identify%20the%20main%20idea%20and%20two%20supporting%20details%20in%20a%20short%20passage.&notes=Make%20it%20clear%20enough%20to%20send%20home%20as%20independent%20practice.',
        tag: 'Practice',
        chips: [
          {
            label: 'ELA Practice',
            href:
              '/generate?tool=assignment&gradeLevel=4th%20grade&subject=ELA&topic=Main%20idea&learningObjective=Students%20will%20identify%20the%20main%20idea%20and%20two%20supporting%20details%20in%20a%20short%20passage.&notes=Make%20it%20clear%20for%20independent%20practice.',
          },
          {
            label: 'Math Practice',
            href:
              '/generate?tool=assignment&gradeLevel=5th%20grade&subject=Math&topic=Equivalent%20Fractions&learningObjective=Students%20will%20generate%20and%20identify%20equivalent%20fractions.&notes=Create%20clear%20homework-style%20practice.',
          },
          {
            label: 'Social Studies Practice',
            href:
              '/generate?tool=assignment&gradeLevel=7th%20grade&subject=Social%20Studies&topic=Causes%20of%20the%20American%20Revolution&learningObjective=Students%20will%20identify%20and%20explain%20key%20causes%20of%20the%20American%20Revolution.&notes=Keep%20it%20manageable%20for%20homework.',
          },
        ],
      },
    ],
  },
]

export default async function WorkflowsPage() {
  await requireUser()

  return (
    <DashboardShell>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '30px',
            fontWeight: 800,
            margin: '0 0 8px 0',
            color: '#0f172a',
          }}
        >
          Workflow Hub
        </h1>

        <p
          style={{
            margin: 0,
            color: '#64748b',
            fontSize: '15px',
            lineHeight: 1.7,
            maxWidth: '760px',
          }}
        >
          Choose the teacher task you need to finish. These guided workflows help you
          move faster than starting from a blank generator.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '28px' }}>
        {workflowGroups.map((group) => (
          <section key={group.title}>
            <div style={{ marginBottom: '14px' }}>
              <h2
                style={{
                  margin: '0 0 6px 0',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#0f172a',
                }}
              >
                {group.title}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px',
                  lineHeight: 1.6,
                }}
              >
                {group.description}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '18px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              }}
            >
              {group.items.map((workflow) => (
                <div key={workflow.title} className="card" style={{ padding: '22px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '999px',
                      background: '#e2e8f0',
                      color: '#334155',
                      padding: '6px 10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      marginBottom: '14px',
                    }}
                  >
                    {workflow.tag}
                  </div>

                  <h3
                    style={{
                      margin: '0 0 10px 0',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    {workflow.title}
                  </h3>

                  <p
                    style={{
                      margin: '0 0 14px 0',
                      color: '#475569',
                      lineHeight: 1.7,
                      minHeight: '84px',
                    }}
                  >
                    {workflow.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      marginBottom: '16px',
                    }}
                  >
                    {workflow.chips.map((chip) => (
                      <Link
                        key={chip.label}
                        href={chip.href}
                        className="btn-secondary"
                        style={{ fontSize: '12px', padding: '8px 10px' }}
                      >
                        {chip.label}
                      </Link>
                    ))}
                  </div>

                  <Link href={workflow.href} className="btn-primary">
                    Open workflow
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </DashboardShell>
  )
}