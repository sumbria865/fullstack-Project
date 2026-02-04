import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* ---------- Types ---------- */
type Ticket = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "HIGH" | "MEDIUM" | "LOW";
  assignee?: {
    name?: string;
  };
};

export default function ProjectReports() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch Tickets ---------- */
  useEffect(() => {
    // ✅ BLOCK invalid route like /projects/create
    if (!projectId || projectId === "create") {
      navigate("/projects");
      return;
    }

    const loadReports = async () => {
      try {
        const res = await api.get("/tickets", {
          params: { projectId },
        });
        setTickets(res.data);
      } catch (err: any) {
        console.error("Failed to load reports", err);

        if (err.response?.status === 401) {
          navigate("/login");
        } else if (err.response?.status === 403) {
          alert("You are not allowed to view this project");
          navigate("/dashboard");
        } else {
          alert("Failed to load project reports");
        }
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [projectId, navigate]);

  /* ---------- Stats ---------- */
  const statusCounts = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
  const priorityCounts = { HIGH: 0, MEDIUM: 0, LOW: 0 };

  tickets.forEach((t) => {
    statusCounts[t.status]++;
    priorityCounts[t.priority]++;
  });

  const statusData = {
    labels: ["TODO", "IN_PROGRESS", "DONE"],
    datasets: [
      {
        label: "Tickets by Status",
        data: [
          statusCounts.TODO,
          statusCounts.IN_PROGRESS,
          statusCounts.DONE,
        ],
        backgroundColor: ["#f87171", "#facc15", "#34d399"],
      },
    ],
  };

  const priorityData = {
    labels: ["HIGH", "MEDIUM", "LOW"],
    datasets: [
      {
        label: "Tickets by Priority",
        data: [
          priorityCounts.HIGH,
          priorityCounts.MEDIUM,
          priorityCounts.LOW,
        ],
        backgroundColor: ["#f87171", "#fcd34d", "#34d399"],
      },
    ],
  };

  if (loading) {
    return <p className="p-10 text-center">Loading reports...</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h1 className="text-3xl font-bold">Project Reports</h1>
        <p className="text-gray-500">Analytics for this project</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Tickets" value={tickets.length} color="bg-indigo-500" />
        <StatCard title="TODO" value={statusCounts.TODO} color="bg-red-500" />
        <StatCard title="In Progress" value={statusCounts.IN_PROGRESS} color="bg-yellow-500" />
        <StatCard title="Done" value={statusCounts.DONE} color="bg-green-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Tickets by Status" data={statusData} />
        <ChartCard title="Tickets by Priority" data={priorityData} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h2 className="font-semibold mb-4">Recent Tickets</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-2">Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{t.title}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                <td>{t.assignee?.name || "Unassigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */
function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`rounded-xl p-4 text-white shadow ${color}`}>
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, data }: { title: string; data: any }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-center font-semibold mb-4">{title}</h2>
      <Bar data={data} />
    </div>
  );
}
