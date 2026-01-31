import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import CreateProjectModal from "../components/CreateProjectModal";

export default function Projects() {
  const navigate = useNavigate();
  const { projects, deleteProject, addProject, fetchProjects, loading } = useProjects();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState("");

  // Fetch projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        await fetchProjects(); // fetchProjects will use JWT internally
      } catch (err) {
        console.error("Failed to load projects:", err);
        setError("Failed to load projects. Please login again.");
      }
    };
    loadProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-sm opacity-90">Manage and track all your projects</p>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="border px-4 py-2 rounded-lg w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ✅ CREATE PROJECT (ADMIN + MANAGER) */}
        {user?.role !== "USER" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + New Project
          </button>
        )}
      </div>

      {/* ================= PROJECT LIST ================= */}
      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredProjects.length === 0 ? (
        <p className="text-gray-500">No projects found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="aspect-square rounded-xl border bg-gradient-to-br from-slate-50 to-white hover:border-blue-500 hover:shadow-lg transition p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800">{project.name}</h2>
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
                    onClick={() => navigate(`/projects/${project._id}/tickets`)}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View Tickets →
                  </button>

                  {/* ✅ DELETE PROJECT (ADMIN ONLY) */}
                  {user?.role === "ADMIN" && (
                    <button
                      onClick={() => {
                        if (confirm("Delete this project?")) {
                          deleteProject(project._id);
                        }
                      }}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= CREATE PROJECT MODAL ================= */}
      {showCreateModal && user?.role !== "USER" && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} onCreate={addProject} />
      )}
    </div>
  );
}
