import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, MessageCircle, AlertCircle, CheckCircle } from "lucide-react";
import api from "../services/api";

interface Comment {
  id: string;
  text: string;
  user?: {
    id: string;
    name?: string;
  };
  createdAt: string;
}

export default function CommentsPage() {
  const { ticketId } = useParams<{ ticketId: string }>();

  console.log("✅ ticketId from URL:", ticketId);

  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Fetch comments
  useEffect(() => {
    if (!ticketId) {
      setError("Invalid Ticket ID");
      setLoading(false);
      return;
    }

    const fetchComments = async () => {
      try {
        const res = await api.get(`/tickets/${ticketId}/comments`);
        console.log("📥 Comments fetched:", res.data);
        setComments(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch comments", err);
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [ticketId]);

  // 🔹 Add comment
  const handleAddComment = async () => {
    if (!text.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      const res = await api.post(`/tickets/${ticketId}/comments`, {
        text,
      });

      console.log("✅ Comment added:", res.data);

      setComments((prev) => [...prev, res.data]);
      setText("");
      setError("");
      setSuccess("Comment added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to add comment";
      console.error("❌ Failed to add comment", err);
      setError(msg);
    }
  };

  // 🔹 UI STATES
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (error && !comments.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-semibold">{error}</p>
          <Link to="/projects" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // 🔹 MAIN UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle className="text-blue-600" size={32} />
              Comments
            </h1>
            <p className="text-gray-500 mt-1">Ticket ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{ticketId}</span></p>
          </div>
          <Link
            to="/projects"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back
          </Link>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-700 flex items-center gap-2">
              <CheckCircle size={18} /> {success}
            </p>
          </div>
        )}

        {/* Add Comment Section */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Add a Comment</h2>
          <div className="flex gap-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
          <button
            onClick={handleAddComment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Send size={18} /> Post Comment
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </h2>

          {comments.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No comments yet</p>
              <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-gray-800">
                      {comment.user?.name || "Unknown user"}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
