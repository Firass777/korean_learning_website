import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VocabTest = () => {
    const [vocabs, setVocabs] = useState([]);
    const [testWords, setTestWords] = useState([]);
    const [numWords, setNumWords] = useState('');
    const [userAnswers, setUserAnswers] = useState({});
    const [results, setResults] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerMode, setTimerMode] = useState('countup'); // 'countup' or 'countdown'
    const [countdownDuration, setCountdownDuration] = useState(5); // minutes
    const itemsPerPage = 5;
    const maxVisiblePages = 5;

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

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                if (timerMode === 'countup') {
                    setTimer(prev => prev + 1);
                } else {
                    setTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setIsTimerRunning(false);
                            handleTimeUp();
                            return 0;
                        }
                        return prev - 1;
                    });
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerMode]);

    const handleTimeUp = () => {
        const results = testWords.map((word) => ({
            ...word,
            userAnswer: userAnswers[word.id] || '',
            isCorrect: (userAnswers[word.id] || '').toLowerCase().trim() === word.english.toLowerCase().trim(),
        }));
        setResults(results);
        setShowScoreModal(true);
    };

    const handleNumWordsSubmit = (e) => {
        e.preventDefault();
        const num = parseInt(numWords);
        if (isNaN(num) || num < 1 || num > vocabs.length) {
            setError(`Please enter a valid number between 1 and ${vocabs.length}`);
            return;
        }
        setError(null);
        setResults(null);
        setUserAnswers({});
        setCurrentPage(1);
        setTimer(timerMode === 'countup' ? 0 : countdownDuration * 60);
        setIsTimerRunning(true);

        const shuffled = [...vocabs].sort(() => 0.5 - Math.random());
        const selectedWords = shuffled.slice(0, num);
        setTestWords(selectedWords);
    };

    const handleAnswerChange = (id, value) => {
        setUserAnswers((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmitTest = (e) => {
        e.preventDefault();
        setIsTimerRunning(false);
        const results = testWords.map((word) => ({
            ...word,
            userAnswer: userAnswers[word.id] || '',
            isCorrect: (userAnswers[word.id] || '').toLowerCase().trim() === word.english.toLowerCase().trim(),
        }));
        setResults(results);
        setShowScoreModal(true);
    };

    const handleReset = () => {
        setIsTimerRunning(false);
        setTimer(0);
        setNumWords('');
        setTestWords([]);
        setUserAnswers({});
        setResults(null);
        setError(null);
        setCurrentPage(1);
        setShowScoreModal(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const totalPages = Math.ceil(testWords.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = testWords.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getVisiblePages = () => {
        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(currentPage - half, 1);
        let end = Math.min(start + maxVisiblePages - 1, totalPages);

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(end - maxVisiblePages + 1, 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const score = results ? results.filter((r) => r.isCorrect).length : 0;
    const percentage = results ? ((score / testWords.length) * 100).toFixed(0) : 0;

    const getResultMessage = () => {
        if (percentage >= 90) return "Perfect! You're a Korean language master!";
        if (percentage >= 75) return "Great job! You're doing amazing!";
        if (percentage >= 50) return "Good work! Keep practicing!";
        if (percentage >= 25) return "Keep going! You're making progress!";
        return "Don't give up! Try again and you'll improve!";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading vocabulary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {showScoreModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center text-white">
                            <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
                            <p className="text-lg opacity-90">{getResultMessage()}</p>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-center mb-6">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle
                                            className="text-gray-200"
                                            strokeWidth="8"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="40"
                                            cx="50"
                                            cy="50"
                                        />
                                        <circle
                                            className="text-indigo-600"
                                            strokeWidth="8"
                                            strokeDasharray={`${percentage}, 100`}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="40"
                                            cx="50"
                                            cy="50"
                                        />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                        <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
                                        <div className="text-sm text-gray-500">
                                            {score}/{testWords.length} correct
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4 text-center">
                                <p className="text-gray-600 font-medium">Time taken: {formatTime(timerMode === 'countup' ? timer : countdownDuration * 60 - timer)}</p>
                            </div>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setShowScoreModal(false)}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    New Test
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
                        Korean Vocabulary Test
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Challenge yourself and track your learning progress
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {!testWords.length && !results ? (
                        <div className="p-8">
                            <div className="max-w-md mx-auto">
                                <div className="text-center mb-8">
                                    <div className="mx-auto h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        Ready for Your Korean Test?
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        Select how many words you want to be tested on
                                    </p>
                                </div>
                                <form onSubmit={handleNumWordsSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="numWords" className="block text-sm font-medium text-gray-700 mb-2">
                                            Number of Words (1-{vocabs.length})
                                        </label>
                                        <input
                                            type="number"
                                            id="numWords"
                                            value={numWords}
                                            onChange={(e) => setNumWords(e.target.value)}
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                            placeholder={`Enter number (max ${vocabs.length})`}
                                            min="1"
                                            max={vocabs.length}
                                        />
                                    </div>
                                    
                                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-medium text-gray-800 mb-3">Timer Settings</h3>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            type="radio"
                                                            id="countup"
                                                            name="timerMode"
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                                            checked={timerMode === 'countup'}
                                                            onChange={() => setTimerMode('countup')}
                                                        />
                                                        <label htmlFor="countup" className="block text-sm font-medium text-gray-700">
                                                            Count-up Timer
                                                        </label>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500">Timer counts up from 00:00</p>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            type="radio"
                                                            id="countdown"
                                                            name="timerMode"
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                                            checked={timerMode === 'countdown'}
                                                            onChange={() => setTimerMode('countdown')}
                                                        />
                                                        <label htmlFor="countdown" className="block text-sm font-medium text-gray-700">
                                                            Countdown Timer
                                                        </label>
                                                    </div>
                                                    {timerMode === 'countdown' && (
                                                        <div className="mt-2">
                                                            <label htmlFor="countdownMinutes" className="block text-xs font-medium text-gray-700 mb-1">
                                                                Minutes
                                                            </label>
                                                            <input
                                                                type="number"
                                                                id="countdownMinutes"
                                                                value={countdownDuration}
                                                                onChange={(e) => setCountdownDuration(Math.max(1, Math.min(60, parseInt(e.target.value) || 5)))}
                                                                className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                                min="1"
                                                                max="60"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-shake">
                                            <p>{error}</p>
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                            Start Test
                                        </button>
                                        <Link
                                            to="/vocab"
                                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                                        >
                                            Back to List
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        {results ? 'Test Results' : 'Vocabulary Test'}
                                    </h2>
                                    <div className="flex items-center space-x-4">
                                        {results ? (
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                percentage >= 70 ? 'bg-green-100 text-green-800' :
                                                percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                Score: {score}/{testWords.length}
                                            </span>
                                        ) : (
                                            <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                                                timerMode === 'countdown' && timer <= 30 ? 'bg-red-100 animate-pulse' : 'bg-indigo-100'
                                            }`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-bold text-indigo-800">
                                                    {formatTime(timerMode === 'countup' ? timer : timer)}
                                                </span>
                                                {timerMode === 'countdown' && (
                                                    <span className="text-sm text-indigo-600">
                                                        / {formatTime(countdownDuration * 60)}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleSubmitTest}>
                                    <div className="space-y-6">
                                        {currentItems.map((word) => (
                                            <div
                                                key={word.id}
                                                className={`p-6 rounded-xl border-2 ${
                                                    results
                                                        ? results.find((r) => r.id === word.id).isCorrect
                                                            ? 'border-green-300 bg-green-50'
                                                            : 'border-red-300 bg-red-50'
                                                        : 'border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow'
                                                }`}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-3">
                                                            <span className="text-xl font-bold text-gray-900 mr-3">
                                                                {word.korean}
                                                            </span>
                                                            {results && (
                                                                results.find((r) => r.id === word.id).isCorrect ? (
                                                                    <span className="text-green-600">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                        {results && (
                                                            <div className="space-y-2 mt-4">
                                                                <p className={`text-sm font-medium ${
                                                                    results.find((r) => r.id === word.id).isCorrect
                                                                        ? 'text-green-700'
                                                                        : 'text-red-700'
                                                                }`}>
                                                                    Your answer: {results.find((r) => r.id === word.id).userAnswer || 'None'}
                                                                </p>
                                                                {!results.find((r) => r.id === word.id).isCorrect && (
                                                                    <p className="text-sm font-medium text-gray-700">
                                                                        Correct answer: {word.english}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {!results && (
                                                        <input
                                                            type="text"
                                                            value={userAnswers[word.id] || ''}
                                                            onChange={(e) => handleAnswerChange(word.id, e.target.value)}
                                                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                                            placeholder="English translation"
                                                            autoFocus={currentItems[0].id === word.id}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-8 space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handlePageChange(1)}
                                                disabled={currentPage === 1}
                                                className={`px-3 py-1 rounded-lg font-medium ${
                                                    currentPage === 1
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                                }`}
                                            >
                                                «
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-3 py-1 rounded-lg font-medium ${
                                                    currentPage === 1
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                                }`}
                                            >
                                                ‹
                                            </button>
                                            
                                            {getVisiblePages().map((page) => (
                                                <button
                                                    key={page}
                                                    type="button"
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-1 rounded-lg font-medium ${
                                                        currentPage === page
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            
                                            <button
                                                type="button"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-3 py-1 rounded-lg font-medium ${
                                                    currentPage === totalPages
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                                }`}
                                            >
                                                ›
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handlePageChange(totalPages)}
                                                disabled={currentPage === totalPages}
                                                className={`px-3 py-1 rounded-lg font-medium ${
                                                    currentPage === totalPages
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                                }`}
                                            >
                                                »
                                            </button>
                                        </div>
                                    )}

                                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                                        {!results ? (
                                            <>
                                                <button
                                                    type="submit"
                                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                                >
                                                    Submit Test
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleReset}
                                                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    Reset Test
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleReset}
                                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                                >
                                                    Take Another Test
                                                </button>
                                                <Link
                                                    to="/vocab"
                                                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                                                >
                                                    Back to Vocabulary
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VocabTest;