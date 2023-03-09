import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
// import App from './App'
import './index.css'
import Root from "./routes/root";
import Create from "./routes/create";
import Lobby from "./routes/lobby";


const router = createBrowserRouter([
  {
    path: "/",
    element: <div><Root /></div>,
  },
  {
    path: "/ass",
    element: <div><Create/></div>
  },
  {
    path: "/lobby",
    element: <div><Lobby/></div>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
