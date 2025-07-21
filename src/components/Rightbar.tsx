// Rightbar.tsx
import Avatar from "react-avatar"
import account from "../assets/account.png"
import { auth, db } from "../firebase/setup"
import question from "../assets/question.png"
import pen from "../assets/pen.png"
import edit from "../assets/edit.png"
import { addDoc, collection, doc, getDocs, deleteDoc, updateDoc, increment } from "firebase/firestore"
import { useEffect, useState } from "react"
import comment from "../assets/comment.png"
import { Link } from "react-router-dom"
import PostPopup from "./PostPopup"

type SearchProp = {
  search: string
  menu: string
}

const Rightbar = (props: SearchProp) => {
  const questionRef = collection(db, "questions")
  const [questionData, setQuestionData] = useState<any[]>([])
  const [commentToggle, setCommentToggle] = useState(false)
  const [questionId, setQuestionId] = useState("")
  const [answers, setAnswers] = useState("")
  const [post, setPost] = useState(false)

  const getQuestion = async () => {
    try {
      const data = await getDocs(questionRef)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      setQuestionData(filteredData)
    } catch (err) {
      console.error(err)
    }
  }

  const answerDoc = doc(db, "questions", `${questionId ? questionId : Math.random()}`)
  const answerRef = collection(answerDoc, "answers")

  const addAnswer = async () => {
    try {
      await addDoc(answerRef, {
        ans: answers,
        email: auth?.currentUser?.email,
        timestamp: new Date().toISOString()
      })
      setAnswers("")
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getQuestion()
  }, [])

  const formatUsername = (email: string) => {
    if (!email) return "Anonymous"
    const name = email.substring(0, email.indexOf("@"))
    return name.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="flex-1 p-6">
      {/* Create Post Card */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center mb-4">
          <Avatar 
            round 
            size="40" 
            className="cursor-pointer" 
            name={auth?.currentUser?.email ?? undefined} 
            src={auth?.currentUser?.emailVerified ? undefined : account}
          />
          <input
            onClick={() => setPost(true)}
            placeholder="What do you want to ask or share?"
            className="bg-gray-100 p-3 ml-3 placeholder-gray-500 rounded-full w-full cursor-pointer hover:bg-gray-200 transition-colors"
          />
        </div>
        <div className="flex justify-between px-4 text-gray-600">
          <button 
            onClick={() => setPost(true)}
            className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <img src={question} className="w-5 h-5" alt="Ask" />
            <span className="ml-2">Ask</span>
          </button>
          <button 
            onClick={() => setPost(true)}
            className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <img src={edit} className="w-5 h-5" alt="Answer" />
            <span className="ml-2">Answer</span>
          </button>
          <button 
            onClick={() => setPost(true)}
            className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <img src={pen} className="w-5 h-5" alt="Post" />
            <span className="ml-2">Post</span>
          </button>
        </div>
      </div>

      {/* Questions Feed */}
      {questionData
        .filter((data: any) => 
          props?.search 
            ? data?.question.toLowerCase().includes(props?.search.toLowerCase()) 
            : data?.question?.toLowerCase().includes(props?.menu.toLowerCase())
        )
        .map((data: any) => (
          <div key={data.id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex items-center mb-4">
              <Avatar 
                round 
                size="40" 
                className="cursor-pointer" 
                name={data?.email ?? undefined} 
                src={account}
              />
              <div className="ml-3 flex-1">
                <h3 className="font-semibold text-gray-900">
                  {formatUsername(data?.email)}
                </h3>
                <p className="text-xs text-gray-500">
                  Asked • {new Date(data.timestamp || new Date()).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this question?")) {
                    try {
                      await deleteDoc(doc(db, "questions", data.id));
                      getQuestion();
                    } catch (err) {
                      console.error("Failed to delete question:", err);
                    }
                  }
                }}
                className="text-red-600 hover:text-red-800 font-semibold ml-4"
                title="Delete Question"
              >
                Delete
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {data.question.endsWith("?") ? data.question : `${data.question}?`}
            </h2>
            
            <div className="flex items-center text-gray-500 border-t border-b border-gray-100 py-3">
              <button 
                onClick={async () => {
                  try {
                    const questionDoc = doc(db, "questions", data.id);
                    if (data.upvoters && data.upvoters.includes(auth?.currentUser?.email)) {
                      // User has already upvoted, so remove the upvote
                      await updateDoc(questionDoc, {
                        upvotes: increment(-1),
                        upvoters: data.upvoters.filter((email: string) => email !== auth?.currentUser?.email)
                      });
                    } else {
                      // User has not upvoted yet, so add the upvote
                      await updateDoc(questionDoc, {
                        upvotes: increment(1),
                        upvoters: data.upvoters ? [...data.upvoters, auth?.currentUser?.email] : [auth?.currentUser?.email]
                      });
                    }
                    getQuestion();
                  } catch (err) {
                    console.error("Failed to toggle upvote:", err);
                  }
                }}
                className="flex items-center mr-6 hover:text-blue-600"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                </svg>
                <span>Upvote {data.upvotes ? data.upvotes : 0}</span>
              </button>
              
              <button 
                onClick={() => {
                  setQuestionId(data?.id)
                  setCommentToggle(!commentToggle)
                }}
                className="flex items-center mr-6 hover:text-blue-600"
              >
                <img src={comment} className="w-5 h-5 mr-1" alt="Comment" />
                <span>Comment</span>
              </button>
              
              <Link 
                to="/answers" 
                state={{ id: data?.id, question: data.question }}
                className="flex items-center hover:text-blue-600"
              >
                <span>View Answers</span>
              </Link>
            </div>

            {commentToggle && questionId === data.id && (
              <div className="mt-4 flex items-start">
                <Avatar 
                  round 
                  size="40" 
                  className="cursor-pointer flex-shrink-0" 
                  name={auth?.currentUser?.email ?? undefined} 
                  src={auth?.currentUser?.emailVerified ? undefined : account}
                />
                <div className="ml-3 flex-1">
                  <textarea
                    value={answers}
                    onChange={(e) => setAnswers(e.target.value)}
                    placeholder="Write your answer..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2 space-x-3">
                    <button 
                      onClick={() => setCommentToggle(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        addAnswer()
                        setCommentToggle(false)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Post Answer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

      {post && <PostPopup setPost={setPost} onQuestionAdded={getQuestion} />}
    </div>
  )
}

export default Rightbar