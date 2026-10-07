import { createBrowserRouter, type RouteObject } from "react-router";
import App from "./App";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import ComposeSalad from "./compose-salad";
import ViewCart from "./view-cart";
import { NewSaladInfobox } from "./new-salad-info-box";

const routerConfig: RouteObject[] = [
  {
    //path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "*",
        Component: PageNotFound,
      },
      {
        path: "/compose-salad",
        Component: ComposeSalad,
      },
      {
        path: "/view-cart",
        Component: ViewCart,
        children: [
          {
            path: "new/:uuid",
            Component: NewSaladInfobox,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routerConfig);

function Home() {
  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardTitle>Välkommen till min salladsbar</CardTitle>
        <CardDescription>
          Här kan du komponera och beställa sallader.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function PageNotFound() {
  return <h2>Sidan kunde inte hittas</h2>;
}

export default router;
