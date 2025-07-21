// Leftbar.tsx
import finance from "../assets/finance.jpg"
import health from "../assets/health.jpg"
import living from "../assets/living.jpg"
import science from "../assets/science.jpg"
import fam from "../assets/fam.jpg"
import tech from "../assets/tech.jpg"
import animals from "../assets/animals.jpg"

type MenuProp = {
  setMenu: (menu: string) => void
}

const Leftbar = (props: MenuProp) => {
  const topics = [
    { icon: finance, name: "Finance", key: "finance" },
    { icon: living, name: "Healthy Living", key: "living" },
    { icon: science, name: "Science", key: "science" },
    { icon: health, name: "Health", key: "health" },
    { icon: tech, name: "Technology", key: "tech" },
    { icon: animals, name: "Animals", key: "animals" },
    { icon: fam, name: "Family Advice", key: "fam" }
  ]

  return (
    <div className="sticky top-0 h-screen w-64 p-6 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Topics</h2>
          <nav className="space-y-2">
            {topics.map((topic) => (
              <div
                key={topic.key}
                onClick={() => props.setMenu(topic.key)}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <img src={topic.icon} className="w-5 h-5 rounded-sm" alt={topic.name} />
                <span className="ml-3 text-gray-700">{topic.name}</span>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">About</span>
            <span className="hover:text-gray-700 cursor-pointer">Careers</span>
            <span className="hover:text-gray-700 cursor-pointer">Terms</span>
            <span className="hover:text-gray-700 cursor-pointer">Privacy</span>
            <span className="hover:text-gray-700 cursor-pointer">Acceptable Use</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">© Quora Clone 2024</p>
        </div>
      </div>
    </div>
  )
}

export default Leftbar