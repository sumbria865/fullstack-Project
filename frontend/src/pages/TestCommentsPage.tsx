import { useNavigate } from "react-router-dom";
import { MessageCircle, User, ArrowRight } from "lucide-react";

export default function TestCommentsPage() {
  const navigate = useNavigate();

  const demoTicketId = "67777777777777777777777d";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800">Test Features</h1>
          <p className="text-gray-600 mt-2">Quick access to key application features</p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          
          {/* Comments Test Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MessageCircle className="text-blue-600" size={24} />
                  Test Comments
                </h2>
                <p className="text-gray-600 mt-1">Add and view ticket comments</p>
              </div>
              <button
                onClick={() => navigate(`/comments/${demoTicketId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Profile Test Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <User className="text-purple-600" size={24} />
                  Profile & Security
                </h2>
                <p className="text-gray-600 mt-1">Change email and password</p>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
