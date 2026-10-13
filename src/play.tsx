import { useEffect, useState, type FormEvent } from "react"
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
import { Input } from "./components/ui/input"
import { Field, FieldLabel } from "./components/ui/field"
import {
  fetchCategories,
  type Difficulty,
  type QuestionType,
  type TriviaCategory,
} from "./lib/opentdb"

const selectClassName =
  "h-8 w-full rounded-none border-2 border-input bg-white px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none"

function Play() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState("10")
  const [difficulty, setDifficulty] = useState<Difficulty | "">("")
  const [type, setType] = useState<QuestionType | "">("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState<TriviaCategory[]>([])
  const [categoryError, setCategoryError] = useState(false)
  const [categoryAttempt, setCategoryAttempt] = useState(0)
  const [amountError, setAmountError] = useState(false)

  useEffect(() => {
    let active = true
    fetchCategories().then(
      (items) => {
        if (active) {
          setCategories(items)
          setCategoryError(false)
        }
      },
      () => {
        if (active) setCategoryError(true)
      }
    )
    return () => {
      active = false
    }
  }, [categoryAttempt])

  function startGame(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const count = Number(amount)
    if (!Number.isInteger(count) || count < 1 || count > 50) {
      setAmountError(true)
      return
    }

    const params = new URLSearchParams({ amount: String(count) })
    if (category) {
      params.set("category", category)
      const selectedCategory = categories.find(
        (item) => String(item.id) === category
      )
      if (selectedCategory) params.set("categoryName", selectedCategory.name)
    }
    if (difficulty) params.set("difficulty", difficulty)
    if (type) params.set("type", type)

    navigate(`/play/${crypto.randomUUID()}?${params.toString()}`)
  }

  return (
    <Card className="md:w-3xl">
      <form onSubmit={startGame}>
        <CardHeader>
          <CardTitle>New game</CardTitle>
          <CardDescription>
            Choose which questions to request from Open Trivia DB.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="amount">Number of questions (1–50)</FieldLabel>
            <Input
              id="amount"
              type="number"
              min={1}
              max={50}
              step={1}
              required
              value={amount}
              aria-invalid={amountError}
              onChange={(event) => {
                setAmount(event.target.value)
                setAmountError(false)
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <select
              id="category"
              className={selectClassName}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Any category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {categoryError && (
              <div className="text-sm">
                Categories could not be loaded. You can still play with any
                category.{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => setCategoryAttempt((value) => value + 1)}
                >
                  Retry
                </button>
              </div>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="difficulty">Difficulty</FieldLabel>
            <select
              id="difficulty"
              className={selectClassName}
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value as Difficulty | "")
              }
            >
              <option value="">Any difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="question-type">Question type</FieldLabel>
            <select
              id="question-type"
              className={selectClassName}
              value={type}
              onChange={(event) =>
                setType(event.target.value as QuestionType | "")
              }
            >
              <option value="">Any type</option>
              <option value="multiple">Multiple choice</option>
              <option value="boolean">True / False</option>
            </select>
          </Field>
          <br />
        </CardContent>
        <CardFooter>
          <Button type="submit">Start game</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default Play
