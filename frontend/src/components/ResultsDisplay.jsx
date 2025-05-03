import React, { useState } from 'react';

const ResultsDisplay = ({ results }) => {
  const [activeTab, setActiveTab] = useState('full');
  
  if (!results) return null;
  
  // Get the top performer for a section
  const getTopPerformer = (sectionData) => {
    if (!sectionData || sectionData.length === 0) return null;
    return sectionData.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );
  };
  
  // Calculate average score for criteria
  const calculateAverageScore = (criteriaScores) => {
    if (!criteriaScores) return 0;
    const values = Object.values(criteriaScores);
    return values.reduce((sum, score) => sum + score, 0) / values.length;
  };

  // Format score as percentage
  const formatScore = (score) => `${Math.round(score * 100)}`;

  return (
    <div className="relative backdrop-blur-sm bg-black/30 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-black/50 p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
            Analysis Results
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            AI-powered comparison of website design quality
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-800">
          {['full', 'header', 'main', 'footer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-6 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab 
                  ? 'text-cyan-400 border-b-2 border-cyan-500' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Page
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-6">
          {results[activeTab] && results[activeTab].length > 0 ? (
            <>
              {/* Top Performer Card */}
              {getTopPerformer(results[activeTab]) && (
                <div className="mb-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-fuchsia-900/20 rounded-xl"></div>
                  <div className="absolute inset-0 border border-indigo-800/50 rounded-xl"></div>
                  
                  <div className="relative p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                      {/* Left side - Website info */}
                      <div>
                        <div className="inline-block px-2.5 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                          Top Performer
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {getTopPerformer(results[activeTab]).name}
                        </h3>
                        
                        <div className="flex items-baseline">
                          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                            {formatScore(getTopPerformer(results[activeTab]).score)}
                          </div>
                          <div className="text-lg text-gray-400 ml-1">/100</div>
                        </div>
                      </div>
                      
                      {/* Right side - Score breakdown */}
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
                        <div className="text-xs text-cyan-400 mb-2 font-medium">CRITERIA BREAKDOWN</div>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(getTopPerformer(results[activeTab]).criteria).map(([criterion, score]) => (
                            <div key={criterion} className="flex flex-col">
                              <div className="text-xs text-gray-400 mb-1">{criterion}</div>
                              <div className="flex items-center">
                                <div className="h-1.5 w-24 bg-gray-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      score >= 0.7 
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                                        : score >= 0.5 
                                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                                    }`}
                                    style={{ width: `${score * 100}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm font-medium">{formatScore(score)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* All Websites Comparison Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-900/50 text-left">
                      <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">Website</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">Score</th>
                      {Object.keys(results[activeTab][0].criteria).map(criterion => (
                        <th key={criterion} className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">
                          {criterion}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {results[activeTab].sort((a, b) => b.score - a.score).map((result, index) => (
                      <tr 
                        key={index} 
                        className={`${
                          index === 0 ? 'bg-indigo-900/10' : index % 2 === 0 ? 'bg-gray-900/30' : 'bg-black/30'
                        } hover:bg-gray-800/30 transition-colors duration-150`}
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-medium text-white">{result.name}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-2 w-16 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" 
                                style={{ width: `${result.score * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-3 font-medium text-white">{formatScore(result.score)}</span>
                          </div>
                        </td>
                        {Object.entries(result.criteria).map(([criterion, score]) => (
                          <td key={criterion} className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-2 w-12 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    score >= 0.7 ? 'bg-cyan-500' : score >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${score * 100}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm">{formatScore(score)}</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Analysis Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/text-analysis"
                  className="relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    TEXT ANALYSIS
                  </span>
                  <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                </a>
                
                <a
                  href="/vision-improvements"
                  className="relative overflow-hidden group bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(192,38,211,0.5)]"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    GET VISION IMPROVEMENTS
                  </span>
                  <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-purple-600 to-fuchsia-600"></div>
                </a>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-block p-3 rounded-full bg-gray-800/50 mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-gray-400">
                No data available for {activeTab} section
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
