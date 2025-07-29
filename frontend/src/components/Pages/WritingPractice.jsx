import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Hangul from 'hangul-js';

const koreanKeyboard = [
    ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
    ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
    ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', '⌫'],
    ['Space', 'Enter', 'Clear', 'Close']
];

const WritingPractice = () => {
    const [practiceWords, setPracticeWords] = useState([]);
    const [userInputs, setUserInputs] = useState({});
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [numWords, setNumWords] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [started, setStarted] = useState(false);
    const [activeInputId, setActiveInputId] = useState(null);
    const inputRefs = useRef({});

    const fetchPracticeWords = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/vocab/random/${numWords}`);
            setPracticeWords(response.data.data);
            setUserInputs({});
            setStarted(true);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching practice words:', error);
            setError('Failed to load words. Please try again.');
            setLoading(false);
        }
    };

    const handleInputChange = (wordId, value) => {
        setUserInputs(prev => ({
            ...prev,
            [wordId]: value
        }));
    };

    const handleInputFocus = (wordId) => {
        setActiveInputId(wordId);
    };

    const handleKeyPress = (key) => {
        if (!activeInputId) return;

        const currentValue = userInputs[activeInputId] || '';

        if (key === '⌫') {
            const newValue = currentValue.slice(0, -1);
            handleInputChange(activeInputId, newValue);
        } else if (key === 'Space') {
            handleInputChange(activeInputId, currentValue + ' ');
        } else if (key === 'Clear') {
            handleInputChange(activeInputId, '');
        } else if (key === 'Close') {
            setShowKeyboard(false);
        } else if (key === 'Enter') {
            const inputs = Object.keys(inputRefs.current);
            const currentIndex = inputs.indexOf(activeInputId);
            if (currentIndex < inputs.length - 1) {
                const nextInputId = inputs[currentIndex + 1];
                inputRefs.current[nextInputId].focus();
                setActiveInputId(nextInputId);
            }
        } else {
            const jamoArray = Hangul.disassemble(currentValue + key);
            const composedValue = Hangul.assemble(jamoArray);
            handleInputChange(activeInputId, composedValue);
            inputRefs.current[activeInputId].focus();
        }
    };

    const handleStartPractice = (e) => {
        e.preventDefault();
        fetchPracticeWords();
    };

    const handleNewPractice = () => {
        setStarted(false);
        setNumWords(5);
        setActiveInputId(null);
        setUserInputs({});
        setShowKeyboard(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Writing Practice</h1>
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

                {!started ? (
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
                        <h2 className="text-2xl font-semibold mb-6">Start Writing Practice</h2>
                        <form onSubmit={handleStartPractice} className="space-y-6">
                            <div>
                                <label htmlFor="numWords" className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Words (1-50)
                                </label>
                                <input
                                    type="number"
                                    id="numWords"
                                    value={numWords}
                                    onChange={(e) => setNumWords(Math.min(50, Math.max(1, e.target.value)))}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    min="1"
                                    max="50"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                            >
                                Start Practice
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {practiceWords.map((word) => (
                                        <div key={word.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <div className="text-2xl font-bold w-32">{word.english}</div>
                                            <input
                                                type="text"
                                                name={word.id}
                                                value={userInputs[word.id] || ''}
                                                onChange={(e) => handleInputChange(word.id, e.target.value)}
                                                onFocus={() => handleInputFocus(word.id)}
                                                ref={(el) => (inputRefs.current[word.id] = el)}
                                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Type the Korean word"
                                            />
                                            <div className="text-gray-600 w-48">
                                                {userInputs[word.id] === word.korean ? (
                                                    <span className="text-green-600">✓ Correct</span>
                                                ) : (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleInputChange(word.id, word.korean)}
                                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        Show Answer
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center mb-8">
                            <button
                                onClick={() => setShowKeyboard(!showKeyboard)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                            >
                                {showKeyboard ? 'Hide Keyboard' : 'Show Korean Keyboard'}
                            </button>
                        </div>

                        {showKeyboard && (
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="space-y-2">
                                    {koreanKeyboard.map((row, rowIndex) => (
                                        <div key={rowIndex} className="flex justify-center space-x-2">
                                            {row.map((key) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => handleKeyPress(key)}
                                                    className={`px-4 py-3 rounded-lg ${
                                                        ['Space', 'Enter', 'Clear', 'Close'].includes(key)
                                                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {key}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <button
                                onClick={handleNewPractice}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                            >
                                Start New Practice
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WritingPractice;