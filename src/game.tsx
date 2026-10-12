import { useEffect, useState } from "react"
import {
  Link,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { OutletContextType } from "./App"
import { Kbd } from "./components/ui/kbd"
import { formatTime } from "./lib/utils"
import { findDailyResult, saveDailyResult } from "./lib/leaderboard"

function Game() {
  const { uuid } = useParams()
  const [searchParams] = useSearchParams()
  const difficulty = searchParams.get("difficulty") ?? "medium"
  const name = searchParams.get("name")?.trim() ?? ""
  const dailyDate = uuid?.startsWith("daily-") ? uuid.slice(6) : null
  const [previousDailyResult] = useState(() =>
    dailyDate && name ? findDailyResult(name, dailyDate) : undefined
  )

  const { questions } = useOutletContext<OutletContextType>()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const selected = answers[index] ?? null
  const score = answers.reduce(
    (total, answer, questionIndex) =>
      total + Number(answer === questions[questionIndex]?.correct),
    0
  )
  const [saveError, setSaveError] = useState(false)
  const current = questions[index]
  const [seconds, setSeconds] = useState(0)
  const running =
    questions.length > 0 &&
    index < questions.length &&
    !previousDailyResult &&
    (!dailyDate || Boolean(name))

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  function answer(i: number) {
    if (!current || selected !== null) return
    setAnswers((previous) =>
      previous.length === index ? [...previous, i] : previous
    )
  }

  function saveResult() {
    if (!dailyDate || !name) return
    try {
      saveDailyResult({
        name,
        date: dailyDate,
        correct: questions.map(
          (question, i) => answers[i] === question.correct
        ),
        totalTime: seconds,
        totalScore: score,
      })
      setSaveError(false)
    } catch {
      setSaveError(true)
    }
  }

  function next() {
    if (selected === null) return
    if (index === questions.length - 1) saveResult()
    setIndex((i) => i + 1)
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        !running ||
        !current ||
        e.repeat ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      )
        return

      if (e.key === "Enter" && selected !== null) {
        e.preventDefault()
        next()
        return
      }

      const n = Number(e.key)
      if (n >= 1 && n <= current.answers.length) answer(n - 1)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })
  if (previousDailyResult) {
    return (
      <Card className="md:w-3xl">
        <CardHeader>
          <CardTitle>Daily quiz already completed</CardTitle>
          <CardDescription>
            {previousDailyResult.name} scored {previousDailyResult.totalScore} /{" "}
            {previousDailyResult.correct.length} today.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button nativeButton={false} render={<Link to="/leaderboard" />}>
            View leaderboard
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (dailyDate && !name) {
    return (
      <Card className="md:w-3xl">
        <CardHeader>
          <CardTitle>Enter your name to play</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button nativeButton={false} render={<Link to="/daily-quiz" />}>
            Daily quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Empty array = still loading, otherwise index 0 >= length 0 shows "Game over"
  if (questions.length === 0) {
    return <p>Loading questions…</p>
  }

  const finished = index >= questions.length

  if (finished) {
    return (
      <Card className="md:w-3xl">
        <CardHeader>
          <CardTitle>Game over</CardTitle>
          <CardDescription>
            You scored {score} / {questions.length} in {formatTime(seconds)}
            {saveError && <span> Your result could not be saved.</span>}
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <Button nativeButton={false} render={<Link to="/play" />}>
            Play again
          </Button>
          {dailyDate && !saveError && (
            <Button nativeButton={false} render={<Link to="/leaderboard" />}>
              View leaderboard
            </Button>
          )}
          {saveError && <Button onClick={saveResult}>Retry saving</Button>}
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/" />}
          >
            Home
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardDescription>
          Question {index + 1} / {questions.length} · {difficulty} · game {uuid}
        </CardDescription>
        <CardTitle>{current.question}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {current.answers.map((a, i) => (
          <Button
            key={a}
            variant={
              selected === null
                ? "outline"
                : i === current.correct
                  ? "success"
                  : i === selected
                    ? "destructive"
                    : "outline"
            }
            onClick={() => answer(i)}
          >
            {a}
            <Kbd className="ml-auto">{i + 1}</Kbd>
          </Button>
        ))}
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex gap-2">
          <span>Time: {formatTime(seconds)}</span>
          <span>Score: {score}</span>
        </div>
        <Button disabled={selected === null} onClick={next}>
          Next
          <Kbd className="bg-primary">⏎</Kbd>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Game
