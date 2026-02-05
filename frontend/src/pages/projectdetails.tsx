import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import KanbanBoard from "./kanbanBoard";
import ErrorBoundary from "../components/ErrorBoundary";
import api from "../services/api";
import { getCurrentUser } from "../services/auth.service";
import React from "react";

type Project = {
  id: string;
  name: string;
  description?: string;
  allowedRoles?: string[]; // optional backend info
};

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  const userRole = currentUser?.role || "USER";

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
        setProject(res.data);

        // Optional: restrict access based on backend role info
        if (res.data.allowedRoles && !res.data.allowedRoles.includes(userRole)) {
          setError("Access denied to this project");
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      } catch (err: any) {
        console.error(err);
        const msg = err?.response?.data?.message || "Failed to load project";
        setError(msg);

        // Redirect if project not found / access denied
        if (err?.response?.status === 403 || err?.response?.status === 404) {
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate, userRole]);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading project...</p>;
  if (error) return <p className="p-6 text-center text-red-500 font-medium">{error}</p>;
  if (!project) return <p className="p-6 text-center text-gray-500">Project not available</p>;

  return (
    <PageWrapper>
      <div className="p-4 md:p-6 space-y-6">

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:underline mb-2"
        >
          ← Back to Dashboard
        </button>

        {/* Project Header */}
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-gray-500 mt-1">{project.description}</p>
          )}

          {/* Admin-only Edit button */}
          {userRole === "ADMIN" && (
            <button
              onClick={() => navigate(`/projects/${projectId}/edit`)}
              className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Edit Project
            </button>
          )}
        </div>

        {/* Kanban Board */}
        <div className="bg-white rounded-xl shadow p-4">
          <ErrorBoundary>
            <KanbanBoard projectId={projectId!} userRole={userRole} />
          </ErrorBoundary>
        </div>
      </div>
    </PageWrapper>
  );
}
