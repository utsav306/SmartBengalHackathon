import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FeaturesPage = () => {
  const features = [
    {
      id: 1,
      title: "Comparative Analysis",
      description: "Compare up to 3 websites simultaneously to identify strengths and weaknesses in design, usability, and visual appeal.",
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
      color: "from-cyan-500/20 to-blue-500/20",
      textColor: "text-cyan-400",
      link: "/analyze"
    },
    {
      id: 2,
      title: "Visual AI Analysis",
      description: "Our AI analyzes visual elements including color harmony, layout structure, spacing, contrast, and overall aesthetic appeal.",
      icon: (
        <svg className="w-8 h-8 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      ),
      color: "from-fuchsia-500/20 to-purple-500/20",
      textColor: "text-fuchsia-400",
      link: "/vision-improvements"
    },
    {
      id: 3,
      title: "Text Content Analysis",
      description: "Evaluate content relevancy, readability, and alignment with your industry category to improve messaging effectiveness.",
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      color: "from-blue-500/20 to-indigo-500/20",
      textColor: "text-blue-400",
      link: "/text-analysis"
    },
    {
      id: 4,
      title: "Actionable Recommendations",
      description: "Get specific, actionable recommendations to improve your website's design, usability, and overall user experience.",
      icon: (
        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
      ),
      color: "from-green-500/20 to-emerald-500/20",
      textColor: "text-green-400",
      link: "/analyze"
    },
    {
      id: 5,
      title: "Competitive Benchmarking",
      description: "See how your website compares to competitors and industry standards with detailed scoring metrics.",
      icon: (
        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        </svg>
      ),
      color: "from-amber-500/20 to-orange-500/20",
      textColor: "text-amber-400",
      link: "/analyze"
    },
    {
      id: 6,
      title: "Detailed Reports",
      description: "Access comprehensive reports with visual annotations, metrics, and improvement suggestions you can implement immediately.",
      icon: (
        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      color: "from-indigo-500/20 to-violet-500/20",
      textColor: "text-indigo-400",
      link: "/analyze"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      
      <main className="flex-grow relative z-10 py-16">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1),transparent_70%)]"></div>
          <div className="absolute top-20 right-[10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-10 left-[5%] w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite] animation-delay-[2000ms]"></div>
        </div>
        
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                Powerful Features
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover how our AI-powered platform can transform your website design and user experience
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map(feature => (
              <div 
                key={feature.id} 
                className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <Link to={feature.link} className={`${feature.textColor} flex items-center text-sm font-medium hover:opacity-80 transition-opacity`}>
                  Try it now
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
          
          {/* How It Works Section */}
          <section className="mb-20">
            <div className="backdrop-blur-sm bg-black/30 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-900/50 to-black/50 p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                  How It Works
                </h2>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 text-xl font-bold mb-4">1</div>
                    <h3 className="text-lg font-medium text-white mb-2">Input Website URLs</h3>
                    <p className="text-gray-400 text-sm">Enter up to 3 website URLs you want to analyze and compare</p>
                    
                    {/* Connector line (hidden on mobile) */}
                    <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 text-xl font-bold mb-4">2</div>
                    <h3 className="text-lg font-medium text-white mb-2">AI Analysis</h3>
                    <p className="text-gray-400 text-sm">Our AI analyzes design, content, and user experience factors</p>
                    
                    {/* Connector line (hidden on mobile) */}
                    <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-fuchsia-900/50 flex items-center justify-center text-fuchsia-400 text-xl font-bold mb-4">3</div>
                    <h3 className="text-lg font-medium text-white mb-2">Get Results</h3>
                    <p className="text-gray-400 text-sm">Review detailed comparison results with scores and metrics</p>
                    
                    {/* Connector line (hidden on mobile) */}
                    <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gradient-to-r from-fuchsia-500/50 to-transparent"></div>
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 text-xl font-bold mb-4">4</div>
                    <h3 className="text-lg font-medium text-white mb-2">Implement Changes</h3>
                    <p className="text-gray-400 text-sm">Apply the recommended improvements to enhance your website</p>
                  </div>
                </div>
                
                <div className="mt-10 text-center">
                  <Link 
                    to="/analyze" 
                    className="inline-block bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  >
                    Try It Now
                  </Link>
                </div>
              </div>
            </div>
          </section>
          
          {/* Testimonials Section */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                  What Our Users Say
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">JD</div>
                  <div className="ml-3">
                    <div className="font-medium text-white">John Doe</div>
                    <div className="text-xs text-gray-400">UX Designer</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"This tool helped me identify design inconsistencies I had overlooked. The visual improvement suggestions were spot-on and easy to implement."</p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center text-white font-bold">JS</div>
                  <div className="ml-3">
                    <div className="font-medium text-white">Jane Smith</div>
                    <div className="text-xs text-gray-400">Marketing Director</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"The text analysis feature gave us valuable insights into our content's effectiveness. We've seen a 25% increase in engagement since implementing the suggestions."</p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">RJ</div>
                  <div className="ml-3">
                    <div className="font-medium text-white">Robert Johnson</div>
                    <div className="text-xs text-gray-400">Web Developer</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"Being able to compare our site with competitors gave us the edge we needed. The AI analysis is incredibly thorough and the recommendations are practical."</p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FeaturesPage;
