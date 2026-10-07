import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Difficulty = "easy" | "medium" | "hard"

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"]

function Play() {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")

  function startGame() {
    const gameId = crypto.randomUUID()
    navigate(`/play/${gameId}?difficulty=${difficulty}`)
  }

  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardTitle>New game</CardTitle>
        <CardDescription>Choose a difficulty and start playing.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        {DIFFICULTIES.map((d) => (
          <Button
            key={d}
            variant={d === difficulty ? "default" : "outline"}
            onClick={() => setDifficulty(d)}
          >
            {d}
          </Button>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={startGame}>Start game</Button>
      </CardFooter>
    </Card>
  )
}

export default Play
