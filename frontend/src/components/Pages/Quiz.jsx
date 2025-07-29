import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Quiz = () => {
    const [vocabs, setVocabs] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [numQuestions, setNumQuestions] = useState(5);
    const [started, setStarted] = useState(false);
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
        // Shuffle all words and take the requested number
        const shuffledWords = [...vocabs].sort(() => 0.5 - Math.random()).slice(0, numQuestions);
        
        // Create questions with options
        const questions = shuffledWords.map(word => {
            // Get 2 random incorrect answers (excluding the correct one)
            const otherWords = vocabs.filter(v => v.id !== word.id);
            const shuffledIncorrect = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 2);
            const incorrectOptions = shuffledIncorrect.map(w => w.english);
            
            // Combine with correct answer and shuffle options
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
    };

    const handleNewQuiz = () => {
        setStarted(false);
        setNumQuestions(5);
    };

    const calculateScore = () => {
        return quizQuestions.filter(question => 
            selectedAnswers[question.id] === question.correctAnswer
        ).length;
    };

    if (loading && !started) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-700">Loading vocabulary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 p-4 sm:p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm inline-block">
                            Korean Vocabulary Quiz
                        </h1>
                        <p className="text-lg text-gray-600 mt-2">Test your knowledge with multiple-choice questions</p>
                    </div>
                    <Link 
                        to="/vocab" 
                        className="px-5 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Exit Quiz
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                        <p>{error}</p>
                    </div>
                )}

                {!started ? (
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-gray-100">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Quiz Settings</h2>
                            <p className="text-gray-600 mt-2">Customize your quiz experience</p>
                        </div>
                        
                        <form onSubmit={startQuiz} className="space-y-6">
                            <div>
                                <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Questions (1-{vocabs.length})
                                </label>
                                <input
                                    type="number"
                                    id="numQuestions"
                                    value={numQuestions}
                                    onChange={(e) => setNumQuestions(parseInt(e.target.value) || 0)}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                    min="1"
                                    max={vocabs.length}
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center ${
                                    vocabs.length < 3 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700'
                                }`}
                                disabled={vocabs.length < 3}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Start Quiz
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        {submitted && (
                            <div className="mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg p-6 text-center">
                                <h3 className="text-2xl font-bold mb-2">Quiz Results</h3>
                                <div className="flex justify-center items-baseline mb-4">
                                    <span className="text-5xl font-extrabold">{calculateScore()}</span>
                                    <span className="text-2xl font-medium">/{quizQuestions.length}</span>
                                </div>
                                <div className="w-full bg-white/30 rounded-full h-2.5 mb-4">
                                    <div 
                                        className="bg-white h-2.5 rounded-full" 
                                        style={{ width: `${(calculateScore() / quizQuestions.length) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xl font-medium">
                                    {calculateScore() === quizQuestions.length ? 'Perfect! 🎉' :
                                     calculateScore() >= quizQuestions.length * 0.7 ? 'Great job! 👍' :
                                     calculateScore() >= quizQuestions.length * 0.4 ? 'Keep practicing! 💪' :
                                     'Review your vocabulary! 📚'}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {quizQuestions.map((question) => (
                                <div key={question.id} className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                                    submitted 
                                        ? selectedAnswers[question.id] === question.correctAnswer
                                            ? 'border-green-300'
                                            : 'border-red-300'
                                        : 'border-gray-200'
                                }`}>
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                            <span className="bg-indigo-100 text-indigo-800 text-lg font-semibold mr-3 px-3 py-1 rounded-full">
                                                {question.korean}
                                            </span>
                                        </h3>
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
                                                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                                </div>
                            ))}

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                {!submitted ? (
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Submit Quiz
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleNewQuiz}
                                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg>
                                        New Quiz
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Quiz;