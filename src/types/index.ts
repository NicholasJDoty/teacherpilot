export type GeneratorType =
  | 'lesson_plan'
  | 'unit_plan'
  | 'slide_deck'
  | 'interactive_poll'
  | 'lesson_bundle'
  | 'bell_ringer'
  | 'assignment'
  | 'quiz_test'
  | 'rubric'
  | 'parent_email'
  | 'sub_plan'
  | 'report_card_comments'
  | 'differentiation'

export type GeneratePayload = {
  tool: GeneratorType
  gradeLevel: string
  subject: string
  topic: string
  standards?: string
  duration?: string
  learningObjective?: string
  notes?: string
  studentNeeds?: string
}