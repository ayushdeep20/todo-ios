import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Search from "./pages/Search";
import Calendar from "./pages/Calendar";
import NavBar from "./components/NavBar";

export default function App() {
  const location = useLocation();

  return (
    <div className="mx-auto max-w-sm min-h-screen bg-gray-50 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="min-h-screen"
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <NavBar />
    </div>
  );
}
