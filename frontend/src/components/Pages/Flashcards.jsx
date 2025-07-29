import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Flashcards = () => {
    const [currentWord, setCurrentWord] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchRandomWord = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/vocab/random');
            setCurrentWord(response.data.data);
            setShowTranslation(false);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching random word:', error);
            setError('Failed to load word. Please try again.');
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Flashcards</h1>
                    <Link 
                        to="/vocab" 
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                    >
                        Exit Practice
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                <div 
                    className="bg-white rounded-2xl shadow-xl p-12 cursor-pointer h-96 flex items-center justify-center"
                    onClick={handleCardClick}
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-5xl font-bold mb-8">
                                {showTranslation ? currentWord.english : currentWord.korean}
                            </h2>
                            <p className="text-gray-500">
                                {showTranslation ? 'Click to see next word' : 'Click to reveal translation'}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center text-gray-500">
                    <p>Click the card to {showTranslation ? 'continue' : 'reveal the answer'}</p>
                </div>
            </div>
        </div>
    );
};

export default Flashcards;