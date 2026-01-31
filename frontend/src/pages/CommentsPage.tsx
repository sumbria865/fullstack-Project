import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

interface Comment {
  id: string;
  text: string;
  user?: {
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
    if (!text.trim()) return;

    try {
      const res = await api.post(`/tickets/${ticketId}/comments`, {
        text,
      });

      console.log("✅ Comment added:", res.data);

      setComments((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("❌ Failed to add comment", err);
      alert("Failed to add comment");
    }
  };

  // 🔹 UI STATES
  if (loading) {
    return <p className="p-6">Loading comments...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  // 🔹 MAIN UI
  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Comments</h1>

      {/* Add comment */}
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border rounded p-3 bg-gray-50"
            >
              <p>{comment.text}</p>
              <p className="text-sm text-gray-500 mt-1">
                — {comment.user?.name || "Unknown user"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Back button */}
      <Link
  to="/tickets"
  className="inline-block text-blue-600 hover:underline"
>
  ← Back to Tickets
</Link>

    </div>
  );
}
