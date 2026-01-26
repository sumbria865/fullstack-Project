import {
  X,
  LayoutDashboard,
  FolderKanban,
  Bug,
  Columns3,
  LogOut,
  User,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800";

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 h-full w-64 bg-slate-900
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">🐞 Bug Tracker</h2>
          <button className="md:hidden text-white" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col justify-between h-[calc(100%-64px)]">
          {/* Top Links */}
          <div className="p-4 space-y-2 text-sm">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 p-2 rounded ${isActive(
                "/dashboard"
              )}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/projects"
              className={`flex items-center gap-3 p-2 rounded ${isActive(
                "/projects"
              )}`}
            >
              <FolderKanban size={18} />
              Projects
            </Link>

            <Link
              to="/kanban"
              className={`flex items-center gap-3 p-2 rounded ${isActive(
                "/kanban"
              )}`}
            >
              <Columns3 size={18} />
              Kanban Board
            </Link>

            <Link
              to="/tickets"
              className={`flex items-center gap-3 p-2 rounded ${isActive(
                "/tickets"
              )}`}
            >
              <Bug size={18} />
              Tickets
            </Link>

            {/* ✅ Profile Page */}
            <Link
              to="/profile"
              className={`flex items-center gap-3 p-2 rounded ${isActive(
                "/profile"
              )}`}
            >
              <User size={18} />
              Profile
            </Link>
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-2 rounded
              text-red-400 hover:bg-slate-800 hover:text-red-300 transition"
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
