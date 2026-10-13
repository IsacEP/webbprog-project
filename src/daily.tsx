import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { todayKey } from "./use-fetch-questions"
import { Input } from "./components/ui/input"
import { Field, FieldLabel } from "./components/ui/field"
import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"

export function dailyGameId(date = new Date()) {
  return `daily-${todayKey(date)}`
}

function Daily() {
  const [showError, setShowError] = useState(false)
  const [name, setName] = useState("")

  const gameId = dailyGameId()
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      setShowError(true)
      return
    }

    navigate(`/play/${gameId}?name=${encodeURIComponent(trimmedName)}`)
  }

  return (
    <Card className="md:w-3xl">
      <form onSubmit={handleSubmit} noValidate>
        <CardHeader>
          <CardTitle>Daily Quiz</CardTitle>
          <CardDescription>
            Play three questions. One saved result per name each day on this
            browser.
            <Field className="my-5">
              <FieldLabel htmlFor="Name">Name</FieldLabel>
              <Input
                id="Name"
                type="text"
                placeholder="Enter your name"
                aria-invalid={showError && !name}
                onChange={(event) => {
                  setName(event.target.value)
                  setShowError(false)
                }}
              />
              {showError && (
                <FieldLabel className="text-destructive" htmlFor="Name">
                  Enter your name!
                </FieldLabel>
              )}
            </Field>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button nativeButton type="submit">
            Start todays quiz
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default Daily
