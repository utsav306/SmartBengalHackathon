import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Input Website URLs',
      description: 'Enter the URLs of the websites you want to analyze. You can compare multiple websites simultaneously.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'AI Captures Screenshots',
      description: 'Our system automatically captures screenshots of different sections of the websites for detailed analysis.',
      icon: (
        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Computer Vision Analysis',
      description: 'Advanced computer vision algorithms analyze design elements, layout, color schemes, and visual hierarchy.',
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Generate Detailed Scores',
      description: 'The system generates comprehensive scores based on multiple design criteria for each website section.',
      icon: (
        <svg className="w-8 h-8 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      number: '05',
      title: 'View Comparison Results',
      description: 'Review detailed comparison results with visual indicators and actionable insights for improvement.',
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1),transparent_70%)]"></div>
        
        {/* Animated glowing elements */}
        <div className="absolute top-20 left-[20%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
              How It Works
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our streamlined process makes website design analysis simple, fast, and insightful.
          </p>
        </div>
        
        {/* Process Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-indigo-500 to-fuchsia-500 hidden md:block"></div>
          
          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
              >
                {/* Step number and icon */}
                <div className="md:w-1/2 flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-800 flex items-center justify-center relative z-10">
                      {step.icon}
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 rounded-2xl blur-sm"></div>
                    <div className="absolute -top-3 -right-3 bg-black/80 backdrop-blur-sm border border-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                      {step.number}
                    </div>
                  </div>
                </div>
                
                {/* Step content */}
                <div className="md:w-1/2 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg blur opacity-75"></div>
            <div className="relative bg-black px-8 py-6 rounded-lg border border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-2">Ready to analyze your website?</h3>
              <p className="text-gray-400 mb-4">Get started with our AI-powered website design analysis tool today.</p>
              <button className="relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10 flex items-center justify-center">
                  Start Analyzing Now
                </span>
                <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-blue-600 to-purple-600"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
