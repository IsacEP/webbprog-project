import { useEffect, useState } from "react"
import type { Question } from "./lib/questions"
import { fetchQuestions } from "./lib/opentdb"

const pendingRequests = new Map<string, Promise<Question[]>>()

export function todayKey(date = new Date()) {
  return date.toLocaleDateString("sv-SE")
}

function storageKey(gameId: string, daily: boolean) {
  return daily ? `questions-${gameId.slice(6)}` : `game-${gameId}`
}

function readCachedQuestions(gameId: string, daily: boolean): Question[] {
  const storage = daily ? localStorage : sessionStorage
  const saved = storage.getItem(storageKey(gameId, daily))
  if (!saved) return []
  try {
    const parsed: unknown = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function cacheQuestions(gameId: string, daily: boolean, questions: Question[]) {
  const storage = daily ? localStorage : sessionStorage
  storage.setItem(storageKey(gameId, daily), JSON.stringify(questions))
}

function loadQuestions(url: string) {
  let request = pendingRequests.get(url)
  if (!request) {
    request = fetchQuestions(url).finally(() => pendingRequests.delete(url))
    pendingRequests.set(url, request)
  }
  return request
}

export function useFetchQuestions(
  gameId: string,
  url: string,
  daily: boolean,
  enabled = true
) {
  const [questions, setQuestions] = useState(() =>
    readCachedQuestions(gameId, daily)
  )
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!enabled || questions.length > 0) return

    let active = true
    loadQuestions(url)
      .then((result) => {
        if (!active) return
        cacheQuestions(gameId, daily, result)
        setQuestions(result)
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load questions."
          )
        }
      })

    return () => {
      active = false
    }
  }, [gameId, url, daily, enabled, questions.length, attempt])

  function retry() {
    setError(null)
    setAttempt((a) => a + 1)
  }

  return { questions, error, retry }
}
