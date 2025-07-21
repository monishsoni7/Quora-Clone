import bell from "../assets/bell.png"
import globe from "../assets/globe.png"
import group from "../assets/group.png"
import clipboard from "../assets/clipboard.png"
import edit from "../assets/edit.png"
import home from "../assets/home.png"
import quora from "../assets/quora.png"
import lens from "../assets/lens.png"
import Avatar from "react-avatar"
import { auth } from "../firebase/setup"
import account from "../assets/account.png"
import PostPopup from "./PostPopup"
import { useState } from "react"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

type SearchProp = {
  setSearch: (search: string) => void
}

const Navbar = (props: SearchProp) => {
  const [post, setPost] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side */}
          <div className="flex items-center space-x-8">
            <img src={quora} className="w-24 h-7 cursor-pointer" alt="Quora Logo" />
            
            <div className="hidden md:flex items-center space-x-6">
              <NavIcon icon={home} alt="Home" />
              <NavIcon icon={clipboard} alt="Answer" />
              <NavIcon icon={edit} alt="Spaces" />
              <NavIcon icon={group} alt="Notifications" />
              <NavIcon icon={bell} alt="Profile" />
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img src={lens} className="w-4 h-4 text-gray-400" alt="Search" />
              </div>
              <input
                onChange={(e) => props.setSearch(e.target.value)}
                placeholder="Search Quora"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:block text-sm font-medium text-red-600 border border-red-600 rounded-full px-4 py-1 hover:bg-red-50 transition-colors">
              Try Quora+
            </button>

            <img src={globe} className="w-5 h-5 cursor-pointer hidden md:block" alt="Language" />

            <div className="relative">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {auth?.currentUser?.emailVerified ? (
                  <Avatar 
                    round 
                    size="32" 
                    name={auth.currentUser.email} 
                    className="border-2 border-gray-200 hover:border-blue-500 transition-colors"
                  />
                ) : (
                  <Avatar 
                    round 
                    size="32" 
                    src={account} 
                    className="border-2 border-gray-200 hover:border-blue-500 transition-colors"
                  />
                )}
              </div>

              {/* Dropdown menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => setPost(true)}
              className="hidden md:flex items-center bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full px-4 py-2 ml-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (simplified) */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-t">
        <NavIcon icon={home} alt="Home" />
        <NavIcon icon={clipboard} alt="Answer" />
        <div className="relative">
          <button 
            onClick={() => setPost(true)}
            className="bg-red-600 text-white rounded-full p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
        </div>
        <NavIcon icon={group} alt="Notifications" />
        <div onClick={() => setShowDropdown(!showDropdown)}>
          <NavIcon icon={account} alt="Account" />
        </div>
      </div>

      {post && <PostPopup setPost={setPost} />}
    </div>
  )
}

// Reusable NavIcon component
const NavIcon = ({ icon, alt }: { icon: string; alt: string }) => (
  <img 
    src={icon} 
    className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
    alt={alt} 
  />
)

export default Navbar