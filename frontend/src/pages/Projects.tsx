import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import CreateProjectModal from "../components/CreateProjectModal";

export default function Projects() {
  const navigate = useNavigate();

  // ✅ FIXED: use refreshProjects (NOT fetchProjects)
  const {
    projects,
    deleteProject,
    addProject,
    refreshProjects,
    loading,
  } = useProjects();

  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    const loadProjects = async () => {
      try {
        await refreshProjects();
      } catch (err: any) {
        console.error("Failed to load projects", err);

        if (err.response?.status === 401) {
          // ❌ Not logged in / token expired
          navigate("/login");
        } else if (err.response?.status === 403) {
          // ❌ Logged in but no permission
          alert("You are not allowed to access Projects");
          navigate("/dashboard");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    };

    loadProjects();
  }, [refreshProjects, navigate]);

  /* ================= FILTER ================= */
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-sm opacity-90">
          Manage and track all your projects
        </p>
      </div>

      {/* ================= ACTION BAR ================= */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="border px-4 py-2 rounded-lg w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ✅ ADMIN & MANAGER ONLY */}
        {user?.role !== "USER" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + New Project
          </button>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredProjects.length === 0 ? (
        <p className="text-gray-500">No projects found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border bg-white hover:border-blue-500 hover:shadow-lg transition p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {project.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {project.description || "No description"}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() =>
                    navigate(`/projects/${project.id}/tickets`)
                  }
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  View Tickets →
                </button>

                {/* ✅ ADMIN ONLY */}
                {user?.role === "ADMIN" && (
                  <button
                    onClick={() => {
                      if (confirm("Delete this project?")) {
                        deleteProject(project.id);
                      }
                    }}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= CREATE MODAL ================= */}
      {showCreateModal && user?.role !== "USER" && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={addProject}
        />
      )}
    </div>
  );
}
