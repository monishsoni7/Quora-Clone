import { useState } from "react"
import Home from "./Home"
import Navbar from "./Navbar"

const Main = () => {
  const [search, setSearch] = useState("")

  return (
    <>
      <div className="h-screen w-screen overflow-y-auto">
        <Navbar setSearch={setSearch} />
        <div className="pt-20"> {/* Adds space below fixed navbar */}
          <Home search={search} />
        </div>
      </div>
    </>
  )
}

export default Main
