// src/context/AppContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

export type Project = {
  id: number;
  name: string;
  description: string;
};

export type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee: string;
};

type AppContextType = {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  activeProjectId: number | null;
  setActiveProjectId: React.Dispatch<React.SetStateAction<number | null>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);

  return (
    <AppContext.Provider value={{ projects, setProjects, tickets, setTickets, activeProjectId, setActiveProjectId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
