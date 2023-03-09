// import { Routes, Route, createRoutesFromElements, createBrowserRouter, RouterProvider } from "react-router-dom"
// import Create from "./routes/create"

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         <Route path="create" element={ <Create/> } />
//         <Route
//       element={<Create />}
//       path="lobby/:gameId"
//       loader={async ({ params }) => {
//         return fetch(
//           `http://localhost:3000/api/v1/game?id=${params.gameId}`,
//           { method: 'GET' }
//         );
//       }}
//     />
//       </Routes>
//     </div>
//   )
// }

// export default App

import { Routes, Route, createRoutesFromElements, createBrowserRouter, RouterProvider } from "react-router-dom"
import Create from "./routes/create"
import Lobby, {lobbyLoader}  from "./routes/lobby"


const router = createBrowserRouter([
      {
        path: "/create",
        element: <Create />,
      },
      {
        path: "/lobby/:gameId",
        element: <Lobby />,
        loader: lobbyLoader
      },
    ]
  );

const App = () => <RouterProvider router={router} />;

export default App;