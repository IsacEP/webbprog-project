import { createBrowserRouter, Link, type RouteObject } from "react-router"
import App from "./App"
import Daily from "./daily"
import Game from "./game"
import Play from "./play"
import { Button } from "./components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import LeaderBoard from "./leaderboard"

const routerConfig: RouteObject[] = [
  {
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/play",
        Component: Play,
      },
      {
        path: "/play/:uuid",
        Component: Game,
      },
      {
        path: "/daily-quiz",
        Component: Daily,
      },
      {
        path: "/leaderboard",
        Component: LeaderBoard,
      },
      {
        path: "*",
        Component: PageNotFound,
      },
    ],
  },
]

const router = createBrowserRouter(routerConfig)

function Home() {
  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardTitle>Welcome to Trivia</CardTitle>
        <CardDescription>
          Start a new game or try today&apos;s daily quiz.
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button nativeButton={false} render={<Link to="/play" />}>
          Play
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link to="/daily-quiz" />}
        >
          Daily quiz
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link to="/leaderboard" />}
        >
          Leaderboard
        </Button>
      </CardFooter>
    </Card>
  )
}

function PageNotFound() {
  return <h2>Page not found</h2>
}

export default router
