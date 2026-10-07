import { useState } from "react"
import { Link, useParams, useSearchParams } from "react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Question = {
  question: string
  answers: string[]
  correct: number
}
const PLACEHOLDER_QUESTIONS: Question[] = [
  {
    question: "What is the capital of Sweden?",
    answers: ["Oslo", "Stockholm", "Copenhagen", "Helsinki"],
    correct: 1,
  },
  {
    question: "How many legs does a spider have?",
    answers: ["6", "8", "10", "12"],
    correct: 1,
  },
  {
    question: "Which planet is closest to the sun?",
    answers: ["Venus", "Earth", "Mercury", "Mars"],
    correct: 2,
  },
]

function Game() {
  const { uuid } = useParams()
  const [searchParams] = useSearchParams()
  const difficulty = searchParams.get("difficulty") ?? "medium"

  const questions = PLACEHOLDER_QUESTIONS
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)

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
          <Button nativeButton={false} render={<Link to="/play" />}>Play again</Button>
          <Button variant="outline" nativeButton={false} render={<Link to="/" />}>
            Home
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const current = questions[index]

  function answer(i: number) {
    if (selected !== null) return
    setSelected(i)
    if (i === current.correct) setScore((s) => s + 1)
  }

  function next() {
    setSelected(null)
    setIndex((i) => i + 1)
  }

  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardDescription>
          Question {index + 1} / {questions.length} · {difficulty} · game{" "}
          {uuid}
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
          </Button>
        ))}
      </CardContent>
      <CardFooter className="justify-between">
        <span>Score: {score}</span>
        <Button disabled={selected === null} onClick={next}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Game
