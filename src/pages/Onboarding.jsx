import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Onboarding() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-sm min-h-screen bg-white flex flex-col items-center justify-center text-center px-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-6xl mb-6"
      >
        📝
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="text-2xl font-semibold mb-3"
      >
        Welcome to Your Task App
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.3 }}
        className="text-gray-500 mb-8"
      >
        Organize your day, plan your goals, and stay on track — all in one clean interface.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Link
          to="/home"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md active:scale-95 transition"
        >
          Get Started
        </Link>
      </motion.div>
    </motion.div>
  );
}
