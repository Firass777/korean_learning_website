import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Quiz = () => {
    const [vocabs, setVocabs] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [numQuestions, setNumQuestions] = useState(5);
    const [started, setStarted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVocabs = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8000/api/vocab');
                setVocabs(response.data.data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching vocabs:', error);
                setError('Failed to load vocabulary. Please try again later.');
                setLoading(false);
            }
        };
        fetchVocabs();
    }, []);

    const generateQuizQuestions = () => {
        const shuffledWords = [...vocabs].sort(() => 0.5 - Math.random()).slice(0, numQuestions);
        
        const questions = shuffledWords.map(word => {
            const otherWords = vocabs.filter(v => v.id !== word.id);
            const shuffledIncorrect = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 2);
            const incorrectOptions = shuffledIncorrect.map(w => w.english);
            
            const options = [word.english, ...incorrectOptions]
                .sort(() => 0.5 - Math.random())
                .map((text, index) => ({ id: index, text }));
            
            return {
                id: word.id,
                korean: word.korean,
                correctAnswer: word.english,
                options
            };
        });
        
        return questions;
    };

    const startQuiz = (e) => {
        e.preventDefault();
        if (numQuestions < 1 || numQuestions > vocabs.length) {
            setError(`Please enter a number between 1 and ${vocabs.length}`);
            return;
        }
        
        if (vocabs.length < 3) {
            setError('You need at least 3 words in your vocabulary to create a quiz');
            return;
        }
        
        setQuizQuestions(generateQuizQuestions());
        setSelectedAnswers({});
        setSubmitted(false);
        setStarted(true);
        setError(null);
    };

    const handleAnswerSelect = (questionId, answer) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setShowResults(true);
    };

    const handleNewQuiz = () => {
        setShowResults(false);
        setTimeout(() => {
            setStarted(false);
            setNumQuestions(5);
        }, 300);
    };

    const calculateScore = () => {
        return quizQuestions.filter(question => 
            selectedAnswers[question.id] === question.correctAnswer
        ).length;
    };

    const getResultEmoji = () => {
        const score = calculateScore();
        const percentage = score / quizQuestions.length;
        
        if (percentage === 1) return '🏆';
        if (percentage >= 0.8) return '✨';
        if (percentage >= 0.5) return '👍';
        return '💪';
    };

    const getResultColor = () => {
        const score = calculateScore();
        const percentage = score / quizQuestions.length;
        
        if (percentage === 1) return 'from-emerald-500 to-teal-500';
        if (percentage >= 0.8) return 'from-blue-500 to-indigo-500';
        if (percentage >= 0.5) return 'from-amber-500 to-orange-500';
        return 'from-rose-500 to-pink-500';
    };

    if (loading && !started) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="h-16 w-16 mx-auto rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-blue-400"
                    />
                    <motion.p 
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                        className="text-lg font-medium text-indigo-800 mt-4"
                    >
                        Loading your vocabulary...
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                            Korean Quiz Challenge
                        </h1>
                        <p className="text-lg text-indigo-700/80">Test your knowledge with interactive questions</p>
                    </div>
                    <Link 
                        to="/vocab" 
                        className="px-5 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Vocabulary
                    </Link>
                </motion.div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm"
                    >
                        <p>{error}</p>
                    </motion.div>
                )}

                {!started ? (
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-gray-100"
                    >
                        <div className="text-center mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Quiz Setup</h2>
                            <p className="text-gray-600 mt-2">Customize your learning experience</p>
                        </div>
                        
                        <form onSubmit={startQuiz} className="space-y-6">
                            <div>
                                <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Questions
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="numQuestions"
                                        value={numQuestions}
                                        onChange={(e) => setNumQuestions(parseInt(e.target.value) || 0)}
                                        className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                        min="1"
                                        max={vocabs.length}
                                    />
                                    <div className="absolute right-3 top-3 text-gray-400">
                                        / {vocabs.length}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`w-full px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center ${
                                    vocabs.length < 3 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                                }`}
                                disabled={vocabs.length < 3}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Start Challenge
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {quizQuestions.map((question, index) => (
                                <motion.div 
                                    key={question.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border-2 ${
                                        submitted 
                                            ? selectedAnswers[question.id] === question.correctAnswer
                                                ? 'border-green-300'
                                                : 'border-red-300'
                                            : 'border-transparent'
                                    }`}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold mr-3 px-3 py-1 rounded-full">
                                                    {index + 1}
                                                </span>
                                                {question.korean}
                                            </h3>
                                            {submitted && selectedAnswers[question.id] === question.correctAnswer && (
                                                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Correct
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            {question.options.map((option) => (
                                                <div key={option.id} className="flex items-start">
                                                    <input
                                                        type="radio"
                                                        id={`${question.id}-${option.id}`}
                                                        name={`question-${question.id}`}
                                                        checked={selectedAnswers[question.id] === option.text}
                                                        onChange={() => handleAnswerSelect(question.id, option.text)}
                                                        disabled={submitted}
                                                        className="mt-1.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <label 
                                                        htmlFor={`${question.id}-${option.id}`}
                                                        className={`ml-3 block text-lg cursor-pointer ${
                                                            submitted 
                                                                ? option.text === question.correctAnswer
                                                                    ? 'text-green-600 font-semibold'
                                                                    : selectedAnswers[question.id] === option.text
                                                                        ? 'text-red-600'
                                                                        : 'text-gray-500'
                                                                : 'text-gray-700 hover:text-indigo-700'
                                                        }`}
                                                    >
                                                        {option.text}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {submitted && selectedAnswers[question.id] !== question.correctAnswer && (
                                        <div className="bg-red-50 px-6 py-3 border-t border-red-100">
                                            <p className="text-sm text-red-600">
                                                <span className="font-medium">Correct answer:</span> {question.correctAnswer}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                {!submitted ? (
                                    <button
                                        type="submit"
                                        className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-lg font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Submit Answers
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleNewQuiz}
                                        className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-lg font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg>
                                        Try Again
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                )}
            </div>

            {/* Results Modal */}
            <AnimatePresence>
                {showResults && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className={`bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md border-8 border-white/20 relative`}
                        >
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-indigo-100/30"></div>
                            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-purple-100/30"></div>
                            
                            {/* Main content */}
                            <div className="relative z-10">
                                <div className={`bg-gradient-to-r ${getResultColor()} p-6 text-center`}>
                                    <div className="text-6xl mb-3">{getResultEmoji()}</div>
                                    <h2 className="text-3xl font-bold text-white">Quiz Results</h2>
                                </div>
                                
                                {/* Score  */}
                                <div className="p-6 text-center">
                                    <div className="flex justify-center items-baseline mb-4">
                                        <span className="text-6xl font-extrabold text-gray-800">{calculateScore()}</span>
                                        <span className="text-3xl font-medium text-gray-500 ml-2">/ {quizQuestions.length}</span>
                                    </div>
                                    
                                    {/* Circular progress */}
                                    <div className="relative w-48 h-48 mx-auto mb-6">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            {/* Background circle */}
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="#e5e7eb"
                                                strokeWidth="8"
                                            />
                                            {/* Progress circle */}
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="url(#progressGradient)"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${(calculateScore() / quizQuestions.length) * 283} 283`}
                                                transform="rotate(-90 50 50)"
                                            />
                                            <defs>
                                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#4f46e5" />
                                                    <stop offset="100%" stopColor="#7c3aed" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-4xl font-bold">
                                                {Math.round((calculateScore() / quizQuestions.length) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Feedback message */}
                                    <p className="text-xl font-medium text-gray-700 mb-6">
                                        {calculateScore() === quizQuestions.length ? 'Perfect! You aced it!' :
                                         calculateScore() >= quizQuestions.length * 0.8 ? 'Excellent work! Almost perfect!' :
                                         calculateScore() >= quizQuestions.length * 0.5 ? 'Good job! Keep practicing!' :
                                         'Nice try! Review and try again!'}
                                    </p>
                                    
                                    {/* button */}
                                    <button
                                        onClick={handleNewQuiz}
                                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto text-lg font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg>
                                        New Quiz
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Quiz;