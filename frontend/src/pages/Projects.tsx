import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* ---------- Types ---------- */
type Project = {
  id: string; // Prisma uses `id`
  name: string;
  description?: string;
  createdAt: string;
};

/* ---------- Component ---------- */
export default function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* ---------- Fetch Projects ---------- */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };

    fetchProjects();
  }, []);

  /* ---------- Filter ---------- */
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- Create Project ---------- */
  const addProject = async (title: string, description: string) => {
    try {
      const res = await api.post("/projects", {
        name: title,
        description,
      });

      setProjects((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  /* ---------- Delete Project ---------- */
  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-sm opacity-90">
          Manage and track all your projects
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="border px-4 py-2 rounded-lg w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + New Project
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="aspect-square rounded-xl border bg-gradient-to-br from-slate-50 to-white hover:border-blue-500 hover:shadow-lg transition p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-lg text-gray-800">
                {project.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                {project.description || "No description"}
              </p>
            </div>

            <div className="space-y-2">
              <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                🐞 Tickets
              </span>

              <div className="flex justify-between items-center">
                <button
                  onClick={() =>
                    navigate(`/projects/${project.id}/tickets`)
                  }
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  View Tickets →
                </button>

                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={addProject}
        />
      )}
    </div>
  );
}

/* ---------- Create Project Modal ---------- */
function CreateProjectModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (title: string, description: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate(title, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create Project</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project name"
          className="border rounded w-full px-3 py-2 mb-3"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description"
          className="border rounded w-full px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
