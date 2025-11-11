import { NavLink } from "react-router-dom";
import { FaHome, FaSearch, FaCalendarAlt, FaUser } from "react-icons/fa";

export default function NavBar() {
  const linkBase =
    "flex flex-col items-center justify-center text-xs flex-1 py-2";
  const active = "text-blue-600";
  const inactive = "text-gray-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur px-4">
      <div className="max-w-md mx-auto flex">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
          end
        >
          <FaHome className="text-xl" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FaSearch className="text-xl" />
          <span>Search</span>
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FaCalendarAlt className="text-xl" />
          <span>Calendar</span>
        </NavLink>

        <NavLink
          to="/onboarding"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FaUser className="text-xl" />
          <span>Start</span>
        </NavLink>
      </div>
    </nav>
  );
}
