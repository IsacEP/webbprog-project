import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
import {X, Check} from "lucide-react";
import { Button } from "./components/ui/button"
import { Link } from "react-router"

type LeaderboardEntry = {
  name: string
  correct: boolean[]
  totalTime: number // seconds
  totalScore: number
}

const users: LeaderboardEntry[] = [
  {
    name: "Gustaf",
    correct: [true, true, true],
    totalTime: 3,
    totalScore: 3,
  },
  {
    name: "Nils",
    correct: [true, false, false],
    totalTime: 42,
    totalScore: 1,
  },
  {
    name: "Isac",
    correct: [false, false, false],
    totalTime: 65,
    totalScore: 0,
  },
]
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function LeaderBoard() {
  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Top 10 triviars</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Q1</TableHead>
              <TableHead>Q2</TableHead>
              <TableHead>Q3</TableHead>
              <TableHead>Time</TableHead>
              {/*<TableHead>Daily Score</TableHead>*/}
              <TableHead className="text-right">Total Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.name}>
                <TableCell className="font-medium">{user.name}</TableCell>
                {user.correct.map((question) =>
                <TableCell>{question ? <Check className="text-green-600"/> : <X className="text-red-600"/>}</TableCell>
                )}
                <TableCell>{formatTime(user.totalTime)}</TableCell>
                {/* <TableCell className="">{user.dailyScore}</TableCell> */}
                <TableCell className="text-right">
                  {user.totalScore}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-right">3</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
        <CardFooter>
        <Button render={<Link to={`/`}></Link>}>Home</Button>
        </CardFooter>
    </Card>
  )
}
