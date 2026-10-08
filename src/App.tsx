import { Link, Outlet } from "react-router"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "./components/ui/navigation-menu"
import type { Question } from "./lib/questions"
import { useFetchQuestions } from "./use-fetch-questions"

export function App() {
  const questions = useFetchQuestions("https://opentdb.com/")

  return (
    <div className="mx-auto grid max-w-5xl justify-items-center gap-4 p-6">
        <header>
          <Link to="/" className="font-heading text-lg font-medium">
            Trivia
          </Link>
        </header>

        <NavigationMenu >
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
        <main>
          <Outlet />
        </main>
      <main>
        <Outlet context={{ questions } satisfies OutletContextType} />
      </main>
    </div>
  )
}

export type OutletContextType = {
  questions: Question[]
}

export default App
