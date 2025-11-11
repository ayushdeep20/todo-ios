import { useState, useEffect } from "react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tasks")) || [];
      setTasks(saved);
    } catch {
      setTasks([]);
    }
  }, []);

  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-sm min-h-screen bg-white pb-24 px-4 pt-6">
      <input
        className="w-full p-3 border rounded-xl bg-gray-50 mb-4"
        placeholder="Search tasks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.length === 0 && (
        <p classname="text-center text-gray-400 mt-10">No matching tasks.</p>
      )}

      <div className="space-y-3">
        {filtered.map((t, i) => (
          <div
            key={i}
            className="p-3 border rounded-lg flex flex-col bg-gray-50"
          >
            <span className="font-semibold">{t.title}</span>
            <span className="text-sm text-gray-500">{t.description}</span>
            <span
              className={`text-xs mt-1 ${
                t.status === "Completed" ? "text-green-600" : "text-blue-600"
              }`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
