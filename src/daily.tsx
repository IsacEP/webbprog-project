import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function dailyGameId(date = new Date()) {
  return `daily-${date.toISOString().slice(0, 10)}`
}

function Daily() {

  const gameId = dailyGameId()

  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardTitle>Daily quiz</CardTitle>
        <CardDescription>
          Everyone gets the same questions today. One attempt per day.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button nativeButton={false} render={<Link to={`/play/${gameId}`} />}>
          Start todays quiz
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Daily
