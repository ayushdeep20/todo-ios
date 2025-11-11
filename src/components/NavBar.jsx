import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path
      ? "text-blue-600 scale-110 shadow-sm"
      : "text-gray-400 scale-100";

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-3xl px-6 py-3 flex justify-between transition-all">
      <Link className={`flex flex-col items-center gap-1 transition ${isActive("/home")}`} to="/home">
        <span className="text-2xl">🏠</span>
        <span className="text-[11px]">Home</span>
      </Link>

      <Link className={`flex flex-col items-center gap-1 transition ${isActive("/search")}`} to="/search">
        <span className="text-2xl">🔍</span>
        <span className="text-[11px]">Search</span>
      </Link>

      <Link className={`flex flex-col items-center gap-1 transition ${isActive("/calendar")}`} to="/calendar">
        <span className="text-2xl">📅</span>
        <span className="text-[11px]">Calendar</span>
      </Link>
    </nav>
  );
}
