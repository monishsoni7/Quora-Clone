// Home.tsx
import { useState } from "react"
import Leftbar from "./Leftbar"
import Rightbar from "./Rightbar"

type SearchProp = {
  search: string
}

const Home = (props: SearchProp) => {
  const [menu, setMenu] = useState("")

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block">
        <Leftbar setMenu={setMenu} />
      </div>
      <div className="flex-1 max-w-2xl mx-auto">
        <Rightbar search={props.search} menu={menu} />
      </div>
    </div>
  )
}

export default Home