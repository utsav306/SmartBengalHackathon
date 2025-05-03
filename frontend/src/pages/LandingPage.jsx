import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15),transparent_70%)]"></div>
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0zNiAxOGgtOHYtOGg4djh6bTIwIDIwaC04di04aDh2OHptLTEyLTEyaC04di04aDh2OHptLTIwIDBoLTh2LThoOHY4em0tMTIgMTJoLTh2LThoOHY4eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
            </div>
            <div className="absolute top-20 right-[10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-10 left-[5%] w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite] animation-delay-[2000ms]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500">
                  AI-Powered Website Design Analysis
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Compare multiple websites and analyze their design quality using advanced artificial intelligence and computer vision technology.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/analyze" 
                  className="relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                >
                  <span className="relative z-10 flex items-center justify-center text-lg">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    START ANALYZING
                  </span>
                  <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-blue-600 to-purple-600"></div>
                </Link>
                
                <Link 
                  to="/features" 
                  className="relative overflow-hidden group bg-transparent border border-cyan-500/50 text-cyan-400 font-medium py-4 px-8 rounded-lg transition-all duration-300 hover:bg-cyan-950/20"
                >
                  <span className="relative z-10 flex items-center justify-center text-lg">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    LEARN MORE
                  </span>
                </Link>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">99%</div>
                <div className="text-sm text-gray-400 mt-1">Accuracy Rate</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">5K+</div>
                <div className="text-sm text-gray-400 mt-1">Websites Analyzed</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">24/7</div>
                <div className="text-sm text-gray-400 mt-1">AI Availability</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">12+</div>
                <div className="text-sm text-gray-400 mt-1">Design Metrics</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Highlight */}
        <section className="py-20 bg-gradient-to-b from-indigo-950/30 to-black relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                  Revolutionary AI Analysis
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Our platform uses cutting-edge AI to provide comprehensive website design analysis
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Comparative Analysis</h3>
                <p className="text-gray-400 mb-4">Compare up to 3 websites simultaneously and get detailed metrics on their design quality.</p>
                <Link to="/analyze" className="text-cyan-400 flex items-center text-sm font-medium hover:text-cyan-300 transition-colors">
                  Try it now
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-fuchsia-500/50 transition-colors duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Visual Improvements</h3>
                <p className="text-gray-400 mb-4">Get AI-powered visual improvement suggestions with annotated screenshots.</p>
                <Link to="/vision-improvements" className="text-fuchsia-400 flex items-center text-sm font-medium hover:text-fuchsia-300 transition-colors">
                  See examples
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Text Analysis</h3>
                <p className="text-gray-400 mb-4">Analyze content relevancy, readability, and alignment with your industry.</p>
                <Link to="/text-analysis" className="text-blue-400 flex items-center text-sm font-medium hover:text-blue-300 transition-colors">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-fuchsia-900/30"></div>
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0zNiAxOGgtOHYtOGg4djh6bTIwIDIwaC04di04aDh2OHptLTEyLTEyaC04di04aDh2OHptLTIwIDBoLTh2LThoOHY4em0tMTIgMTJoLTh2LThoOHY4eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-md rounded-2xl border border-gray-800 p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to improve your website?</h2>
                <p className="text-xl text-gray-300">Get started with our AI-powered analysis today</p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/analyze" 
                  className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Start Free Analysis
                </Link>
                <Link 
                  to="/features" 
                  className="bg-transparent border border-gray-700 text-gray-300 font-medium py-3 px-8 rounded-lg transition-colors duration-300 hover:bg-gray-800/50 hover:border-gray-600 text-center"
                >
                  View Features
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
