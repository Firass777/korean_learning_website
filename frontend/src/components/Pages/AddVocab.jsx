import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddVocab = () => {
    const [formData, setFormData] = useState({
        korean: '',
        english: ''
    });
    const [vocabList, setVocabList] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddToList = (e) => {
        e.preventDefault();
        if (!formData.korean || !formData.english) {
            setError('Both fields are required');
            return;
        }
        
        setVocabList([...vocabList, formData]);
        setFormData({ korean: '', english: '' });
        setError(null);
        setSuccess('Word added to list!');
        setTimeout(() => setSuccess(null), 2000);
    };

    const handleSubmitAll = async (e) => {
        e.preventDefault();
        if (vocabList.length === 0) {
            setError('Please add at least one word to submit');
            return;
        }
        
        setError(null);
        setIsSubmitting(true);
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/vocab', {
                words: vocabList
            });
            
            setVocabList([]);
            setSuccess(response.data.message || `${vocabList.length} words added successfully!`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error adding vocab:', error);
            setError(error.response?.data?.message || 'Failed to add vocabulary. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeFromList = (index) => {
        const newList = [...vocabList];
        newList.splice(index, 1);
        setVocabList(newList);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Add New Vocabulary</h1>
                    <p className="mt-2 text-gray-600">Add multiple Korean-English word pairs to your vocabulary list.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
                        <p>{success}</p>
                    </div>
                )}

                <form onSubmit={handleAddToList} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="korean" className="block text-sm font-medium text-gray-700 mb-1">
                                Korean Word
                            </label>
                            <input
                                type="text"
                                id="korean"
                                name="korean"
                                value={formData.korean}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                placeholder="Enter Korean word"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="english" className="block text-sm font-medium text-gray-700 mb-1">
                                English Translation
                            </label>
                            <input
                                type="text"
                                id="english"
                                name="english"
                                value={formData.english}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                placeholder="Enter English translation"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/vocab')}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                        >
                            Back to List
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add to List
                        </button>
                    </div>
                </form>

                {vocabList.length > 0 && (
                    <div className="mt-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Words to Add ({vocabList.length})</h2>
                            <button
                                onClick={handleSubmitAll}
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded-lg text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition duration-200 flex items-center`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Save All Words
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <ul className="divide-y divide-gray-200">
                                {vocabList.map((item, index) => (
                                    <li key={index} className="py-3 flex justify-between items-center">
                                        <div>
                                            <span className="font-medium text-gray-800">{item.korean}</span>
                                            <span className="mx-2 text-gray-400">→</span>
                                            <span className="text-gray-600">{item.english}</span>
                                        </div>
                                        <button
                                            onClick={() => removeFromList(index)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddVocab;