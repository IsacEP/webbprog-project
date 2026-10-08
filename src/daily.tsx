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
import { Field, FieldDescription, FieldLabel } from "./components/ui/field"
import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"

export function dailyGameId(date = new Date()) {
  return `daily-${todayKey(date)}`
}


function Daily() {

  const [showError, setShowError] = useState(false);

  const [name, setName] = useState("");

  const gameId = dailyGameId()
  const navigate = useNavigate()


  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim()
    if (!trimmedName) {
      setShowError(true);
      return;
    }

    navigate(`/play/${gameId}?name=${encodeURIComponent(trimmedName)}`);
  }

  return (
    <Card className="md:w-3xl">
      <form onSubmit={handleSubmit} noValidate>

      <CardHeader>
        <CardTitle>Daily quiz</CardTitle>
        <CardDescription>
          Everyone gets the same questions today. One attempt per day.
          <Field className="my-5">
            <FieldLabel htmlFor="input-field-username">Name</FieldLabel>
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
            
          </Field>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button nativeButton={false} type="submit">
          Start todays quiz
        </Button>
      </CardFooter>
      </form>
    </Card>
  )
}

export default Daily
