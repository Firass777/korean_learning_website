import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Flashcards = () => {
    const [currentWord, setCurrentWord] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vocabs, setVocabs] = useState([]);
    const [stats, setStats] = useState({ total: 0, practiced: 0 });
    const [isAnimating, setIsAnimating] = useState(false);
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
        if (isAnimating) return;
        
        if (!showTranslation) {
            // First click - show translation
            setIsAnimating(true);
            setShowTranslation(true);
            setTimeout(() => setIsAnimating(false), 200);
        } else {
            // Second click - go to next word
            setIsAnimating(true);
            setTimeout(() => {
                fetchRandomWord();
                setIsAnimating(false);
            }, 200);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
            e.preventDefault();
            handleCardClick();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showTranslation]);

    if (loading && !currentWord) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-blue-800/80 font-medium">Loading your vocabulary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-blue-900/90">Korean Flashcards</h1>
                        <p className="text-blue-800/70 mt-1">Press any key or click to continue</p>
                    </div>
                    <Link 
                        to="/vocab" 
                        className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-xs border border-white/30 text-blue-900/80 hover:bg-white transition-colors flex items-center gap-2 text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Exit
                    </Link>
                </header>

                {/* Stats */}
                <div className="flex gap-3 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-xs flex-1 border border-white/30">
                        <p className="text-xs text-blue-900/60">Total</p>
                        <p className="text-xl font-bold text-blue-700">{stats.total}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-xs flex-1 border border-white/30">
                        <p className="text-xs text-blue-900/60">Practiced</p>
                        <p className="text-xl font-bold text-emerald-600">{stats.practiced}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-xs flex-1 border border-white/30">
                        <p className="text-xs text-blue-900/60">Remaining</p>
                        <p className="text-xl font-bold text-amber-600">{stats.total - stats.practiced}</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-100/80 backdrop-blur-sm border-l-4 border-red-400 text-red-800 rounded">
                        <p>{error}</p>
                    </div>
                )}

                {vocabs.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 text-center">
                        <div className="mx-auto h-16 w-16 text-blue-300 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-blue-900/90 mb-2">No vocabulary found</h3>
                        <p className="text-blue-800/70 mb-6">Add some words to begin practicing</p>
                        <Link
                            to="/add"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            Add Words
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Flashcard */}
                        <div 
                            className={`relative h-64 md:h-80 rounded-2xl cursor-pointer transition-all duration-200 ${isAnimating ? 'scale-95' : 'scale-100'} ${
                                showTranslation 
                                    ? 'bg-gradient-to-br from-emerald-100 to-blue-100 border-2 border-blue-200/50'
                                    : 'bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-indigo-200/50'
                            }`}
                            onClick={handleCardClick}
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                                <div className={`text-center transition-opacity duration-200 ${showTranslation ? 'opacity-0' : 'opacity-100'}`}>
                                    <span className="text-sm text-blue-800/70 mb-2">Korean</span>
                                    <h2 className="text-4xl font-bold text-blue-900/90">{currentWord?.korean}</h2>
                                    <div className="mt-8 text-sm text-blue-800/60">
                                        Click or press any key to reveal
                                    </div>
                                </div>
                                
                                <div className={`text-center transition-opacity duration-200 ${showTranslation ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className="text-sm text-blue-800/70 mb-2">English</span>
                                    <h2 className="text-3xl font-medium text-blue-900/90">{currentWord?.english}</h2>
                                    <div className="mt-8 text-sm text-blue-800/60">
                                        Click or press any key to continue
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-full h-2.5 overflow-hidden">
                            <div 
                                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                                style={{ width: `${(stats.practiced / stats.total) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Quick Tips */}
                {vocabs.length > 0 && (
                    <div className="mt-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/30">
                        <h3 className="text-lg font-medium text-blue-900/90 mb-3">Quick Tips</h3>
                        <ul className="space-y-3 text-sm text-blue-900/80">
                            <li className="flex items-start gap-2">
                                <span className="bg-blue-500/10 text-blue-600 rounded-full p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span>Press <kbd className="bg-white px-2 py-1 rounded shadow-xs text-xs">Space</kbd>, <kbd className="bg-white px-2 py-1 rounded shadow-xs text-xs">Enter</kbd>, or <kbd className="bg-white px-2 py-1 rounded shadow-xs text-xs">→</kbd> to advance</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-blue-500/10 text-blue-600 rounded-full p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span>Try to recall the translation before revealing</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-blue-500/10 text-blue-600 rounded-full p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span>Practice daily for just 5-10 minutes</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Flashcards;