import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import { getProjects } from "../services/project.service";
import { getTickets } from "../services/ticket.service";

/* ---------- Types ---------- */

type Project = {
  id: string;
  name: string;
  description?: string;
};

type Ticket = {
  _id: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee?: {
    id: string;
    name: string;
  };
};

/* ---------- Component ---------- */

const Dashboard = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = { name: "Prinka", role: "ADMIN" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);

        const ticketPromises = projectsData.map((p) =>
          getTickets(p.id)
        );

        const ticketsByProject = await Promise.all(ticketPromises);
        setTickets(ticketsByProject.flat());
      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <div className="space-y-6 p-4 sm:p-6 md:p-8">

        {/* ---------- Header ---------- */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Welcome back, {currentUser.name} 👋
          </h1>
        </div>

        {/* ---------- Projects ---------- */}
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Tickets ---------- */}
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">
            Recent Tickets ({tickets.length})
          </h2>

          {tickets.length === 0 ? (
            <p className="text-gray-500">
              No tickets found. Create one to get started.
            </p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Priority</th>
                  <th className="py-2 px-3">Assignee</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="border-b">
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
