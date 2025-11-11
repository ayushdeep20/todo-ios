import { useState } from "react";
import { FaSearch, FaTrash, FaEdit } from "react-icons/fa";

export default function Search({ tasks, onToggle, onEdit, onDelete }) {
  const [query, setQuery] = useState("");

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  return (
    <div className="p-5 max-w-md mx-auto min-h-screen bg-white pb-24">
      <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-xl shadow-sm mb-5">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full bg-transparent outline-none text-gray-700"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query === "" && (
        <p className="text-center text-gray-400">Type to search tasks.</p>
      )}

      {query !== "" && filtered.length === 0 && (
        <p className="text-center text-gray-400">No matching tasks found.</p>
      )}

      {pending.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Pending Tasks
          </h3>
          <div className="space-y-3 mb-6">
            {pending.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => onToggle(t.id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <div className="font-medium">{t.title}</div>
                </div>
                <div className="flex gap-3 text-lg">
                  <button className="text-blue-600" onClick={() => onEdit(t)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-500" onClick={() => onDelete(t.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Completed Tasks
          </h3>
        <div className="space-y-3">
            {completed.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 bg-gray-100 rounded-xl opacity-80"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => onToggle(t.id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <p className="font-medium line-through text-gray-500">
                    {t.title}
                  </p>
                </div>
                <button
                  className="text-red-500"
                  onClick={() => onDelete(t.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
