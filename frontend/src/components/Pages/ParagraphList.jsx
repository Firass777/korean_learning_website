import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ParagraphList = () => {
    const [paragraphs, setParagraphs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [jumpId, setJumpId] = useState('');
    const [showJumpForm, setShowJumpForm] = useState(false);

    useEffect(() => {
        const fetchParagraphs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/paragraphs');
                setParagraphs(response.data.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching paragraphs:", err);
                setLoading(false);
            }
        };

        fetchParagraphs();
    }, []);

    useEffect(() => {
        setProgress(((currentIndex + 1) / paragraphs.length) * 100);
    }, [currentIndex, paragraphs]);

    const handlePrevious = () => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : paragraphs.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev < paragraphs.length - 1 ? prev + 1 : 0));
    };

    const handleJumpToId = (e) => {
        e.preventDefault();
        const id = parseInt(jumpId);
        if (isNaN(id)) return;

        const foundIndex = paragraphs.findIndex(p => p.id === id);
        if (foundIndex !== -1) {
            setCurrentIndex(foundIndex);
        }
        setJumpId('');
        setShowJumpForm(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="h-16 w-16 mx-auto rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-blue-400"
                    />
                    <motion.p 
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                        className="text-lg font-medium text-indigo-800"
                    >
                        Loading your Korean journey...
                    </motion.p>
                </div>
            </div>
        );
    }

    if (paragraphs.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Start Learning</h2>
                    <p className="text-gray-600 mb-8">Add your first Korean-English paragraph to begin your language journey</p>
                    <Link
                        to="/paraadd"
                        className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create First Paragraph
                    </Link>
                </div>
            </div>
        );
    }

    const currentParagraph = paragraphs[currentIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-3"
                    >
                        Korean Reader
                    </motion.h1>
                    <p className="text-indigo-700/80">Read, learn, and master Korean</p>
                </div>

                {/* Jump section */}
                <div className="flex justify-end mb-4 relative">
                    {showJumpForm ? (
                        <motion.form 
                            onSubmit={handleJumpToId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center bg-white p-2 rounded-lg shadow"
                        >
                            <input
                                type="number"
                                value={jumpId}
                                onChange={(e) => setJumpId(e.target.value)}
                                placeholder="Enter number"
                                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button 
                                type="submit"
                                className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Jump
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowJumpForm(false)}
                                className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </motion.form>
                    ) : (
                        <button
                            onClick={() => setShowJumpForm(true)}
                            className="flex items-center px-3 py-1 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Jump 
                        </button>
                    )}
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-white rounded-full mb-8 overflow-hidden shadow-inner">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6 }}
                    />
                </div>

                {/* Side-by-side cards */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    key={currentIndex}
                >
                    {/* Korean Card (Left) */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                                        🇰🇷 Korean
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {currentIndex + 1}/{paragraphs.length}
                                </span>
                            </div>
                            <div className="flex-grow flex items-center justify-center overflow-y-auto">
                                <p className="text-2xl text-gray-800 text-center leading-relaxed whitespace-pre-line">
                                    {currentParagraph.korean}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* English Card (Right) */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl overflow-hidden h-full group relative">
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-indigo-800 text-sm font-medium shadow-sm">
                                    🇬🇧 English
                                </span>
                                <span className="text-sm text-gray-500">
                                    {currentIndex + 1}/{paragraphs.length}
                                </span>
                            </div>
                            <div className="flex-grow flex items-center justify-center overflow-y-auto">
                                <p className="text-xl text-gray-700 text-center leading-relaxed whitespace-pre-line transition-all duration-300 filter blur-sm group-hover:blur-none">
                                    {currentParagraph.english}
                                </p>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
                                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm max-w-xs mx-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <p className="text-sm text-indigo-600">Hover to reveal translation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Controls */}
                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        className="flex items-center px-5 py-2.5 bg-white rounded-xl shadow hover:bg-indigo-50 transition-colors text-indigo-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Previous
                    </button>

                    <div className="text-center">
                        <Link
                            to="/paraadd"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-md transition-all font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Paragraph
                        </Link>
                    </div>

                    <button
                        onClick={handleNext}
                        className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow hover:bg-indigo-600 transition-colors"
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParagraphList;