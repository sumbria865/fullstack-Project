import {
  X,
  LayoutDashboard,
  FolderKanban,
  Columns3,
  LogOut,
  User,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeProjectId } = useAppContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname.startsWith(path)
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800";

  const kanbanPath = activeProjectId
    ? `/projects/${activeProjectId}/kanban`
    : "/projects";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static z-50 h-full w-64 bg-slate-900
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">🐞 Bug Tracker</h2>
          <button className="md:hidden text-white" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col justify-between h-[calc(100%-64px)]">
          <div className="p-4 space-y-2 text-sm">
            <Link
              to="/dashboard"
              onClick={onClose}
              className={`flex items-center gap-3 p-2 rounded ${isActive(
                "/dashboard"
              )}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/projects"
              onClick={onClose}
              className={`flex items-center gap-3 p-2 rounded ${isActive(
                "/projects"
              )}`}
            >
              <FolderKanban size={18} />
              Projects
            </Link>

            {/* ✅ FIXED KANBAN */}
            <Link
              to={kanbanPath}
              onClick={onClose}
              className={`flex items-center gap-3 p-2 rounded ${isActive(
                "/projects"
              )}`}
            >
              <Columns3 size={18} />
              Kanban Board
            </Link>

            <Link
              to="/profile"
              onClick={onClose}
              className={`flex items-center gap-3 p-2 rounded ${isActive(
                "/profile"
              )}`}
            >
              <User size={18} />
              Profile
            </Link>
          </div>

          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-2 rounded text-red-400 hover:bg-slate-800"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
