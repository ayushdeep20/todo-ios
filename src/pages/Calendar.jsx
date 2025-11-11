import { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaTrash, FaEdit } from "react-icons/fa";

const formatDate = (date) => new Date(date).toLocaleDateString("en-CA");

export default function Calendar({ tasks, onToggle, onEdit, onDelete }) {
  const [cursor, setCursor] = useState(new Date()); // month being viewed
  const [selected, setSelected] = useState(formatDate(new Date()));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startDay = (firstOfMonth.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const gridDates = useMemo(() => {
    const arr = [];
    // previous month fillers
    for (let i = 0; i < startDay; i++) {
      const d = new Date(year, month, -(startDay - 1 - i));
      arr.push({ date: d, inMonth: false });
    }
    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push({ date: new Date(year, month, d), inMonth: true });
    }
    // next month fillers to complete 6x7 grid
    while (arr.length % 7 !== 0) {
      const last = arr[arr.length - 1].date;
      arr.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
    }
    while (arr.length < 42) {
      const last = arr[arr.length - 1].date;
      arr.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
    }
    return arr;
  }, [year, month, startDay, daysInMonth]);

  const selectedTasks = tasks.filter((t) => t.date === selected);

  const tasksByDay = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      map[t.date] = (map[t.date] || 0) + 1;
    });
    return map;
  }, [tasks]);

  return (
    <div className="p-5 max-w-md mx-auto min-h-screen bg-white pb-24">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="p-2 text-xl text-gray-700"
          aria-label="Prev month"
        >
          <FaChevronLeft />
        </button>
        <h2 className="font-semibold text-lg">
          {cursor.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="p-2 text-xl text-gray-700"
          aria-label="Next month"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Weekdays header */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {gridDates.map(({ date, inMonth }, idx) => {
          const dStr = formatDate(date);
          const isSelected = dStr === selected;
          const count = tasksByDay[dStr] || 0;
          return (
            <button
              key={dStr + "-" + idx}
              onClick={() => setSelected(dStr)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm ${
                inMonth ? "text-gray-800" : "text-gray-300"
              } ${isSelected ? "ring-2 ring-blue-600" : ""} bg-gray-50`}
            >
              <span className="font-medium">{date.getDate()}</span>
              {count > 0 && (
                <span className="text-[10px] mt-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  {count} task{count > 1 ? "s" : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date tasks */}
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {new Date(selected).toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "short",
        })}
      </h3>
      {selectedTasks.length === 0 ? (
        <p className="text-gray-400 text-sm">No tasks for this day.</p>
      ) : (
        <div className="space-y-3">
          {selectedTasks
            .sort((a, b) => Number(a.completed) - Number(b.completed))
            .map((t) => (
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
                  <div>
                    <p className={`font-medium ${t.completed ? "line-through text-gray-500" : ""}`}>
                      {t.title}
                    </p>
                    {t.time && (
                      <p className="text-xs text-gray-500">{t.time}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-lg">
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
      )}
    </div>
  );
}
