import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ParagraphAdd = () => {
    const [formData, setFormData] = useState({
        korean: '',
        english: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/paragraphs', formData);
            if (response.data.success) {
                setSuccess(true);
                setFormData({
                    korean: '',
                    english: ''
                });
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save paragraph');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
                        Add Korean-English Paragraph
                    </h1>
                    <p className="text-lg text-gray-600">
                        Add a new paragraph pair to the database
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="korean" className="block text-sm font-medium text-gray-700 mb-2">
                                    Korean Paragraph
                                </label>
                                <textarea
                                    id="korean"
                                    name="korean"
                                    rows="5"
                                    value={formData.korean}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                    placeholder="Enter Korean text here..."
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="english" className="block text-sm font-medium text-gray-700 mb-2">
                                    English Paragraph
                                </label>
                                <textarea
                                    id="english"
                                    name="english"
                                    rows="5"
                                    value={formData.english}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                    placeholder="Enter English translation here..."
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                                    <p>{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
                                    <p>Paragraph added successfully!</p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                                <Link
                                    to="/vocab"
                                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                                >
                                    Back to Vocabulary
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : 'Save Paragraph'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParagraphAdd;