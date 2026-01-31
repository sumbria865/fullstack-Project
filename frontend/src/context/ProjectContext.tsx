import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "../services/api";

/* ================= TYPES ================= */

export type Project = {
  id: string;
  name: string;
  description?: string;
};

type CreateProjectInput = {
  name: string;
  description?: string;
};

type ProjectContextType = {
  projects: Project[];
  loading: boolean;
  addProject: (data: CreateProjectInput) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
};

/* ================= CONTEXT ================= */

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD PROJECTS ---------- */

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get<Project[]>("/projects");
      setProjects(res.data);
    } catch (error: any) {
      console.error("❌ Failed to load projects:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- INITIAL LOAD ---------- */

  useEffect(() => {
    loadProjects();
  }, []);

  /* ---------- CREATE PROJECT ---------- */

  const addProject = async (data: CreateProjectInput) => {
    try {
      const res = await api.post<Project>("/projects", data);
      setProjects((prev) => [...prev, res.data]);
    } catch (error: any) {
      console.error("❌ Failed to create project:", error?.response?.data || error);
      throw error;
    }
  };

  /* ---------- DELETE PROJECT ---------- */

  const deleteProject = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error("❌ Failed to delete project:", error?.response?.data || error);
      throw error;
    }
  };

  /* ---------- CONTEXT VALUE ---------- */

  const value: ProjectContextType = {
    projects,
    loading,
    addProject,
    deleteProject,
    refreshProjects: loadProjects,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useProjects = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }

  return context;
};
