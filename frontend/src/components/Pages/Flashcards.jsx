import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Flashcards = () => {
    const [currentWord, setCurrentWord] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vocabs, setVocabs] = useState([]);
    const [stats, setStats] = useState({ total: 0, practiced: -1 });
    const navigate = useNavigate();

    const fetchRandomWord = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/vocab');
            setVocabs(response.data.data || []);
            if (response.data.data.length > 0) {
                const randomWord = response.data.data[Math.floor(Math.random() * response.data.data.length)];
                setCurrentWord(randomWord);
                setStats(prev => ({
                    total: response.data.data.length,
                    practiced: prev.practiced + 1
                }));
            }
            setShowTranslation(false);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching words:', error);
            setError('Failed to load words. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomWord();
    }, []);

    const handleCardClick = () => {
        if (showTranslation) {
            fetchRandomWord();
        } else {
            setShowTranslation(true);
        }
    };

    if (loading && !currentWord) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-700">Loading flashcards...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm inline-block">
                            Korean Flashcards
                        </h1>
                        <p className="text-lg text-gray-600 mt-2">Practice your vocabulary with interactive flashcards</p>
                    </div>
                    <Link 
                        to="/vocab" 
                        className="px-5 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Exit Practice
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                        <p>{error}</p>
                    </div>
                )}

                {vocabs.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="mx-auto h-24 w-24 text-indigo-100 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No vocabulary found</h3>
                        <p className="text-gray-600 mb-6">Please add some words to your vocabulary list first</p>
                        <Link
                            to="/add"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Add Words
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-medium text-gray-500">Words in Collection</h3>
                                <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.total}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-medium text-gray-500">Practiced Today</h3>
                                <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.practiced}</p>
                            </div>
                        </div>

                        <div 
                            className={`rounded-2xl shadow-xl p-12 cursor-pointer h-96 flex items-center justify-center transition-colors duration-300 ${
                                showTranslation 
                                    ? 'bg-gradient-to-br from-red-300 to-blue-100 border-2 border-blue-200'
                                    : 'bg-gradient-to-br from-green-300 to-indigo-100 border-2 border-indigo-200'
                            }`}
                            onClick={handleCardClick}
                        >
                            <div className="text-center">
                                <h2 className={`text-5xl font-bold mb-6 ${
                                    showTranslation ? 'text-blue-800' : 'text-indigo-800'
                                }`}>
                                    {showTranslation ? currentWord.english : currentWord.korean}
                                </h2>
                                <p className={`text-lg ${
                                    showTranslation ? 'text-blue-600' : 'text-indigo-600'
                                }`}>
                                    {showTranslation ? 'English Translation' : 'Korean Word'}
                                </p>
                                <p className="text-gray-500 mt-4">
                                    {showTranslation ? 'Click for next word' : 'Click to reveal translation'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Flashcard Tips</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Say the translation out loud before revealing</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Review difficult words more frequently</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Practice daily for best results</span>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Flashcards;