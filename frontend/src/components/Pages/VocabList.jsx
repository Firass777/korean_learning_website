import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VocabList = () => {
    const [vocabs, setVocabs] = useState([]);
    const [filteredVocabs, setFilteredVocabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;
    const maxVisiblePages = 5;

    useEffect(() => {
        fetchVocabs();
    }, []);

    useEffect(() => {
        // Filter vocabs based on search term
        const filtered = vocabs.filter(vocab => 
            vocab.korean.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vocab.english.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredVocabs(filtered);
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchTerm, vocabs]);

    const fetchVocabs = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/vocab');
            setVocabs(response.data.data || []);
            setFilteredVocabs(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching vocabs:', error);
            setError('Failed to load vocabulary. Please try again later.');
            setLoading(false);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVocabs = filteredVocabs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVocabs.length / itemsPerPage);

    const getVisiblePages = () => {
        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(currentPage - half, 1);
        let end = Math.min(start + maxVisiblePages - 1, totalPages);

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(end - maxVisiblePages + 1, 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Smooth scroll to top of the vocabulary list section
        const vocabListSection = document.getElementById('vocab-list-section');
        if (vocabListSection) {
            vocabListSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-6">
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Korean Vocabulary Hub</h1>
                            <p className="text-lg text-gray-600 mt-2">Master the Korean language one word at a time</p>
                        </div>
                        <Link 
                            to="/addvocab" 
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Words
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/2" id="vocab-list-section">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-800">Vocabulary List</h2>
                                        <p className="text-gray-600 mt-1">{filteredVocabs.length} words found</p>
                                    </div>
                                    <div className="w-full sm:w-64">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Search words..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {filteredVocabs.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="mx-auto h-24 w-24 text-indigo-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-4 text-xl font-medium text-gray-900">
                                        {searchTerm ? 'No matching words found' : 'Your vocabulary list is empty'}
                                    </h3>
                                    <p className="mt-2 text-gray-600">
                                        {searchTerm ? 'Try a different search term' : 'Start building your Korean vocabulary by adding your first words'}
                                    </p>
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                        Korean
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                        English
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {currentVocabs.map((vocab) => (
                                                    <tr key={vocab.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-lg font-semibold text-gray-900">{vocab.korean}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-lg text-gray-700">{vocab.english}</div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
                                                    {Math.min(indexOfLastItem, filteredVocabs.length)}
                                                </span> of <span className="font-medium">{filteredVocabs.length}</span> words
                                            </div>
                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={() => paginate(1)}
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    «
                                                </button>
                                                <button
                                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    ‹
                                                </button>
                                                {getVisiblePages().map(number => (
                                                    <button
                                                        key={number}
                                                        onClick={() => paginate(number)}
                                                        className={`px-4 py-1 rounded-md ${currentPage === number ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                                    >
                                                        {number}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    ›
                                                </button>
                                                <button
                                                    onClick={() => paginate(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    »
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="lg:w-1/2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-medium text-gray-500">Total Words</h3>
                                <p className="text-3xl font-bold text-indigo-600 mt-2">{vocabs.length}</p>
                                <p className="text-sm text-gray-500 mt-1">in your collection</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-medium text-gray-500">Daily Goal</h3>
                                <p className="text-3xl font-bold text-indigo-600 mt-2">5/10</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '50%'}}></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-800">Practice Tools</h2>
                                <p className="text-gray-600 mt-1">Reinforce your learning with these exercises</p>
                            </div>
                            <div className="p-6 grid grid-cols-1 gap-4">
                                <Link to="/flash" className="group">
                                    <div className="w-full p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 group-hover:border-indigo-300 group-hover:bg-indigo-50">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-100 p-3 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-medium text-gray-800 group-hover:text-indigo-700">Flashcards</h3>
                                                <p className="text-gray-600 group-hover:text-indigo-600">Test your memory with interactive flashcards</p>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-gray-400 group-hover:text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                                <Link to="/quiz" className="group">
                                    <div className="w-full p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 group-hover:border-indigo-300 group-hover:bg-indigo-50">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-100 p-3 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-medium text-gray-800 group-hover:text-indigo-700">Quiz Mode</h3>
                                                <p className="text-gray-600 group-hover:text-indigo-600">Take a quiz to test your knowledge</p>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-gray-400 group-hover:text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                                <Link to="/writing" className="group">
                                    <div className="w-full p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 group-hover:border-indigo-300 group-hover:bg-indigo-50">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-100 p-3 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-medium text-gray-800 group-hover:text-indigo-700">Writing Practice</h3>
                                                <p className="text-gray-600 group-hover:text-indigo-600">Practice writing Korean characters</p>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-gray-400 group-hover:text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-indigo-50 rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-indigo-100">
                                <h2 className="text-2xl font-semibold text-indigo-800">Learning Tips</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                                        <span className="text-indigo-600 font-bold">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Consistent Practice</h3>
                                        <p className="text-gray-600 mt-1">Even 10 minutes daily is better than one long session weekly.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                                        <span className="text-indigo-600 font-bold">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Use Context</h3>
                                        <p className="text-gray-600 mt-1">Learn words in sentences, not isolation, for better retention.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                                        <span className="text-indigo-600 font-bold">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Active Recall</h3>
                                        <p className="text-gray-600 mt-1">Test yourself frequently to strengthen memory pathways.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VocabList;