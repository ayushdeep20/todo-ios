import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const hasTasks = (date) =>
    tasks.some(t => format(new Date(t.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));

  const tasksOnSelectedDate = selectedDate
    ? tasks.filter(
        (t) => format(new Date(t.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  return (
    <div className="mx-auto max-w-sm min-h-screen bg-white pb-24 px-4 pt-6">

      {/* Month Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="px-2 py-1 bg-gray-100 rounded-lg">←</button>
        <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="px-2 py-1 bg-gray-100 rounded-lg">→</button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 text-center mt-1">
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDate(day)}
            className={`py-3 relative rounded-lg transition ${
              selectedDate && format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                ? "bg-blue-100"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="text-gray-700">{format(day, "d")}</span>

            {hasTasks(day) && (
              <span className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Tasks on {format(selectedDate, "MMM d, yyyy")}
          </h3>

          {tasksOnSelectedDate.length === 0 && (
            <p className="text-gray-400 text-sm">No tasks for this date.</p>
          )}

          <div className="space-y-3">
            {tasksOnSelectedDate.map((t, i) => (
              <div key={i} className="p-3 border rounded-lg bg-gray-50">
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-gray-500">{t.description}</div>
                <div
                  className={`text-xs mt-1 ${
                    t.status === "Completed" ? "text-green-600" : "text-blue-600"
                  }`}
                >
                  {t.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
