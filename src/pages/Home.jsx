import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

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

export default function Home() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch {
      return [];
    }
  });

  const [weekAnchor, setWeekAnchor] = useState(startOfWeek(new Date()));
  const [selectedDay, setSelectedDay] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    priority: "Low",
    status: "In Progress",
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

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
  const pending = tasksThisWeek.length - completed;

  const changeWeekBy = (delta) => {
    const next = new Date(weekAnchor);
    next.setDate(next.getDate() + delta * 7);
    setWeekAnchor(startOfWeek(next));
    setSelectedDay(null);
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks([...tasks, newTask]);
    setShowForm(false);
    setNewTask({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      priority: "Low",
      status: "In Progress",
    });
  };

  const toggleStatus = (index) => {
    const updated = [...tasks];
    updated[index].status =
      updated[index].status === "Completed" ? "In Progress" : "Completed";
    setTasks(updated);
  };

  const deleteTask = (task) => {
    setTasks(tasks.filter((t) => t !== task));
  };

  return (
    <main className="mx-auto max-w-sm min-h-screen bg-white text-gray-900 pb-24">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <button onClick={() => changeWeekBy(-1)} className="px-3 py-1 rounded-lg bg-gray-100">←</button>
        <h1 className="text-lg font-semibold">Tasks</h1>
        <button onClick={() => changeWeekBy(1)} className="px-3 py-1 rounded-lg bg-gray-100">→</button>
      </div>

      {/* Clickable Week Ribbon */}
      {/* Clickable Week Ribbon (with 'today' marker) */}
<p className="text-center font-medium text-gray-700
 mt-4">
  {weekAnchor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
</p>

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
          className={
            // selected day wins; otherwise show a ring for "today"; otherwise default
            `mt-1 w-8 h-8 flex items-center justify-center rounded-full transition 
             ${isSelected
               ? "bg-blue-600 text-white"
               : isToday
               ? "bg-white text-blue-600 ring-2 ring-blue-500"
               : "bg-gray-200 text-gray-900"}`
          }
        >
          {d.getDate()}
        </span>

        {/* tiny dot under today when not selected (nice subtle cue) */}
        {!isSelected && isToday && (
          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
        )}
      </button>
    );
  })}
</div>


      {/* Weekly Stats */}
      <div className="px-4 mt-6 flex gap-3">
        <div className="flex-1 bg-blue-100 p-3 rounded-xl">
          <p className="text-xs">Completed</p>
          <p className="text-xl font-bold">{completed}</p>
        </div>
        <div className="flex-1 bg-red-100 p-3 rounded-xl">
          <p className="text-xs">Pending</p>
          <p className="text-xl font-bold">{pending}</p>
        </div>
      </div>

      {/* Progress Bar */}
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

      {/* Task List */}
      <div className="px-4 mt-6 space-y-3">
        {tasksForDisplay.map((t, i) => (
          <div key={i} className="relative overflow-hidden">

            <motion.div
              drag="x"
              dragConstraints={{ left: -80, right: 0 }}
              onDragEnd={(e, info) => {
                const btn = document.getElementById(`delete-${i}`);
                btn.style.transform = info.offset.x < -60 ? "translateX(0)" : "translateX(100%)";
              }}
              className={`flex justify-between items-center p-3 rounded-xl border ${
                t.priority === "High" ? "border-red-300" : "border-gray-200"
              } bg-gray-50 transition`}
            >
              <div>
                <p className={`font-medium ${t.status === "Completed" ? "line-through text-gray-400" : ""}`}>
                  {t.title}
                </p>
                <p className="text-xs text-gray-500">{t.description}</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${
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

              <input
                type="checkbox"
                checked={t.status === "Completed"}
                onChange={() => toggleStatus(tasks.indexOf(t))}
              />
            </motion.div>

            <button
              id={`delete-${i}`}
              onClick={() => deleteTask(t)}
              className="absolute right-0 top-0 h-full w-20 bg-red-600 text-white font-medium rounded-xl flex items-center justify-center transition-all"
              style={{ transform: "translateX(100%)" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-blue-600 text-white w-12 h-12 rounded-full text-2xl shadow-md active:scale-95 transition flex items-center justify-center"
      >
        ✚
      </button>

      {/* Modal */}
      {showForm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm px-5">
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative"
    >
      {/* Close button */}
      <button
        onClick={() => setShowForm(false)}
        className="absolute right-4 top-4 text-gray-400 hover:text-black transition text-lg"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold text-center mb-6">New Task</h2>

      <div className="space-y-4">

        <input
          className="w-full p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />

        <textarea
          className="w-full p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Description"
          rows="3"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />

        <select
          className="w-full p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <input
          type="date"
          className="w-full p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={newTask.date}
          onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
        />

        <button
          onClick={addTask}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-base font-medium active:scale-95 transition shadow-md"
        >
          Add Task
        </button>
      </div>
    </motion.div>
  </div>
)}

    </main>
  );
}
