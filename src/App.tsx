import { Link, Outlet } from "react-router"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./components/ui/navigation-menu"
import type { Question } from "./lib/questions"
import { useFetchQuestions } from "./use-fetch-questions"

export function App() {
  const questions = useFetchQuestions("https://opentdb.com/")

  return (
    <>
      <NavigationMenu className="sticky top-0 z-50 flex w-full max-w-none justify-between rounded-none border-0 border-b-4 bg-white px-3 py-2">
        <header className="d-inline">
          <Link to="/" className="font-heading text-lg font-medium">
            Trivia
          </Link>
        </header>
        <NavigationMenuList className="flex gap-2">
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link to="/">Home</Link>}
            ></NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link to="/play">Play</Link>}
            ></NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link to="/daily-quiz">Daily Quiz</Link>}
            ></NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link to="/leaderboard">Leaderboard</Link>}
            ></NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="mx-auto grid max-w-5xl justify-items-center gap-4 p-6">
        <main>
          <Outlet context={{ questions } satisfies OutletContextType} />
        </main>
      </div>
    </>
  )
}

export type OutletContextType = {
  questions: Question[]
}

export default App
