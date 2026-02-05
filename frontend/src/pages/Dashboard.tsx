import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";

import Button from "../components/ui/Button";
import { getProjects, deleteProject } from "../services/project.service";
import { getTickets, getMyTickets } from "../services/ticket.service";


/* ---------- Types ---------- */
type Project = {
  id: string;
  name: string;
  description?: string;
};

type Ticket = {
  id: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee?: { name: string };
  project?: { name: string };
};

/* ---------- Component ---------- */
const Dashboard = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Logged-in user
  const currentUser = JSON.parse(
    localStorage.getItem("user") || '{"name":"User","role":"USER"}'
  );
  const userRole = currentUser.role;

  /* ---------- Fetch Data ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* ============================
           🔑 USER FLOW
        ============================ */
        if (userRole === "USER") {
          try {
            const myTickets = await getMyTickets();
            setTickets(Array.isArray(myTickets) ? myTickets : []);
          } catch (err) {
            console.error("Failed to load user tickets:", err);
            setTickets([]); // ✅ SAFE fallback
          }
          setProjects([]);
          return;
        }

        /* ============================
           🔑 ADMIN / MANAGER FLOW
        ============================ */
        const projectsData = await getProjects();
        setProjects(projectsData);

        if (projectsData.length === 0) {
          setTickets([]);
          return;
        }

        const ticketPromises = projectsData.map((p: Project) => getTickets(p.id));
        const ticketsByProject = await Promise.all(ticketPromises);

        setTickets(ticketsByProject.flat());
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setTickets([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  /* ---------- Reports Helpers ---------- */
  const countByStatus = (status: string) =>
    tickets.filter((t) => t.status === status).length;

  const countByPriority = (priority: string) =>
    tickets.filter((t) => t.priority === priority).length;

  /* ---------- Delete Project (ADMIN only) ---------- */
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setTickets([]);
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Delete failed. Check console.");
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="p-8 text-center text-gray-600">
          Loading dashboard...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-8 p-4 sm:p-6 md:p-8">
        {/* ---------- Header ---------- */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl p-6 shadow-lg flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Welcome back, {currentUser.name} 👋
            </h1>
            <p className="text-sm text-indigo-100 mt-1">
              Your role: <span className="font-semibold">{userRole}</span>
            </p>
          </div>

          {userRole === "ADMIN" && (
            <Button
              className="mt-4 sm:mt-0 bg-indigo-600 text-white"
              onClick={() => navigate("/create-project")}
            >
              Create New Project
            </Button>
          )}
        </div>

        {/* ---------- Ticket Status Reports ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-sm text-gray-500">TODO</p>
            <p className="text-3xl font-bold text-indigo-600">
              {countByStatus("TODO")}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-sm text-gray-500">IN PROGRESS</p>
            <p className="text-3xl font-bold text-yellow-500">
              {countByStatus("IN_PROGRESS")}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-sm text-gray-500">DONE</p>
            <p className="text-3xl font-bold text-green-600">
              {countByStatus("DONE")}
            </p>
          </div>
        </div>

        {/* ---------- Projects (ADMIN / MANAGER only) ---------- */}
        {userRole !== "USER" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Projects ({projects.length})
            </h2>

            {projects.length === 0 && (
              <p className="text-gray-500">No projects found.</p>
            )}

            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-50 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                >
                  <h3 className="font-semibold text-lg">{project.name}</h3>

                  <div className="flex gap-4 text-sm">
                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="text-indigo-600 hover:underline"
                    >
                      Reports
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/projects/${project.id}/tickets`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Tickets
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/projects/${project.id}/kanban`)
                      }
                      className="text-green-600 hover:underline"
                    >
                      Kanban
                    </button>

                    {userRole === "ADMIN" && (
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- Recent Tickets ---------- */}
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">
            Recent Tickets ({tickets.length})
          </h2>

          {tickets.length === 0 ? (
            <p className="text-gray-500">
              {userRole === "USER"
                ? "No tickets assigned yet. Please wait for admin."
                : "No tickets found. Create one to get started."}
            </p>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Priority</th>
                  <th className="py-2 px-3">Assignee</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b">
                    <td className="py-2 px-3">{ticket.title}</td>
                    <td className="py-2 px-3">{ticket.priority}</td>
                    <td className="py-2 px-3">
                      {ticket.assignee?.name || "Unassigned"}
                    </td>
                    <td className="py-2 px-3">{ticket.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
