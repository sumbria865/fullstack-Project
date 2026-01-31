import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: (data: { name: string; description?: string }) => Promise<void>;
};

export default function CreateProjectModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      setLoading(true);
      await onCreate({ name, description });
      onClose();
    } catch (err) {
      alert("Failed to create project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Create Project</h2>

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
