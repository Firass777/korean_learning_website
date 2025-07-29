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
    const itemsPerPage = 5;

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

        const shuffled = [...vocabs].sort(() => 0.5 - Math.random());
        const selectedWords = shuffled.slice(0, num);
        setTestWords(selectedWords);
    };

    const handleAnswerChange = (id, value) => {
        setUserAnswers((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmitTest = (e) => {
        e.preventDefault();
        const results = testWords.map((word) => ({
            ...word,
            userAnswer: userAnswers[word.id] || '',
            isCorrect: (userAnswers[word.id] || '').toLowerCase().trim() === word.english.toLowerCase().trim(),
        }));
        setResults(results);
    };

    const handleReset = () => {
        setNumWords('');
        setTestWords([]);
        setUserAnswers({});
        setResults(null);
        setError(null);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(testWords.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = testWords.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const score = results ? results.filter((r) => r.isCorrect).length : 0;
    const percentage = results ? ((score / testWords.length) * 100).toFixed(0) : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
                        Korean Vocabulary Test
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Test your knowledge and track your progress in learning Korean
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {!testWords.length && !results ? (
                        <div className="p-8">
                            <div className="max-w-md mx-auto">
                                <div className="text-center mb-8">
                                    <div className="mx-auto h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        Ready to Test Your Knowledge?
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
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder={`Enter number (max ${vocabs.length})`}
                                            min="1"
                                            max={vocabs.length}
                                        />
                                    </div>
                                    {error && (
                                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                                            <p>{error}</p>
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
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
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    {results ? 'Test Results' : 'Vocabulary Test'}
                                </h2>
                            </div>

                            {results && (
                                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6">
                                    <div className="max-w-3xl mx-auto text-center">
                                        <h3 className="text-2xl font-bold mb-2">Your Score</h3>
                                        <div className="flex justify-center items-baseline mb-4">
                                            <span className="text-5xl font-extrabold">{score}</span>
                                            <span className="text-2xl font-medium">/{testWords.length}</span>
                                        </div>
                                        <div className="w-full bg-indigo-200 rounded-full h-4 mb-6">
                                            <div 
                                                className="bg-white h-4 rounded-full" 
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xl">
                                            {percentage >= 80 ? 'Excellent!' : 
                                             percentage >= 60 ? 'Good job!' : 
                                             percentage >= 40 ? 'Keep practicing!' : 
                                             'Try again!'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                <form onSubmit={handleSubmitTest}>
                                    <div className="space-y-4">
                                        {currentItems.map((word) => (
                                            <div
                                                key={word.id}
                                                className={`p-6 rounded-xl border ${
                                                    results
                                                        ? results.find((r) => r.id === word.id).isCorrect
                                                            ? 'border-green-300 bg-green-50'
                                                            : 'border-red-300 bg-red-50'
                                                        : 'border-gray-200 bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                            {word.korean}
                                                        </h3>
                                                        {results && (
                                                            <div className="space-y-2">
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
                                                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 rounded-lg font-medium ${
                                                    currentPage === 1
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                                }`}
                                            >
                                                Previous
                                            </button>
                                            {Array.from({ length: totalPages }, (_, index) => (
                                                <button
                                                    key={index + 1}
                                                    type="button"
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className={`px-4 py-2 rounded-lg font-medium ${
                                                        currentPage === index + 1
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                                    }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 rounded-lg font-medium ${
                                                    currentPage === totalPages
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                                }`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}

                                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                                        {!results ? (
                                            <>
                                                <button
                                                    type="submit"
                                                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
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
                                                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
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