import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Comment {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
}

const CommentsPage = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketId) return;

    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments?ticketId=${ticketId}`);
        setComments(res.data);
      } catch (err: any) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [ticketId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !ticketId) return;

    try {
      const res = await api.post("/comments", { ticketId, text });
      setComments((prev) => [...prev, res.data]);
      setText("");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comments</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={text}
          placeholder="Add a comment..."
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="border p-2 rounded">
              <p>{c.text}</p>
              <small className="text-gray-500">
                by {c.userId} | {new Date(c.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentsPage;
