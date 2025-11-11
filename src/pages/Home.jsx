import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";

/* ---------- Dates (LOCAL) ---------- */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-CA"); // YYYY-MM-DD
};
const startOfWeekMon = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
};

/* ---------- Count-up ---------- */
function useCountUp(value, duration = 600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    const start = 0;
    const end = value;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(start + (end - start) * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return count;
}

export default function Home({ tasks, onAdd, onUpdate, onToggle, onDelete }) {
  const todayStr = formatDate(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [weekStart, setWeekStart] = useState(() => startOfWeekMon(new Date()));
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  /* Week helpers */
  const getWeekDates = () =>
    [...Array(7)].map((_, idx) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + idx);
      return d;
    });

  const goWeek = (delta) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + delta * 7);
    setWeekStart(d);
    const sel = new Date(selectedDate);
    sel.setDate(sel.getDate() + delta * 7);
    setSelectedDate(formatDate(sel));
  };

  /* Derived */
  const weekDates = getWeekDates();
  const weekStartStr = formatDate(weekDates[0]);
  const weekEndStr = formatDate(weekDates[6]);

  const normalizeTaskDate = (raw) => (raw ? formatDate(new Date(raw)) : selectedDate);

  /* CRUD wrappers */
  const handleAddTask = (task) => {
    const normalized = {
      ...task,
      id: Date.now(),
      date: normalizeTaskDate(task.date),
      completed: !!task.completed,
    };
    onAdd(normalized);
    setIsAddOpen(false);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsEditOpen(true);
  };
  const handleUpdateTask = (updatedTask) => {
    const normalized = { ...updatedTask, date: normalizeTaskDate(updatedTask.date) };
    onUpdate(normalized);
    setIsEditOpen(false);
    setTaskToEdit(null);
  };

  /* Filters & Stats */
  const todaysTasks = tasks.filter((t) => t.date === selectedDate);
  const pendingTasks = todaysTasks.filter((t) => !t.completed);
  const completedTasks = todaysTasks.filter((t) => t.completed);

  const weeklyTasks = tasks.filter(
    (t) => t.date >= weekStartStr && t.date <= weekEndStr
  );
  const weeklyDone = weeklyTasks.filter((t) => t.completed).length;
  const weeklyPending = weeklyTasks.length - weeklyDone;
  const weeklyPct = weeklyTasks.length
    ? Math.round((weeklyDone / weeklyTasks.length) * 100)
    : 0;

  const animPending = useCountUp(weeklyPending);
  const animCompleted = useCountUp(weeklyDone);

  const priorityBadge = (p) =>
    p === "High"
      ? "bg-red-200 text-red-700"
      : p === "Medium"
      ? "bg-yellow-200 text-yellow-700"
      : "bg-green-200 text-green-700";

  return (
    <div className="p-5 pb-28 max-w-md mx-auto min-h-screen bg-white">
      {/* Month + arrows */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => goWeek(-1)}
          className="p-2 text-xl text-gray-700 active:scale-95"
          aria-label="Previous week"
        >
          <FaChevronLeft />
        </button>
        <h2 className="font-semibold text-lg">
          {weekStart.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <button
          onClick={() => goWeek(1)}
          className="p-2 text-xl text-gray-700 active:scale-95"
          aria-label="Next week"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Week ribbon */}
      <div className="flex justify-between gap-2 mb-4">
        {weekDates.map((d) => {
          const dStr = formatDate(d);
          const isSelected = dStr === selectedDate;
          const isToday = dStr === todayStr;
          return (
            <button
              key={dStr}
              onClick={() => setSelectedDate(dStr)}
              className={`flex flex-col items-center px-2 py-1 rounded-xl w-12 text-center transition ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : isToday
                  ? "border border-blue-600 text-blue-700"
                  : "text-gray-700"
              }`}
            >
              <span className="text-[10px]">
                {d.toLocaleString("en-US", { weekday: "short" })}
              </span>
              <span className="font-semibold">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* Weekly progress */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-1">
          {weeklyPct}% completed this week
        </p>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all"
            style={{ width: `${weeklyPct}%` }}
          />
        </div>
      </div>

      {/* Animated weekly Pending/Completed */}
      <div className="flex items-center mb-4">
        <div className="flex-1 text-center">
          <div className="text-3xl font-bold text-blue-600">{animPending}</div>
          <div className="text-sm text-gray-500">Pending (This Week)</div>
        </div>
        <div className="w-px h-10 bg-gray-300" />
        <div className="flex-1 text-center">
          <div className="text-3xl font-bold text-green-600">{animCompleted}</div>
          <div className="text-sm text-gray-500">Completed (This Week)</div>
        </div>
      </div>

      {/* Add task big button */}
      <button
        onClick={() => setIsAddOpen(true)}
        className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg flex items-center justify-center gap-2 shadow-md mb-3 active:scale-95"
      >
        <FaPlus /> Add Task
      </button>

      {/* Task list (scrollable) */}
      <div
        className="space-y-3 overflow-y-auto pr-1"
        style={{ maxHeight: "calc(100vh - 330px)" }}
      >
        {todaysTasks.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No tasks for this day.</p>
        )}

        {/* Pending first */}
        {pendingTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="w-5 h-5 accent-blue-600"
              />
              <div>
                <p className="font-medium">{task.title}</p>
                {task.time && (
                  <p className="text-xs text-gray-500">{task.time}</p>
                )}
                {task.priority && (
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${priorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <button
                className="text-blue-600"
                onClick={() => handleEditTask(task)}
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500"
                onClick={() => onDelete(task.id)}
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {/* Completed next */}
        {completedTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-xl opacity-80"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="w-5 h-5 accent-blue-600"
              />
              <div>
                <p className="font-medium line-through text-gray-500">
                  {task.title}
                </p>
                {task.time && (
                  <p className="text-xs text-gray-400">{task.time}</p>
                )}
                {task.priority && (
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${priorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                )}
              </div>
            </div>
            <button
              className="text-red-500"
              onClick={() => onDelete(task.id)}
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddTask}
        defaultDate={selectedDate}
      />
      <EditTaskModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setTaskToEdit(null);
        }}
        task={taskToEdit}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
}
