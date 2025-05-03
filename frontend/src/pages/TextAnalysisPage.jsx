import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TextAnalysisPage = () => {
  // This would typically come from API or state management
  const mockAnalysisData = {
    websites: [
      { name: 'Website 1', url: 'https://example1.com' },
      { name: 'Website 2', url: 'https://example2.com' },
      { name: 'Website 3', url: 'https://example3.com' }
    ],
    textAnalysis: {
      contentRelevancy: {
        website1: {
          score: 85,
          strengths: ['Clear messaging', 'Relevant keywords', 'Consistent tone'],
          improvements: ['Add more specific industry terms', 'Improve call-to-actions']
        },
        website2: {
          score: 72,
          strengths: ['Good product descriptions', 'Clear headlines'],
          improvements: ['Improve content hierarchy', 'Add more detailed information']
        },
        website3: {
          score: 91,
          strengths: ['Excellent keyword usage', 'Engaging copy', 'Clear value proposition'],
          improvements: ['Minor grammar improvements']
        }
      },
      categoryAlignment: {
        website1: {
          category: 'E-commerce',
          alignment: 78,
          suggestions: ['Add more product-focused content', 'Improve checkout descriptions']
        },
        website2: {
          category: 'E-commerce',
          alignment: 65,
          suggestions: ['Clarify product categories', 'Add more industry-specific terminology']
        },
        website3: {
          category: 'E-commerce',
          alignment: 88,
          suggestions: ['Enhance product comparison language']
        }
      },
      readability: {
        website1: { score: 82, level: 'Good' },
        website2: { score: 70, level: 'Average' },
        website3: { score: 90, level: 'Excellent' }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      
      <main className="flex-grow relative z-10 py-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                Text Analysis Results
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Detailed insights and recommendations based on content relevancy and category alignment
            </p>
          </div>
          
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1),transparent_70%)]"></div>
            <div className="absolute top-20 right-[10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-10 left-[5%] w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite] animation-delay-[2000ms]"></div>
          </div>
          
          {/* Content Relevancy Section */}
          <section className="mb-16">
            <div className="backdrop-blur-sm bg-black/30 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-900/50 to-black/50 p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                  Content Relevancy Analysis
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  How well your website content aligns with your target audience and purpose
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockAnalysisData.websites.map((website, index) => {
                    const websiteKey = `website${index + 1}`;
                    const data = mockAnalysisData.textAnalysis.contentRelevancy[websiteKey];
                    
                    return (
                      <div key={index} className="bg-gray-900/30 border border-gray-800 rounded-lg overflow-hidden">
                        <div className="p-5 border-b border-gray-800">
                          <h3 className="text-lg font-medium text-white mb-1">{website.name}</h3>
                          <div className="text-sm text-gray-400">{website.url}</div>
                        </div>
                        
                        <div className="p-5">
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">Relevancy Score</span>
                              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                                {data.score}/100
                              </span>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" 
                                style={{ width: `${data.score}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-cyan-400 mb-2">Strengths</h4>
                            <ul className="space-y-1">
                              {data.strengths.map((strength, i) => (
                                <li key={i} className="text-sm text-gray-300 flex items-start">
                                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-fuchsia-400 mb-2">Improvement Areas</h4>
                            <ul className="space-y-1">
                              {data.improvements.map((improvement, i) => (
                                <li key={i} className="text-sm text-gray-300 flex items-start">
                                  <svg className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                  </svg>
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
          
          {/* Category Alignment Section */}
          <section className="mb-16">
            <div className="backdrop-blur-sm bg-black/30 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-900/50 to-black/50 p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                  Category Alignment
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  How well your website content aligns with your industry category
                </p>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-900/50 text-left">
                        <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">Website</th>
                        <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">Category</th>
                        <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">Alignment Score</th>
                        <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">Suggestions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {mockAnalysisData.websites.map((website, index) => {
                        const websiteKey = `website${index + 1}`;
                        const data = mockAnalysisData.textAnalysis.categoryAlignment[websiteKey];
                        
                        return (
                          <tr 
                            key={index} 
                            className={`${
                              index % 2 === 0 ? 'bg-gray-900/30' : 'bg-black/30'
                            } hover:bg-gray-800/30 transition-colors duration-150`}
                          >
                            <td className="py-4 px-4">
                              <div className="font-medium text-white">{website.name}</div>
                              <div className="text-sm text-gray-400">{website.url}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-semibold text-cyan-400">
                                {data.category}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="h-2 w-16 bg-gray-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" 
                                    style={{ width: `${data.alignment}%` }}
                                  ></div>
                                </div>
                                <span className="ml-3 font-medium text-white">{data.alignment}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <ul className="space-y-1">
                                {data.suggestions.map((suggestion, i) => (
                                  <li key={i} className="text-sm text-gray-300 flex items-start">
                                    <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
          
          {/* Readability Section */}
          <section>
            <div className="backdrop-blur-sm bg-black/30 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-900/50 to-black/50 p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                  Readability Analysis
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  How easy it is for visitors to read and understand your content
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockAnalysisData.websites.map((website, index) => {
                    const websiteKey = `website${index + 1}`;
                    const data = mockAnalysisData.textAnalysis.readability[websiteKey];
                    
                    return (
                      <div key={index} className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium text-white mb-3">{website.name}</h3>
                        
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-900 border-4 border-gray-800 mb-4">
                          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                            {data.score}
                          </div>
                        </div>
                        
                        <div className="text-sm font-medium">
                          Readability Level:
                          <span className={`ml-2 ${
                            data.level === 'Excellent' ? 'text-green-400' : 
                            data.level === 'Good' ? 'text-blue-400' : 
                            'text-amber-400'
                          }`}>
                            {data.level}
                          </span>
                        </div>
                      </div>
                    );
                  })}
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

export default TextAnalysisPage;
