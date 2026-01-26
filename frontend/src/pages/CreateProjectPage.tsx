import { useEffect, useState } from "react";
import api from "../services/api";

/* ======================================================
   TYPES
   ====================================================== */
type Project = {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
};

/* ======================================================
   MAIN COMPONENT
   ====================================================== */
export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Modal States ---------- */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [form, setForm] = useState({ name: "", description: "" });

  /* ======================================================
     🔵 FETCH PROJECTS FROM BACKEND
     ====================================================== */
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await api.get<Project[]>("/projects");
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* ======================================================
     🔵 CREATE PROJECT
     ====================================================== */
  const addProject = async () => {
    if (!form.name.trim()) return alert("Project name required!");
    try {
      const res = await api.post<Project>("/projects", form);
      setProjects([res.data, ...projects]);
      setForm({ name: "", description: "" });
      setShowCreateModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    }
  };

  /* ======================================================
     🔵 UPDATE PROJECT
     ====================================================== */
  const updateProject = async () => {
    if (!selectedProject) return;
    try {
      const res = await api.patch<Project>(
        `/projects/${selectedProject._id}`,
        form
      );
      setProjects(projects.map((p) => (p._id === res.data._id ? res.data : p)));
      setSelectedProject(null);
      setForm({ name: "", description: "" });
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update project");
    }
  };

  /* ======================================================
     🔵 DELETE PROJECT
     ====================================================== */
  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete project");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading projects...</div>;
  }

  /* ======================================================
     UI
     ====================================================== */
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-sm opacity-90">Manage and track all your projects</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + New Project
        </button>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow p-4 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-lg text-gray-800">{p.name}</h2>
              <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                {p.description || "No description"}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  setSelectedProject(p);
                  setForm({ name: p.name, description: p.description || "" });
                  setShowEditModal(true);
                }}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProject(p._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <ProjectModal
          title="Create Project"
          form={form}
          setForm={setForm}
          onClose={() => setShowCreateModal(false)}
          onSubmit={addProject}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedProject && (
        <ProjectModal
          title="Edit Project"
          form={form}
          setForm={setForm}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
          onSubmit={updateProject}
        />
      )}
    </div>
  );
}

/* ======================================================
   MODAL COMPONENT
   ====================================================== */
function ProjectModal({
  title,
  form,
  setForm,
  onClose,
  onSubmit,
}: {
  title: string;
  form: { name: string; description: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Project Name"
          className="border rounded w-full px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Project Description"
          className="border rounded w-full px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
