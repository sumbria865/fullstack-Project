import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import KanbanBoard from "./KanbanBoard";
import api from "../services/api";
import { useAppContext } from "../context/AppContext";

type Project = {
  id: string;
  name: string;
  description?: string;
};

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { setActiveProjectId } = useAppContext();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    setActiveProjectId(projectId);

    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
        setProject(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load project");

        // Optional: redirect if project not found / access denied
        if (err.response?.status === 403 || err.response?.status === 404) {
          setTimeout(() => navigate("/projects"), 1500);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate, setActiveProjectId]);

  // 🔄 Loading state
  if (loading) {
    return <p className="p-6 text-center">Loading project...</p>;
  }

  // ❌ Error state
  if (error) {
    return (
      <p className="p-6 text-center text-red-500 font-medium">
        {error}
      </p>
    );
  }

  // ❌ Safety check
  if (!project) {
    return (
      <p className="p-6 text-center text-gray-500">
        Project not available
      </p>
    );
  }

  return (
    <PageWrapper>
      <div className="p-4 md:p-6 space-y-6">
        {/* Project Header */}
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-gray-500 mt-1">
              {project.description}
            </p>
          )}
        </div>

        {/* Kanban Section */}
        <div className="bg-white rounded-xl shadow p-4">
          <KanbanBoard projectId={projectId} />
        </div>
      </div>
    </PageWrapper>
  );
}
