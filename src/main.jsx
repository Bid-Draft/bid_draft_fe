import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import App from './App'
import './index.css'
import Root from "./routes/root";
import Create from "./routes/create";


const router = createBrowserRouter([
  {
    path: "/",
    element: <div><Root /></div>,
  },
  {
    path: "/test",
    element: <div><Create /></div>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
