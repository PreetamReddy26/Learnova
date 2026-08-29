import OpenAI from "openai"

export interface GeneratedMCQQuestion {
  prompt: string
  choices: string[]
  correctIndex: number
  explanation: string
}

export interface GeneratedWrittenQuestion {
  prompt: string
  modelAnswer: string
}

export interface GradedAnswer {
  score: 0 | 1
  feedback: string
}

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash"
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
const QUESTION_COUNT = 5

function getClient() {
  if (!process.env.GEMINI_API_KEY) return null
  return new OpenAI({ apiKey: process.env.GEMINI_API_KEY, baseURL: GEMINI_BASE_URL })
}

export async function generateMCQQuiz({
  subjectName,
  curriculum,
  grade,
}: {
  subjectName: string
  curriculum: string
  grade: number | null
}): Promise<GeneratedMCQQuestion[]> {
  const client = getClient()
  if (!client) return fallbackMCQQuiz(subjectName)

  try {
    const prompt = [
      `Generate exactly ${QUESTION_COUNT} multiple-choice practice questions for a student following the ${curriculum} curriculum${grade ? `, Grade ${grade}` : ""}, on the subject "${subjectName}".`,
      "Match the depth, style, and terminology expected at this level and curriculum — questions should resemble what would actually appear in this board's exams or textbook.",
      "Respond with ONLY a JSON object (no markdown, no commentary) of this exact shape:",
      `{"questions": [{"prompt": string, "choices": [string, string, string, string], "correctIndex": number (0-3), "explanation": string}]}`,
      "Each explanation should briefly justify the correct answer in a way that helps the student learn, not just restate it.",
    ].join("\n")

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    })

    const raw = completion.choices[0]?.message?.content ?? ""
    const questions = parseMCQQuestions(raw)
    if (questions) return questions
  } catch (error) {
    console.error("MCQ quiz generation failed:", error)
  }

  return fallbackMCQQuiz(subjectName)
}

export async function generateWrittenQuiz({
  subjectName,
  curriculum,
  grade,
}: {
  subjectName: string
  curriculum: string
  grade: number | null
}): Promise<GeneratedWrittenQuestion[]> {
  const client = getClient()
  if (!client) return fallbackWrittenQuiz(subjectName)

  try {
    const prompt = [
      `Generate exactly ${QUESTION_COUNT} short-answer / descriptive practice questions for a student following the ${curriculum} curriculum${grade ? `, Grade ${grade}` : ""}, on the subject "${subjectName}".`,
      "These should be the kind of question-answer or short-answer questions that actually appear in this board's written exams — not multiple choice.",
      "For each question, also write a concise model answer covering the key points a full-marks answer would include.",
      "Respond with ONLY a JSON object (no markdown, no commentary) of this exact shape:",
      `{"questions": [{"prompt": string, "modelAnswer": string}]}`,
    ].join("\n")

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    })

    const raw = completion.choices[0]?.message?.content ?? ""
    const questions = parseWrittenQuestions(raw)
    if (questions) return questions
  } catch (error) {
    console.error("Written quiz generation failed:", error)
  }

  return fallbackWrittenQuiz(subjectName)
}

export async function gradeWrittenAnswer({
  question,
  modelAnswer,
  studentAnswer,
}: {
  question: string
  modelAnswer: string
  studentAnswer: string
}): Promise<GradedAnswer> {
  const client = getClient()
  const fallback: GradedAnswer = {
    score: 0,
    feedback: "Grading isn't available right now — compare your answer to the model answer above.",
  }
  if (!client) return fallback

  if (!studentAnswer.trim()) {
    return { score: 0, feedback: "No answer was submitted for this question." }
  }

  try {
    const prompt = [
      "You are grading a student's short-answer response for a school exam.",
      `Question: ${question}`,
      `Model answer (key points expected for full marks): ${modelAnswer}`,
      `Student's answer: ${studentAnswer}`,
      "Judge whether the student's answer substantially captures the key points of the model answer — it doesn't need to match wording exactly.",
      "Respond with ONLY a JSON object of this exact shape:",
      `{"score": 0 or 1, "feedback": string}`,
      "The feedback should be 1-2 short, encouraging sentences: what they got right, and what (if anything) was missing or incorrect.",
    ].join("\n")

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    })

    const raw = completion.choices[0]?.message?.content ?? ""
    const cleaned = raw.trim().replace(/^```json\s*|^```\s*|```\s*$/g, "")
    const parsed = JSON.parse(cleaned)

    if (
      (parsed.score === 0 || parsed.score === 1) &&
      typeof parsed.feedback === "string"
    ) {
      return { score: parsed.score, feedback: parsed.feedback }
    }
  } catch (error) {
    console.error("Answer grading failed:", error)
  }

  return fallback
}

function parseMCQQuestions(raw: string): GeneratedMCQQuestion[] | null {
  try {
    const cleaned = raw.trim().replace(/^```json\s*|^```\s*|```\s*$/g, "")
    const parsed = JSON.parse(cleaned)
    const list = Array.isArray(parsed) ? parsed : parsed.questions

    if (!Array.isArray(list) || list.length === 0) return null

    const isValid = list.every(
      (q) =>
        typeof q?.prompt === "string" &&
        Array.isArray(q?.choices) &&
        q.choices.length === 4 &&
        q.choices.every((choice: unknown) => typeof choice === "string") &&
        Number.isInteger(q?.correctIndex) &&
        q.correctIndex >= 0 &&
        q.correctIndex <= 3 &&
        typeof q?.explanation === "string"
    )

    return isValid ? (list as GeneratedMCQQuestion[]) : null
  } catch {
    return null
  }
}

function parseWrittenQuestions(raw: string): GeneratedWrittenQuestion[] | null {
  try {
    const cleaned = raw.trim().replace(/^```json\s*|^```\s*|```\s*$/g, "")
    const parsed = JSON.parse(cleaned)
    const list = Array.isArray(parsed) ? parsed : parsed.questions

    if (!Array.isArray(list) || list.length === 0) return null

    const isValid = list.every(
      (q) => typeof q?.prompt === "string" && typeof q?.modelAnswer === "string"
    )

    return isValid ? (list as GeneratedWrittenQuestion[]) : null
  } catch {
    return null
  }
}

// Falls back to fixed-shape placeholder quizzes if AI generation is
// unavailable or returns something unusable, so the practice loop still
// works end-to-end.
function fallbackMCQQuiz(subjectName: string): GeneratedMCQQuestion[] {
  return [1, 2, 3, 4, 5].map((n) => ({
    prompt: `Sample ${subjectName} question ${n}: which option is correct?`,
    choices: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: n % 4,
    explanation: `Placeholder explanation for ${subjectName} question ${n}, pending AI-generated content.`,
  }))
}

function fallbackWrittenQuiz(subjectName: string): GeneratedWrittenQuestion[] {
  return [1, 2, 3, 4, 5].map((n) => ({
    prompt: `Sample ${subjectName} written question ${n}: explain the key concept in your own words.`,
    modelAnswer: `Placeholder model answer for ${subjectName} question ${n}, pending AI-generated content.`,
  }))
}
