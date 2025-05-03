import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const VisionImprovementsPage = () => {
  const [activeWebsite, setActiveWebsite] = useState(0);
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to map Gemini vision improvements to the format needed for display
  const mapVisionImprovementsToDisplay = (geminiData) => {
    if (!geminiData || !geminiData.websites) {
      return [];
    }
    
    return geminiData.websites.map(website => {
      // Extract vision improvements from the Gemini API data
      const visionImprovements = website.vision_improvements || {};
      const improvementCategories = Object.keys(visionImprovements);
      
      // Create an array of improvement objects
      const improvements = improvementCategories.map(category => {
        const categoryData = visionImprovements[category] || {};
        const analysis = categoryData.current_analysis || "No analysis available";
        const recommendations = categoryData.recommendations || [];

        // Determine severity based on recommendations or use a default
        let severity = "medium";
        if (recommendations.length > 3) {
          severity = "high";
        } else if (recommendations.length <= 1) {
          severity = "low";
        }
        
        return {
          category: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: recommendations.length > 0 ? recommendations[0] : analysis,
          severity: severity,
          allRecommendations: recommendations
        };
      });
      
      // Format the website data
      return {
        name: website.name,
        url: website.url || "https://example.com",
        screenshot: website.screenshot || `https://placehold.co/800x600/333/white?text=${website.name}+Screenshot`,
        score: website.overall_score || Math.round((Math.random() * 30) + 60), // Random score between 60-90 if not provided
        improvements: improvements
      };
    });
  };
  
  // Fetch data from backend or use cached data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Store a session key in sessionStorage to track the current browsing session
        if (!sessionStorage.getItem('sessionId')) {
          sessionStorage.setItem('sessionId', Date.now().toString());
        }
        
        // Check if we have cached data in localStorage for the current session
        const cachedData = localStorage.getItem('websiteComparisonData');
        const cachedTimestamp = localStorage.getItem('websiteComparisonTimestamp');
        const sessionId = sessionStorage.getItem('sessionId');
        const cachedSessionId = localStorage.getItem('websiteComparisonSessionId');
        
        // Only use cached data if it's from the current session
        if (cachedData && cachedSessionId === sessionId) {
          console.log('Using cached website comparison data from current session');
          const parsedData = JSON.parse(cachedData);
          
          // Map the data to the format needed for display
          const formattedData = {
            websites: mapVisionImprovementsToDisplay(parsedData)
          };
          
          setWebsiteData(formattedData);
          setLoading(false);
          return;
        }
        
        // No cached data for current session, make the API request
        console.log('No cached data for current session, fetching from API');
        
        // Example websites to analyze - you would get this from user input or previous step
        const websites = [
          { name: 'Amazon', url: 'https://www.amazon.com' },
          { name: 'Flipkart', url: 'https://www.flipkart.com' },
          { name: 'Blinkit', url: 'https://blinkit.com' }
        ];
        
        // Make API request to your backend
        const response = await axios.post('http://localhost:5000/compare_websites', {
          websites: websites,
          category: 'e-commerce'
        });
        
        console.log('API Response:', response.data);
        
        // Cache the response in localStorage for future use with the current session ID
        localStorage.setItem('websiteComparisonData', JSON.stringify(response.data));
        localStorage.setItem('websiteComparisonTimestamp', Date.now().toString());
        localStorage.setItem('websiteComparisonSessionId', sessionId);
        
        // Map the data to the format needed for display
        const formattedData = {
          websites: mapVisionImprovementsToDisplay(response.data)
        };
        
        setWebsiteData(formattedData);
      } catch (err) {
        console.error('Error fetching website data:', err);
        setError('Failed to fetch website data. Please try again later.');
        
        // Fall back to mock data in case of error
        setWebsiteData(mockData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Add cleanup function to remove event listener
    return () => {
      // This will run when the component unmounts
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Handle storage change event (if data is updated in another tab/component)
  const handleStorageChange = (e) => {
    if (e.key === 'websiteComparisonData' && e.newValue) {
      try {
        const newData = JSON.parse(e.newValue);
        const formattedData = {
          websites: mapVisionImprovementsToDisplay(newData)
        };
        setWebsiteData(formattedData);
      } catch (err) {
        console.error('Error parsing stored data:', err);
      }
    }
  };
  
  // Add storage event listener when component mounts
  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Function to clear cached data (for testing)
  const clearCache = () => {
    localStorage.removeItem('websiteComparisonData');
    localStorage.removeItem('websiteComparisonTimestamp');
    localStorage.removeItem('websiteComparisonSessionId');
    sessionStorage.removeItem('sessionId');
    window.location.reload();
  };
  
  // Mock data as fallback
  const mockData = {
    websites: [
      { 
        name: 'Website 1', 
        url: 'https://example1.com',
        screenshot: 'https://placehold.co/800x600/333/white?text=Website+1+Screenshot',
        score: 72,
        improvements: [
          { 
            category: 'Color Contrast', 
            description: 'Increase contrast between text and background colors for better readability',
            severity: 'high'
          },
          { 
            category: 'Visual Hierarchy', 
            description: 'Improve the visual hierarchy to guide users through content more effectively',
            severity: 'medium'
          },
          { 
            category: 'Spacing', 
            description: 'Add more whitespace between elements to reduce visual clutter',
            severity: 'medium'
          },
          { 
            category: 'Mobile Responsiveness', 
            description: 'Optimize layout for mobile devices to prevent overflow issues',
            severity: 'high'
          }
        ]
      },
      { 
        name: 'Website 2', 
        url: 'https://example2.com',
        screenshot: 'https://placehold.co/800x600/222/white?text=Website+2+Screenshot',
        score: 85,
        improvements: [
          { 
            category: 'Image Optimization', 
            description: 'Compress images to improve page load times',
            severity: 'medium'
          },
          { 
            category: 'Button Design', 
            description: 'Make call-to-action buttons more prominent with better contrast',
            severity: 'low'
          },
          { 
            category: 'Font Consistency', 
            description: 'Use a more consistent font hierarchy throughout the site',
            severity: 'low'
          }
        ]
      },
      { 
        name: 'Website 3', 
        url: 'https://example3.com',
        screenshot: 'https://placehold.co/800x600/111/white?text=Website+3+Screenshot',
        score: 64,
        improvements: [
          { 
            category: 'Navigation', 
            description: 'Simplify navigation menu structure for easier user orientation',
            severity: 'high'
          },
          { 
            category: 'Color Palette', 
            description: 'Use a more harmonious color palette that aligns with brand identity',
            severity: 'medium'
          },
          { 
            category: 'Content Layout', 
            description: 'Restructure content layout to improve information hierarchy',
            severity: 'high'
          },
          { 
            category: 'Visual Clutter', 
            description: 'Reduce visual clutter by removing unnecessary decorative elements',
            severity: 'medium'
          },
          { 
            category: 'Footer Design', 
            description: 'Redesign footer to be more organized and user-friendly',
            severity: 'low'
          }
        ]
      }
    ]
  };

  // Get severity badge styling
  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'high':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'medium':
        return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      case 'low':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      default:
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    }
  };

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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                Vision Improvements
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              AI-powered visual analysis and recommendations to enhance your website design
            </p>
            
            {/* Admin controls (shown only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2">
                <button 
                  onClick={clearCache} 
                  className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded"
                >
                  Clear Cached Data (Dev Only)
                </button>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              <p className="ml-3 text-cyan-400">Analyzing websites...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-4 text-center">
              <p className="text-red-400">{error}</p>
              <p className="mt-2 text-gray-400">Using mock data instead.</p>
            </div>
          ) : (
            <>
              {/* Website Selector Tabs */}
              <div className="flex overflow-x-auto scrollbar-hide mb-8 border-b border-gray-800">
                {websiteData?.websites.map((website, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveWebsite(index)}
                    className={`py-3 px-6 text-sm font-medium transition-colors duration-200 ${
                      activeWebsite === index 
                        ? 'text-cyan-400 border-b-2 border-cyan-500' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {website.name}
                  </button>
                ))}
              </div>
              
              {/* Main Content */}
              {websiteData?.websites[activeWebsite] && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Screenshot */}
                  <div className="lg:col-span-2">
                    <div className="backdrop-blur-sm bg-black/30 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-900/50 to-black/50 p-4 border-b border-gray-800">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                            Website Screenshot
                          </h2>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-400 mr-2">Visual Score:</span>
                            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                              {websiteData.websites[activeWebsite].score}/100
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="relative rounded-lg overflow-hidden border border-gray-700">
                          <img 
                            src={`http://localhost:5000/screenshots/${websiteData.websites[activeWebsite].name.toLowerCase().replace(/\s+/g, '_')}/${websiteData.websites[activeWebsite].name.toLowerCase().replace(/\s+/g, '_')}_full.png`} 
                            alt={`${websiteData.websites[activeWebsite].name} screenshot`}
                            className="w-full h-auto"
                          />
                          
                          {/* Annotation overlay - in a real app, these would be positioned based on actual issues */}
                          <div className="absolute inset-0">
                            {websiteData.websites[activeWebsite].improvements.map((improvement, i) => {
                              // Generate random positions for demo purposes
                              // In a real app, these would be specific coordinates from the analysis
                              const top = 20 + (i * 15) % 70;
                              const left = 10 + (i * 20) % 80;
                              
                              return (
                                <div 
                                  key={i}
                                  className="absolute w-8 h-8 rounded-full bg-black/70 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 font-bold cursor-pointer hover:bg-black transition-colors duration-200"
                                  style={{ top: `${top}%`, left: `${left}%` }}
                                  title={improvement.description}
                                >
                                  {i + 1}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-400">
                          <p>
                            <span className="font-medium text-white">URL:</span> {websiteData.websites[activeWebsite].url}
                          </p>
                          <p className="mt-2">
                            The screenshot above shows the full page capture of the website with annotations highlighting areas for improvement.
                            Click on the numbered markers to see specific recommendations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Improvements */}
                  <div>
                    <div className="backdrop-blur-sm bg-black/30 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-900/50 to-black/50 p-4 border-b border-gray-800">
                        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                          Recommended Improvements
                        </h2>
                      </div>
                      
                      <div className="p-4">
                        <div className="space-y-4">
                          {websiteData.websites[activeWebsite].improvements.map((improvement, index) => (
                            <div key={index} className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black/70 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 font-bold mr-3">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="flex items-center mb-2">
                                    <h3 className="text-md font-medium text-white mr-2">{improvement.category}</h3>
                                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getSeverityBadge(improvement.severity)}`}>
                                      {improvement.severity.charAt(0).toUpperCase() + improvement.severity.slice(1)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300">{improvement.description}</p>
                                  
                                  {/* Additional recommendations if available */}
                                  {improvement.allRecommendations && improvement.allRecommendations.length > 1 && (
                                    <div className="mt-2 pt-2 border-t border-gray-700">
                                      <h4 className="text-xs font-medium text-gray-400 mb-1">Additional recommendations:</h4>
                                      <ul className="text-xs text-gray-400 list-disc list-inside">
                                        {improvement.allRecommendations.slice(1, 3).map((rec, i) => (
                                          <li key={i} className="my-1">{rec}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Summary Card */}
                        <div className="mt-6 bg-gradient-to-br from-indigo-900/30 to-fuchsia-900/30 rounded-lg border border-indigo-800/50 p-4">
                          <h3 className="text-md font-medium text-white mb-2">Summary</h3>
                          <p className="text-sm text-gray-300 mb-3">
                            We've identified {websiteData.websites[activeWebsite].improvements.length} areas for improvement on {websiteData.websites[activeWebsite].name}. 
                            Focus on addressing the high-priority items first for maximum impact.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {["high", "medium", "low"].map(severity => {
                              const count = websiteData.websites[activeWebsite].improvements.filter(i => i.severity === severity).length;
                              if (count > 0) {
                                return (
                                  <span key={severity} className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getSeverityBadge(severity)}`}>
                                    {count} {severity} priority
                                  </span>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VisionImprovementsPage;
