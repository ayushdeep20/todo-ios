import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { demoTasks } from "./data/demoTasks";


import Home from "./pages/Home";
import Search from "./pages/Search";
import Calendar from "./pages/Calendar";
import Onboarding from "./pages/Onboarding";
import NavBar from "./components/NavBar";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch {
      return [];
    }
  });

  // Seed demo tasks only on first load if empty
useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("tasks"));
  if (!saved || saved.length === 0) {
    localStorage.setItem("tasks", JSON.stringify(demoTasks));
    setTasks(demoTasks);
  }
}, []);


  const saveTasks = (next) => {
    setTasks(next);
    localStorage.setItem("tasks", JSON.stringify(next));
  };

  const addTask = (task) => {
    saveTasks([...tasks, { ...task, id: Date.now() }]);
  };

  const updateTask = (updated) => {
    saveTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
  };

  const toggleCompleted = (id) => {
    saveTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              tasks={tasks}
              onAdd={addTask}
              onUpdate={updateTask}
              onToggle={toggleCompleted}
              onDelete={deleteTask}
            />
          }
        />
        <Route
          path="/search"
          element={
            <Search
              tasks={tasks}
              onToggle={toggleCompleted}
              onEdit={updateTask}
              onDelete={deleteTask}
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <Calendar
              tasks={tasks}
              onToggle={toggleCompleted}
              onEdit={updateTask}
              onDelete={deleteTask}
            />
          }
        />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>

      <NavBar />
    </div>
  );
}
