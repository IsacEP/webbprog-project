import { Link, Outlet } from "react-router"

export function App() {
  return (
    <div className="mx-auto grid max-w-5xl justify-items-center gap-4 p-6">
        <header>
          <Link to="/" className="font-heading text-lg font-medium">
            Trivia
          </Link>
        </header>
        <main>
          <Outlet />
        </main>
    </div>
  )
}

export default App
