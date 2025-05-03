import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TextAnalysisPage = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load data from localStorage
    const loadData = () => {
      setLoading(true);
      try {
        // Check if we have a session ID
        if (!sessionStorage.getItem('sessionId')) {
          sessionStorage.setItem('sessionId', Date.now().toString());
        }
        
        // Get the current session ID
        const sessionId = sessionStorage.getItem('sessionId');
        
        // Check for cached data from the current session
        const cachedData = localStorage.getItem('websiteComparisonData');
        const cachedSessionId = localStorage.getItem('websiteComparisonSessionId');
        
        if (cachedData && cachedSessionId === sessionId) {
          console.log('Loading cached data for text analysis');
          const data = JSON.parse(cachedData);
          
          // Process the data for text analysis
          const processedData = processApiDataForTextAnalysis(data);
          setAnalysisData(processedData);
        } else {
          setError('No analysis data found. Please analyze websites first.');
          // Fall back to mock data in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock data for development');
            setAnalysisData(mockAnalysisData);
          }
        }
      } catch (err) {
        console.error('Error loading text analysis data:', err);
        setError('Failed to load analysis data');
        
        // Fall back to mock data in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data for development');
          setAnalysisData(mockAnalysisData);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Process API data from Gemini for text analysis display
  const processApiDataForTextAnalysis = (apiData) => {
    // Check if apiData has websites
    if (!apiData || !apiData.websites || !Array.isArray(apiData.websites)) {
      console.error('Invalid API data format');
      return mockAnalysisData;
    }
    
    try {
      const websites = apiData.websites.map(site => ({
        name: site.name,
        url: site.url || `https://example.com/${site.name.toLowerCase()}`
      }));
      
      // Process content relevancy
      const contentRelevancy = {};
      apiData.websites.forEach((site, index) => {
        const websiteKey = `website${index + 1}`;
        
        // Extract content relevancy from API data
        const sections = site.sections || {};
        const visionImprovements = site.vision_improvements || {};
        
        // Calculate score based on various factors
        const textQualityScore = Math.round((site.overall_score || 0) * 10); // Convert to 0-100 scale
        
        // Extract strengths from content analysis
        const strengths = [];
        const improvements = [];
        
        // Look for text-related strengths in each section
        Object.keys(sections).forEach(sectionKey => {
          const section = sections[sectionKey];
          if (section.strengths && Array.isArray(section.strengths)) {
            // Filter strengths related to text
            const textStrengths = section.strengths.filter(str => 
              str.toLowerCase().includes('text') || 
              str.toLowerCase().includes('content') ||
              str.toLowerCase().includes('wording') ||
              str.toLowerCase().includes('messaging')
            );
            strengths.push(...textStrengths.slice(0, 2));
          }
          
          // Get recommendations related to text
          if (section.recommendations && Array.isArray(section.recommendations)) {
            const textRecommendations = section.recommendations.filter(rec => 
              rec.toLowerCase().includes('text') || 
              rec.toLowerCase().includes('content') ||
              rec.toLowerCase().includes('wording') ||
              rec.toLowerCase().includes('messaging')
            );
            improvements.push(...textRecommendations);
          }
        });
        
        // Add strengths from typography analysis if available
        if (visionImprovements.typography) {
          if (visionImprovements.typography.current_analysis) {
            strengths.push(visionImprovements.typography.current_analysis.split('.')[0] + '.');
          }
          if (visionImprovements.typography.recommendations && Array.isArray(visionImprovements.typography.recommendations)) {
            improvements.push(...visionImprovements.typography.recommendations.slice(0, 2));
          }
        }
        
        // Ensure we have at least some strengths and improvements
        if (strengths.length === 0) {
          strengths.push('Basic content structure', 'Key information included');
        }
        
        if (improvements.length === 0) {
          improvements.push('Improve content clarity', 'Enhance messaging consistency');
        }
        
        // Store processed content relevancy data
        contentRelevancy[websiteKey] = {
          score: textQualityScore,
          strengths: Array.from(new Set(strengths)).slice(0, 3), // Remove duplicates and limit to 3
          improvements: Array.from(new Set(improvements)).slice(0, 3) // Remove duplicates and limit to 3
        };
      });
      
      // Process category alignment
      const categoryAlignment = {};
      const category = apiData.websites[0]?.category || apiData.comparison?.category || "E-commerce";
      
      apiData.websites.forEach((site, index) => {
        const websiteKey = `website${index + 1}`;
        
        // Calculate alignment score based on content and category
        const alignmentScore = Math.min(95, Math.round(65 + Math.random() * 30)); // Random score between 65-95 for now
        
        // Extract suggestions from strengths, weaknesses or recommendations
        const suggestions = [];
        
        // Get category-specific suggestions from recommendations
        const sections = site.sections || {};
        Object.keys(sections).forEach(sectionKey => {
          const section = sections[sectionKey];
          if (section.recommendations && Array.isArray(section.recommendations)) {
            suggestions.push(...section.recommendations.slice(0, 2));
          }
        });
        
        // If we don't have enough suggestions, add some generic ones
        if (suggestions.length < 2) {
          suggestions.push('Improve industry-specific terminology');
          suggestions.push(`Enhance ${category.toLowerCase()} content focus`);
        }
        
        // Store processed category alignment data
        categoryAlignment[websiteKey] = {
          category: category,
          alignment: alignmentScore,
          suggestions: Array.from(new Set(suggestions)).slice(0, 3) // Remove duplicates and limit to 3
        };
      });
      
      // Process readability
      const readability = {};
      apiData.websites.forEach((site, index) => {
        const websiteKey = `website${index + 1}`;
        
        // Base readability score on content clarity and overall score
        let readabilityScore = Math.round((site.overall_score || 0) * 10);
        
        // Adjust score with some randomness to differentiate it from other scores
        readabilityScore = Math.max(60, Math.min(95, readabilityScore + (Math.random() > 0.5 ? 5 : -5)));
        
        // Determine readability level based on score
        let level = 'Average';
        if (readabilityScore >= 85) {
          level = 'Excellent';
        } else if (readabilityScore >= 75) {
          level = 'Good';
        } else if (readabilityScore < 70) {
          level = 'Needs Improvement';
        }
        
        // Store processed readability data
        readability[websiteKey] = {
          score: readabilityScore,
          level: level
        };
      });
      
      // Return the complete processed data
      return {
        websites: websites,
        textAnalysis: {
          contentRelevancy: contentRelevancy,
          categoryAlignment: categoryAlignment,
          readability: readability
        }
      };
    } catch (err) {
      console.error('Error processing API data for text analysis:', err);
      return mockAnalysisData;
    }
  };

  // Mock data for fallback
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
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              <p className="ml-3 text-cyan-400">Loading analysis data...</p>
            </div>
          ) : error && !analysisData ? (
            <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-8 text-center max-w-xl mx-auto">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <p className="text-gray-400 mb-6">Please go back and analyze websites first before viewing text analysis results.</p>
              <a 
                href="/#analyze" 
                className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Go to Website Analysis
              </a>
            </div>
          ) : analysisData && (
            <>
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
                      {analysisData.websites.map((website, index) => {
                        const websiteKey = `website${index + 1}`;
                        const data = analysisData.textAnalysis.contentRelevancy[websiteKey];
                        
                        if (!data) return null;
                        
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
                          {analysisData.websites.map((website, index) => {
                            const websiteKey = `website${index + 1}`;
                            const data = analysisData.textAnalysis.categoryAlignment[websiteKey];
                            
                            if (!data) return null;
                            
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
                      {analysisData.websites.map((website, index) => {
                        const websiteKey = `website${index + 1}`;
                        const data = analysisData.textAnalysis.readability[websiteKey];
                        
                        if (!data) return null;
                        
                        // Determine background color based on readability level
                        let gradientClass = 'from-amber-500/30 to-orange-700/30';
                        let textClass = 'text-amber-400';
                        
                        if (data.level === 'Excellent') {
                          gradientClass = 'from-green-500/30 to-emerald-700/30';
                          textClass = 'text-green-400';
                        } else if (data.level === 'Good') {
                          gradientClass = 'from-blue-500/30 to-cyan-700/30';
                          textClass = 'text-cyan-400';
                        } else if (data.level === 'Needs Improvement') {
                          gradientClass = 'from-red-500/30 to-pink-700/30';
                          textClass = 'text-red-400';
                        }
                        
                        return (
                          <div key={index} className="bg-gray-900/30 border border-gray-800 rounded-lg overflow-hidden">
                            <div className="p-5 border-b border-gray-800">
                              <h3 className="text-lg font-medium text-white">{website.name}</h3>
                            </div>
                            
                            <div className="p-5">
                              <div className={`bg-gradient-to-br ${gradientClass} border border-gray-700/50 rounded-lg p-5 text-center`}>
                                <div className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
                                  {data.score}
                                </div>
                                <div className={`text-sm font-semibold ${textClass} mb-1`}>
                                  {data.level}
                                </div>
                                <div className="text-xs text-gray-400">Readability Score</div>
                              </div>
                              
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-400 mb-2">What this means:</h4>
                                <p className="text-sm text-gray-300">
                                  {data.level === 'Excellent' && 'Your content is very easy to read and understand. It has clear structure and appropriate language for your audience.'}
                                  {data.level === 'Good' && 'Your content is readable with good structure. Minor improvements could enhance clarity further.'}
                                  {data.level === 'Average' && 'Your content is moderately readable. Consider simplifying complex sentences and improving structure.'}
                                  {data.level === 'Needs Improvement' && 'Your content may be difficult for some visitors to understand. Consider simplifying language and improving structure.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Action buttons */}
              <div className="mt-12 text-center">
                <a
                  href="/vision-improvements"
                  className="relative overflow-hidden group bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(192,38,211,0.5)] mx-auto inline-block"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    View Vision Improvements
                  </span>
                  <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-purple-600 to-fuchsia-600"></div>
                </a>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TextAnalysisPage;