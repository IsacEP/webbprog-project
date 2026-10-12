import { useEffect, useState } from "react"
import type { Question } from "./lib/questions"
import { fetchQuestions } from "./lib/opentdb"

const CURRENT_GAME_KEY = "trivia-current-game"
const pendingRequests = new Map<string, Promise<Question[]>>()

export function todayKey(date = new Date()) {
  return date.toLocaleDateString("sv-SE")
}

function isQuestion(value: unknown): value is Question {
  if (typeof value !== "object" || value === null) return false
  const question = value as Partial<Question>
  return (
    typeof question.question === "string" &&
    Array.isArray(question.answers) &&
    question.answers.length >= 2 &&
    question.answers.every((answer) => typeof answer === "string") &&
    typeof question.correct === "number" &&
    Number.isInteger(question.correct) &&
    question.correct >= 0 &&
    question.correct < question.answers.length
  )
}

function readCachedQuestions(gameId: string, url: string, daily: boolean) {
  try {
    const saved = daily
      ? localStorage.getItem(`questions-${gameId.slice(6)}`)
      : sessionStorage.getItem(CURRENT_GAME_KEY)
    if (!saved) return []

    const parsed: unknown = JSON.parse(saved)
    const questions = daily
      ? parsed
      : typeof parsed === "object" &&
          parsed !== null &&
          "gameId" in parsed &&
          parsed.gameId === gameId &&
          "url" in parsed &&
          parsed.url === url &&
          "questions" in parsed
        ? parsed.questions
        : null

    return Array.isArray(questions) && questions.every(isQuestion)
      ? (questions as Question[])
      : []
  } catch {
    return []
  }
}

function cacheQuestions(
  gameId: string,
  url: string,
  daily: boolean,
  questions: Question[]
) {
  try {
    if (daily) {
      localStorage.setItem(
        `questions-${gameId.slice(6)}`,
        JSON.stringify(questions)
      )
    } else {
      sessionStorage.setItem(
        CURRENT_GAME_KEY,
        JSON.stringify({ gameId, url, questions })
      )
    }
  } catch {
    // The game can still be played if browser storage is unavailable.
  }
}

export function useFetchQuestions(
  gameId: string,
  url: string,
  daily: boolean,
  enabled = true
) {
  const requestKey = `${gameId}:${url}`
  const [state, setState] = useState(() => ({
    key: requestKey,
    questions: readCachedQuestions(gameId, url, daily),
    error: null as string | null,
  }))
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!enabled) return
    if (state.key === requestKey && state.questions.length > 0) return

    let active = true

    let request = pendingRequests.get(requestKey)
    if (!request) {
      request = fetchQuestions(url).then((questions) => {
        cacheQuestions(gameId, url, daily, questions)
        return questions
      })
      pendingRequests.set(requestKey, request)
      void request.then(
        () => pendingRequests.delete(requestKey),
        () => pendingRequests.delete(requestKey)
      )
    }

    request.then(
      (questions) => {
        if (active) setState({ key: requestKey, questions, error: null })
      },
      (error: unknown) => {
        if (active) {
          setState({
            key: requestKey,
            questions: [],
            error:
              error instanceof Error
                ? error.message
                : "Could not load questions.",
          })
        }
      }
    )

    return () => {
      active = false
    }
  }, [
    gameId,
    url,
    daily,
    enabled,
    requestKey,
    attempt,
    state.key,
    state.questions.length,
  ])

  const current = state.key === requestKey ? state : null
  return {
    questions: current?.questions ?? [],
    error: current?.error ?? null,
    retry: () => {
      setState({ key: requestKey, questions: [], error: null })
      setAttempt((value) => value + 1)
    },
  }
}
