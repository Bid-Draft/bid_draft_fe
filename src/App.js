import { Routes, Route } from "react-router-dom"
import Create from "./routes/create"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="create" element={ <Create/> } />
      </Routes>
    </div>
  )
}

export default App
