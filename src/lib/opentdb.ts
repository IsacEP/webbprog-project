import type { Question } from "./questions"

export type Difficulty = "easy" | "medium" | "hard"
export type QuestionType = "multiple" | "boolean"

export type TriviaConfig = {
  amount: number
  category: number | null
  difficulty: Difficulty | null
  type: QuestionType | null
}

export type TriviaCategory = {
  id: number
  name: string
}

const BASE_URL = "https://opentdb.com/"

export const DAILY_CONFIG: TriviaConfig = {
  amount: 3,
  category: null,
  difficulty: null,
  type: "multiple",
}

export function readTriviaConfig(params: URLSearchParams): TriviaConfig {
  const amount = Number(params.get("amount"))
  const difficulty = params.get("difficulty")
  const type = params.get("type")
  const category = Number(params.get("category"))

  return {
    amount:
      Number.isInteger(amount) && amount >= 1 && amount <= 50 ? amount : 10,
    category: Number.isInteger(category) && category > 0 ? category : null,
    difficulty:
      difficulty === "easy" || difficulty === "medium" || difficulty === "hard"
        ? difficulty
        : null,
    type: type === "multiple" || type === "boolean" ? type : null,
  }
}

export function buildQuestionsUrl(config: TriviaConfig): string {
  const url = new URL("api.php", BASE_URL)
  url.searchParams.set("amount", String(config.amount))
  if (config.category !== null) {
    url.searchParams.set("category", String(config.category))
  }
  if (config.difficulty !== null) {
    url.searchParams.set("difficulty", config.difficulty)
  }
  if (config.type !== null) {
    url.searchParams.set("type", config.type)
  }
  url.searchParams.set("encode", "url3986")
  return url.toString()
}

type ApiResponse = {
  response_code: number
  results: {
    question: string
    correct_answer: string
    incorrect_answers: string[]
  }[]
}

export async function fetchQuestions(url: string): Promise<Question[]> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Open Trivia DB returned HTTP ${response.status}.`)
  }

  const data = (await response.json()) as ApiResponse
  if (data.response_code === 1) {
    throw new Error(
      "Not enough questions match those settings. Choose fewer questions or broader settings."
    )
  }
  if (data.response_code === 5) {
    throw new Error(
      "Open Trivia DB is rate limiting requests. Wait a few seconds and try again."
    )
  }
  if (data.response_code !== 0) {
    throw new Error(`Open Trivia DB returned error code ${data.response_code}.`)
  }
  if (!Array.isArray(data.results) || data.results.length === 0) {
    throw new Error("Open Trivia DB returned no questions.")
  }

  return data.results.map((result) => {
    const correctAnswer = decodeURIComponent(result.correct_answer)
    const answers = [
      correctAnswer,
      ...result.incorrect_answers.map((answer) => decodeURIComponent(answer)),
    ].sort(() => Math.random() - 0.5)

    return {
      question: decodeURIComponent(result.question),
      answers,
      correct: answers.indexOf(correctAnswer),
    }
  })
}

let categoryRequest: Promise<TriviaCategory[]> | undefined

export function fetchCategories(): Promise<TriviaCategory[]> {
  categoryRequest ??= fetch(new URL("api_category.php", BASE_URL))
    .then((response) => {
      if (!response.ok) throw new Error("Could not load categories.")
      return response.json() as Promise<{ trivia_categories: TriviaCategory[] }>
    })
    .then((data) => data.trivia_categories)
    .catch((error: unknown) => {
      categoryRequest = undefined
      throw error
    })
  return categoryRequest
}
