import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

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
  const { user } = useAuth(); // 🔐 auth-aware
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD PROJECTS ---------- */

  const loadProjects = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await api.get<Project[]>("/projects");
      // Ensure projects use `id` field (backend returns `id` from Prisma)
      setProjects(res.data.map((p: any) => ({ id: p.id, name: p.name, description: p.description })));
    } catch (error: any) {
      console.error(
        "❌ Failed to load projects:",
        error?.response?.data || error
      );
      // ❌ DO NOT throw — prevent app crash
    } finally {
      setLoading(false);
    }
  }, [user]);

  /* ---------- LOAD ON LOGIN / CLEAR ON LOGOUT ---------- */

  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [user, loadProjects]);

  /* ---------- CREATE PROJECT ---------- */

  const addProject = async (data: CreateProjectInput) => {
    const res = await api.post<Project>("/projects", data);
    const p = res.data as any;
    setProjects((prev) => [...prev, { id: p.id, name: p.name, description: p.description }]);
  };

  /* ---------- DELETE PROJECT ---------- */

  const deleteProject = async (id: string) => {
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p.id !== id));
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
