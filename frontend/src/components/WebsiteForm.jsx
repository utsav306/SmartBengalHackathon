import React, { useState, useEffect } from 'react';

const WebsiteForm = ({ onSubmit, loading }) => {
  const [websites, setWebsites] = useState([
    { name: '', url: '' },
    { name: '', url: '' },
    { name: '', url: '' }
  ]);
  const [category, setCategory] = useState('ecommerce');
  const [error, setError] = useState('');

  // Load saved form data on component mount
  useEffect(() => {
    const savedWebsites = sessionStorage.getItem('websiteFormData');
    const savedCategory = sessionStorage.getItem('websiteFormCategory');
    
    if (savedWebsites) {
      try {
        const parsedWebsites = JSON.parse(savedWebsites);
        setWebsites(parsedWebsites);
      } catch (err) {
        console.error('Error parsing saved website form data:', err);
      }
    }
    
    if (savedCategory) {
      setCategory(savedCategory);
    }
  }, []);

  const handleWebsiteChange = (index, field, value) => {
    const updatedWebsites = [...websites];
    updatedWebsites[index][field] = value;
    setWebsites(updatedWebsites);
    
    // Save to sessionStorage to persist between page navigations
    sessionStorage.setItem('websiteFormData', JSON.stringify(updatedWebsites));
  };
  
  const handleCategoryChange = (value) => {
    setCategory(value);
    
    // Save to sessionStorage to persist between page navigations
    sessionStorage.setItem('websiteFormCategory', value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const filledWebsites = websites.filter(site => site.name && site.url);
    if (filledWebsites.length < 2) {
      setError('Please provide at least 2 websites to compare');
      return;
    }
    
    // Reset error
    setError('');
    
    // Submit only the filled website entries
    onSubmit(filledWebsites, category);
  };

  const categories = [
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'blog', label: 'Blog' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'saas', label: 'SaaS' }
  ];

  return (
    <div className="relative backdrop-blur-sm bg-black/30 rounded-xl p-6 border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
      {/* Decorative elements */}
      <div className="absolute -top-3 -right-3 w-20 h-20 bg-fuchsia-500/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-6">
          Configure Analysis
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Website Category
            </label>
            <div className="relative">
              <select 
                className="w-full bg-gray-900/70 border border-gray-700 text-gray-300 rounded-lg py-2.5 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Website Inputs */}
          <div className="space-y-6 mb-6">
            {websites.map((website, index) => (
              <div key={index} className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white mr-2">
                    {index + 1}
                  </div>
                  <h3 className="text-gray-300 font-medium">Website {index + 1}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">
                      Website Name
                    </label>
                    <input
                      type="text"
                      value={website.name}
                      onChange={(e) => handleWebsiteChange(index, 'name', e.target.value)}
                      className="w-full bg-black/30 border border-gray-700 text-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                      placeholder="e.g. Amazon"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={website.url}
                      onChange={(e) => handleWebsiteChange(index, 'url', e.target.value)}
                      className="w-full bg-black/30 border border-gray-700 text-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                      placeholder="e.g. https://www.amazon.com"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="relative z-10">
              {loading ? 'Processing...' : 'Analyze Websites'}
            </span>
            <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-blue-600 to-purple-600"></div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default WebsiteForm;
