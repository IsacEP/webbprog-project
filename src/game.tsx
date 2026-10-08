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

function Game() {
  const { uuid } = useParams()
  const [searchParams] = useSearchParams()
  const difficulty = searchParams.get("difficulty") ?? "medium"

  const { questions } = useOutletContext<OutletContextType>()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const current = questions[index]

  function answer(i: number) {
    if (!current || selected !== null) return
    setSelected(i)
    if (i === current.correct) setScore((s) => s + 1)
  }

  function next() {
    if (selected === null) return
    setSelected(null)
    setIndex((i) => i + 1)
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!current || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return

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
            You scored {score} / {questions.length}
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <Button nativeButton={false} render={<Link to="/play" />}>
            Play again
          </Button>
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
          <span>Time: {score}</span> {/* TODO */}
          <span>Score: {score}</span>
        </div>
        <Button disabled={selected === null} onClick={next}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Game
