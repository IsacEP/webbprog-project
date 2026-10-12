import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import { X, Check } from "lucide-react"
import { Button } from "./components/ui/button"
import { Link } from "react-router"
import { formatTime } from "./lib/utils"
import { readLeaderboard } from "./lib/leaderboard"

export default function LeaderBoard() {
  const users = readLeaderboard()
    .sort(
      (a, b) =>
        b.totalScore - a.totalScore ||
        a.totalTime - b.totalTime ||
        b.date.localeCompare(a.date)
    )
    .slice(0, 10)

  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>
          Top 10 daily quiz results on this browser
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p>No daily results yet. Play the daily quiz to get on the board.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Q1</TableHead>
                <TableHead>Q2</TableHead>
                <TableHead>Q3</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={`${user.date}-${user.name.toLocaleLowerCase()}`}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.date}</TableCell>
                  {user.correct.map((correct, index) => (
                    <TableCell key={index}>
                      {correct ? (
                        <Check
                          aria-label="Correct"
                          className="text-green-600"
                        />
                      ) : (
                        <X aria-label="Incorrect" className="text-red-600" />
                      )}
                    </TableCell>
                  ))}
                  <TableCell>{formatTime(user.totalTime)}</TableCell>
                  <TableCell className="text-right">
                    {user.totalScore}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <Button nativeButton={false} render={<Link to="/" />}>
          Home
        </Button>
      </CardFooter>
    </Card>
  )
}
