import { useState, useEffect } from "react";

const toLocalYYYYMMDD = (d) => new Date(d).toLocaleDateString("en-CA");

export default function EditTaskModal({ isOpen, onClose, task, onUpdate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(toLocalYYYYMMDD(new Date()));
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || "");
      setDate(task.date || toLocalYYYYMMDD(new Date()));
      setTime(task.time || "");
      setPriority(task.priority || "Medium");
      setCompleted(!!task.completed);
      setNotes(task.notes || "");
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-md rounded-2xl p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-3">Edit Task</h3>

        <div className="space-y-3">
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="w-full border rounded-xl px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time"
              className="w-full border rounded-xl px-3 py-2"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              className="w-full border rounded-xl px-3 py-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
              Completed
            </label>
          </div>

          <textarea
            className="w-full border rounded-xl px-3 py-2"
            rows={3}
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!title.trim()) return;
                onUpdate({
                  ...task,
                  title: title.trim(),
                  date,
                  time,
                  priority,
                  completed,
                  notes,
                });
              }}
              className="flex-1 py-2 rounded-xl bg-blue-600 text-white"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
