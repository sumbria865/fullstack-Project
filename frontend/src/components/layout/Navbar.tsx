import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); // clears token + user from context
    navigate("/login");
  };

  const goToDashboard = () => {
    if (!user) return;

    if (user.role === "ADMIN") navigate("/dashboard/admin");
    else if (user.role === "MANAGER") navigate("/dashboard/manager");
    else navigate("/dashboard/user");
  };

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>

        <h1
          onClick={goToDashboard}
          className="font-semibold text-lg hidden md:block cursor-pointer"
        >
          Bug Tracker Dashboard
        </h1>
      </div>

      {/* Right section */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
};

export default Navbar;
