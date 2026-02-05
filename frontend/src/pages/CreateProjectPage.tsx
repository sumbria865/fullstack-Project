import { useEffect, useState } from "react";
import api from "../services/api";
import React from "react";

/* ======================================================
   TYPES
   ====================================================== */
type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

type User = {
  role: "ADMIN" | "MANAGER" | "USER";
};

/* ======================================================
   MAIN COMPONENT
   ====================================================== */
export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔐 Auth user (from token payload or API) */
  const [user, setUser] = useState<User | null>(null);

  /* ---------- Modal States ---------- */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [form, setForm] = useState({ name: "", description: "" });

  /* ======================================================
     🔵 FETCH USER + PROJECTS
     ====================================================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 👤 get logged-in user
        const me = await api.get<User>("/auth/me");
        setUser(me.data);

        // 📦 get projects
        const res = await api.get<Project[]>("/projects");
        setProjects(res.data.map((p: any) => ({ id: p.id, name: p.name, description: p.description, createdAt: p.createdAt })));
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ======================================================
     🔵 CREATE PROJECT (ADMIN / MANAGER)
     ====================================================== */
  const addProject = async () => {
    if (!form.name.trim()) return alert("Project name required!");
    try {
      const res = await api.post<Project>("/projects", form);
      const p = res.data as any;
      setProjects([{ id: p.id, name: p.name, description: p.description, createdAt: p.createdAt }, ...projects]);
      setForm({ name: "", description: "" });
      setShowCreateModal(false);
    } catch (error) {
      console.error(error);
      alert("Access denied");
    }
  };

  /* ======================================================
     🔵 UPDATE PROJECT
     ====================================================== */
  const updateProject = async () => {
    if (!selectedProject) return;
    try {
      const res = await api.patch<Project>(`/projects/${selectedProject.id}`, form);
      const updated = res.data as any;
      setProjects(projects.map((p) => (p.id === updated.id ? { id: updated.id, name: updated.name, description: updated.description, createdAt: updated.createdAt } : p)));
      setSelectedProject(null);
      setForm({ name: "", description: "" });
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      alert("Access denied");
    }
  };

  /* ======================================================
     🔵 DELETE PROJECT (ADMIN ONLY)
     ====================================================== */
  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Access denied");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading projects...
      </div>
    );
  }

  /* ======================================================
     UI
     ====================================================== */
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-sm opacity-90">
          Manage and track all your projects
        </p>
      </div>

      {/* Actions */}
      {user?.role !== "USER" && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + New Project
        </button>
      )}

      {/* Project List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-lg text-gray-800">
                {p.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {p.description || "No description"}
              </p>
            </div>

            {user?.role !== "USER" && (
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setSelectedProject(p);
                    setForm({
                      name: p.name,
                      description: p.description || "",
                    });
                    setShowEditModal(true);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>

                {user && user.role === "ADMIN" && (
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
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
   MODAL
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
  setForm: React.Dispatch<
    React.SetStateAction<{ name: string; description: string }>
  >;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          placeholder="Project Name"
          className="border rounded w-full px-3 py-2 mb-3"
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Project Description"
          className="border rounded w-full px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
