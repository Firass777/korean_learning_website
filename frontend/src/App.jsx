import { Link, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

import VocabList from "./components/Pages/VocabList";
import AddVocab from "./components/Pages/AddVocab";
import VocabTest from "./components/Pages/VocabTest";

import Quiz from "./components/Pages/Quiz";
import Flashcards from "./components/Pages/Flashcards";
import WritingPractice from "./components/Pages/WritingPractice";

function App() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4 fixed top-0 w-full z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">한</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Learn Korean</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-900 font-medium hover:text-red-500 transition">Home</Link>
            <Link to="/vocab" className="text-gray-600 hover:text-red-500 transition">Vocabulary</Link>
            <Link to="/grammar" className="text-gray-600 hover:text-red-500 transition">Grammar</Link>
            <Link to="/test" className="text-gray-600 hover:text-red-500 transition">Tests</Link>
            <Link to="/login" className="text-gray-600 hover:text-red-500 transition">Login</Link>
            <Link to="/register" className="text-gray-600 hover:text-red-500 transition">Register</Link>
          </div>
          <button className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vocab" element={<VocabList />} />
          <Route path="/addvocab" element={<AddVocab />} />
          <Route path="/test" element={<VocabTest />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/writing" element={<WritingPractice />} />
          <Route path="/flash" element={<Flashcards />} />
        </Routes>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white text-center py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; 2025 Learn Korean. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;