import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const API_BASE = "https://todo-api-production-9d6b.up.railway.app"; // your live API

// ---------- date helpers ----------
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
};
const endOfWeek = (date) => {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
};
const sameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// ---------- component ----------
export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [weekAnchor, setWeekAnchor] = useState(startOfWeek(new Date()));
  const [selectedDay, setSelectedDay] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "12:00",
    priority: "Low",
    status: "In Progress",
  });

  // ---------- API helpers ----------
  const fetchJSON = async (url, options) => {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`);
    }
    return res.json();
  };

  // load tasks from API
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchJSON(`${API_BASE}/tasks`);
        setTasks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        alert("Failed to load tasks from server.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // computed week and filters
  const weekDays = useMemo(() => {
    const s = startOfWeek(weekAnchor);
    return [...Array(7)].map((_, i) => {
      const d = new Date(s);
      d.setDate(s.getDate() + i);
      return d;
    });
  }, [weekAnchor]);

  const tasksThisWeek = tasks.filter((t) => {
    const date = new Date(t.date);
    return date >= startOfWeek(weekAnchor) && date <= endOfWeek(weekAnchor);
  });

  const tasksForDisplay = selectedDay
    ? tasksThisWeek.filter((t) => sameDay(new Date(t.date), selectedDay))
    : tasksThisWeek;

  const completed = tasksThisWeek.filter((t) => t.status === "Completed").length;

  // week navigation
  const changeWeekBy = (delta) => {
    const next = new Date(weekAnchor);
    next.setDate(next.getDate() + delta * 7);
    setWeekAnchor(startOfWeek(next));
    setSelectedDay(null);
  };

  // modal handlers
  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setNewTask({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      time: "12:00",
      priority: "Low",
      status: "In Progress",
    });
    setShowForm(true);
  };

  const openEditModal = (task) => {
    setIsEditing(true);
    setEditId(task._id);
    setNewTask({
      title: task.title || "",
      description: task.description || "",
      date: task.date || new Date().toISOString().split("T")[0],
      time: task.time || "12:00",
      priority: task.priority || "Low",
      status: task.status || "In Progress",
    });
    setShowForm(true);
  };

  const saveTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      if (isEditing && editId) {
        const updated = await fetchJSON(`${API_BASE}/tasks/${editId}`, {
          method: "PUT",
          body: JSON.stringify(newTask),
        });
        setTasks((prev) =>
          prev.map((t) => (t._id === editId ? { ...updated } : t))
        );
      } else {
        const created = await fetchJSON(`${API_BASE}/tasks`, {
          method: "POST",
          body: JSON.stringify(newTask),
        });
        setTasks((prev) => [created, ...prev]);
      }
      setShowForm(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save task.");
    }
  };

  const toggleStatus = async (task) => {
    try {
      const nextStatus = task.status === "Completed" ? "In Progress" : "Completed";
      // optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
      );
      await fetchJSON(`${API_BASE}/tasks/${task._id}`, {
        method: "PUT",
        body: JSON.stringify({ ...task, status: nextStatus }),
      });
    } catch (e) {
      console.error(e);
      alert("Failed to toggle status. Reverting.");
      // revert by refetching quickly
      try {
        const fresh = await fetchJSON(`${API_BASE}/tasks`);
        setTasks(Array.isArray(fresh) ? fresh : []);
      } catch {}
    }
  };

  const deleteTask = async (task) => {
    try {
      // optimistic remove
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      await fetchJSON(`${API_BASE}/tasks/${task._id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
      alert("Failed to delete task. Reverting.");
      try {
        const fresh = await fetchJSON(`${API_BASE}/tasks`);
        setTasks(Array.isArray(fresh) ? fresh : []);
      } catch {}
    }
  };

  return (
    <main className="mx-auto max-w-sm min-h-screen bg-white text-gray-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur px-4 py-3 border-b flex justify-between">
        <button onClick={() => changeWeekBy(-1)} className="px-3 py-1 bg-gray-100 rounded-lg">←</button>
        <h1 className="text-lg font-semibold">Tasks</h1>
        <button onClick={() => changeWeekBy(1)} className="px-3 py-1 bg-gray-100 rounded-lg">→</button>
      </div>

      {/* Month label */}
      <p className="text-center text-sm text-gray-500 mt-4">
        {weekAnchor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>

      {/* Clickable Week Ribbon with 'today' marker */}
      <div className="flex justify-between px-4 mt-3">
        {weekDays.map((d, i) => {
          const isToday = sameDay(d, new Date());
          const isSelected = selectedDay && sameDay(d, selectedDay);
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(d)}
              className="flex flex-col items-center text-sm"
              title={isToday ? "Today" : undefined}
            >
              <span className="leading-none">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span
                className={`mt-1 w-8 h-8 flex items-center justify-center rounded-full transition ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : isToday
                    ? "bg-white text-blue-600 ring-2 ring-blue-500"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {d.getDate()}
              </span>
              {!isSelected && isToday && (
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="px-4 mt-6 flex gap-3">
        <div className="flex-1 bg-blue-100 p-3 rounded-xl">
          <p className="text-xs">Completed</p>
          <p className="text-xl font-bold">{completed}</p>
        </div>
        <div className="flex-1 bg-red-100 p-3 rounded-xl">
          <p className="text-xs">Pending</p>
          <p className="text-xl font-bold">{tasksThisWeek.length - completed}</p>
        </div>
      </div>

      {/* Weekly progress */}
      <div className="px-4 mt-4">
        <p className="text-sm text-gray-500 mb-1">
          {tasksThisWeek.length ? Math.round((completed / tasksThisWeek.length) * 100) : 0}% Completed this week
        </p>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{
              width: tasksThisWeek.length
                ? `${(completed / tasksThisWeek.length) * 100}%`
                : "0%",
            }}
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="px-4 mt-8 text-sm text-gray-500">Loading tasks… try not to blink.</div>
      )}

      {/* Task List */}
      <div className="px-4 mt-6 space-y-3">
        {!loading && tasksForDisplay.map((t, i) => (
          <div key={t._id || i} className="relative overflow-hidden" onClick={() => openEditModal(t)}>
            <motion.div
              drag="x"
              dragConstraints={{ left: -80, right: 0 }}
              onDragEnd={(e, info) => {
                const btn = document.getElementById(`delete-${t._id || i}`);
                if (btn) btn.style.transform = info.offset.x < -60 ? "translateX(0)" : "translateX(100%)";
              }}
              className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border"
            >
              <div>
                <p className={`font-medium ${t.status === "Completed" ? "line-through text-gray-400" : ""}`}>
                  {t.title}
                </p>
                <p className="text-xs text-gray-500">{t.date} • {t.time}</p>
                <span
                  className={`inline-block px-2 py-0.5 mt-1 rounded-full text-[10px] font-semibold ${
                    t.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : t.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {t.priority}
                </span>
              </div>

              {/* Checkbox with click isolation */}
              <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                <input
                  type="checkbox"
                  checked={t.status === "Completed"}
                  onChange={() => toggleStatus(t)}
                  className="w-4 h-4"
                />
              </div>
            </motion.div>

            <button
              id={`delete-${t._id || i}`}
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(t);
              }}
              className="absolute right-0 top-0 h-full w-20 bg-red-600 text-white rounded-xl flex items-center justify-center transition-all"
              style={{ transform: "translateX(100%)" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Task Button */}
      <button
        onClick={openAddModal}
        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-blue-600 text-white w-12 h-12 rounded-full text-2xl shadow-md flex items-center justify-center active:scale-95"
      >
        ✚
      </button>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm px-5">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl relative"
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-black transition text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-center mb-6">
              {isEditing ? "Edit Task" : "New Task"}
            </h2>

            <div className="space-y-4">
              <input
                className="w-full p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />

              <textarea
                className="w-full p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Description"
                rows="3"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />

              <input
                type="date"
                className="w-full p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              />

              <input
                type="time"
                className="w-full p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                value={newTask.time}
                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
              />

              <select
                className="w-full p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>

              <button
                onClick={saveTask}
                className="w-full bg-blue-600 text-white py-3 rounded-xl active:scale-95 transition"
              >
                {isEditing ? "Save Changes" : "Add Task"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
