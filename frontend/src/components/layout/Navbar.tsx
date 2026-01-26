import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>

      <h1 className="font-semibold text-lg hidden md:block">
        Bug Tracker Dashboard
      </h1>

      {/* Right section */}
      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
};

export default Navbar;
