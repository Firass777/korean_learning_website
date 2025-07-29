import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Speak Korean <span className="text-red-500">Confidently</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-10">
                            Join thousands of learners mastering Korean with our immersive, effective learning system.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link 
                                to="/signup" 
                                className="px-8 py-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition shadow-lg hover:shadow-xl"
                            >
                                Start Learning Free
                            </Link>
                            <Link 
                                to="/demo" 
                                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl border border-gray-200"
                            >
                                Take a Demo
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10">
                    <div className="text-9xl font-bold text-gray-300 select-none">한국어</div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Why Learn With Us?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our proven method combines technology with language learning expertise.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Learning</h3>
                            <p className="text-gray-600">
                                Our AI adapts to your level and learning style, optimizing your study time.
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Daily Practice</h3>
                            <p className="text-gray-600">
                                Bite-sized daily lessons that fit your schedule and keep you progressing.
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Real Culture</h3>
                            <p className="text-gray-600">
                                Learn through K-dramas, K-pop, and real-life situations for authentic language use.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Path */}
            <section className="py-20 bg-gradient-to-r from-red-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center">
                        <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                Your Personalized <span className="text-red-500">Learning Path</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Whether you're preparing for TOPIK, traveling to Korea, or just love the language, we've got you covered with tailored learning tracks.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-gray-800 font-medium">Beginner to advanced curriculum</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-gray-800 font-medium">Pronunciation practice with voice recognition</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-gray-800 font-medium">Progress tracking and certification</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <img 
                                    src="https://img.freepik.com/premium-vector/line-art-flag-language-korean-illustration-vector_490632-422.jpg" 
                                    alt="Korean learning" 
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

 

            {/* CTA Section */}
            <section className="py-20 bg-red-600 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Ready to Start Your Korean Journey?
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto mb-8">
                        Join now and get your first week free with full access to all features.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            to="/signup" 
                            className="px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
                        >
                            Sign Up Free
                        </Link>
                        <Link 
                            to="/pricing" 
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition"
                        >
                            See Pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
        </div>
    );
};

export default Home;