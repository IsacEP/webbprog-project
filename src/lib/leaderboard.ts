export type LeaderboardEntry = {
  name: string
  date: string
  correct: boolean[]
  totalTime: number
  totalScore: number
}

const STORAGE_KEY = "trivia-users"

function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== "object" || value === null) return false
  const entry = value as Partial<LeaderboardEntry>
  return (
    typeof entry.name === "string" &&
    typeof entry.date === "string" &&
    Array.isArray(entry.correct) &&
    entry.correct.every((answer) => typeof answer === "boolean") &&
    typeof entry.totalTime === "number" &&
    Number.isFinite(entry.totalTime) &&
    typeof entry.totalScore === "number" &&
    Number.isFinite(entry.totalScore)
  )
}

export function readLeaderboard(): LeaderboardEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    const entries: unknown = JSON.parse(saved)
    return Array.isArray(entries) ? entries.filter(isLeaderboardEntry) : []
  } catch {
    return []
  }
}

export function findDailyResult(name: string, date: string) {
  return readLeaderboard().find(
    (entry) =>
      entry.date === date &&
      entry.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase()
  )
}

export function saveDailyResult(entry: LeaderboardEntry): LeaderboardEntry {
  const entries = readLeaderboard()
  const existing = entries.find(
    (saved) =>
      saved.date === entry.date &&
      saved.name.toLocaleLowerCase() === entry.name.toLocaleLowerCase()
  )
  if (existing) return existing

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...entries, entry]))
  return entry
}
