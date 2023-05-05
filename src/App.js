import { Routes, Route, createRoutesFromElements, createBrowserRouter, RouterProvider } from "react-router-dom"
import Create from "./routes/create"
import Lobby  from "./routes/lobby"


const router = createBrowserRouter([
      {
        path: "/",
        element: <Create />,
      },
      {
        path: "/lobby/:gameId",
        element: <Lobby />,
      },
    ]
  );

const App = () => <RouterProvider router={router} />;

export default App;