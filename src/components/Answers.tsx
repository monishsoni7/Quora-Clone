import Avatar from "react-avatar"
import { auth, db } from "../firebase/setup"
import account from "../assets/account.png"
import { collection, doc, getDocs } from "firebase/firestore"
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

// Icon components (same as in your mock)
const UpvoteIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 15 7-7 7 7"/>
    </svg>
);

const DownvoteIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 9 7 7 7-7"/>
    </svg>
);

const CommentIcon = ({ className }) => (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const ShareIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
);

const Answers = () => {
    const location = useLocation()
    const [answerData, setAnswerData] = useState<any>([])
    const [loading, setLoading] = useState(true)

    const answerDoc = doc(db, "questions", `${location?.state?.id ? location?.state?.id : Math.random()}`)
    const answerRef = collection(answerDoc, "answers")

    const getAnswer = async () => {
        try {
            setLoading(true)
            const data = await getDocs(answerRef)
            const filteredData = data?.docs?.map((doc: any) => ({
                ...doc?.data(),
                id: doc?.id
            }))
            setAnswerData(filteredData)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAnswer()
    }, [])

    const formatUsername = (email) => {
        if (!email) return "Anonymous"
        const name = email.substring(0, email.indexOf("@"))
        return name.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* Question Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                        {location?.state?.question ?? 'Question'}
                    </h1>
                    <div className="flex items-center flex-wrap gap-4 text-sm">
                        <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200">
                            Answer
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 font-medium hover:text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            Follow
                        </button>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold p-6 border-b border-gray-200 text-gray-800">
                        {loading ? 'Loading Answers...' : `${answerData.length} ${answerData.length === 1 ? 'Answer' : 'Answers'}`}
                    </h2>

                    {loading && (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    )}

                    {!loading && answerData.length === 0 && (
                        <p className="p-6 text-gray-500">No answers yet. Be the first to answer!</p>
                    )}

                    {!loading && answerData?.map((data: any) => (
                        <div key={data.id} className="p-6 border-b border-gray-200 last:border-b-0">
                            {/* Answer Header */}
                            <div className="flex items-center mb-4">
                                {data?.email ? (
                                    <Avatar round size="40" name={data.email} className="mr-3" />
                                ) : (
                                    <Avatar round size="40" src={account} className="mr-3" />
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">{formatUsername(data?.email)}</h3>
                                    <p className="text-sm text-gray-500">
                                        {data.timestamp ? `Answered ${new Date(data.timestamp).toLocaleDateString()}` : 'Answered'}
                                    </p>
                                </div>
                            </div>

                            {/* Answer Body */}
                            <p className="text-gray-800 leading-relaxed text-base ml-12">
                                {data?.ans}
                            </p>

                            {/* Answer Footer */}
                            <div className="flex items-center text-gray-600 mt-4 ml-12 space-x-2 sm:space-x-4">
                                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                                    <UpvoteIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                                    <span className="font-medium text-sm">{data.upvotes || 0}</span>
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                                    <DownvoteIcon className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                                    <CommentIcon className="w-5 h-5 text-gray-500" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                                    <ShareIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Answers