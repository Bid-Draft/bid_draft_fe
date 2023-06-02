import { Routes, Route, createRoutesFromElements, createBrowserRouter, RouterProvider } from "react-router-dom"
import Create from "./routes/create"
import Lobby  from "./routes/lobby"
import Info from "./routes/info"


const router = createBrowserRouter([
      {
        path: "/",
        element: <Create />,
      },
      {
        path: "/lobby/:gameId",
        element: <Lobby />,
      },
      {
        path: "/info",
        element: <Info />,
      }
    ]
  );

const App = () => <RouterProvider router={router} />;

export default App;