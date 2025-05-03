import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AnalyzeSection from '../components/AnalyzeSection';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      {/* Background grid pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(67,56,202,0.1),transparent_70%)]"></div>
        <div className="h-full w-full opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMjkgNThsMSAxSDI4ek0yOSAyTDI4IDFoMnpNMSAyOWwxIDFWMjh6TTU4IDI5bDEtMXYyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>
      
      {/* Header with Hero Section */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {/* Analyze Section */}
        <AnalyzeSection />
        
        {/* Features Section */}
        <Features />
        
        {/* How It Works Section */}
        <HowItWorks />
        
        {/* Add Testimonials and CTA sections here */}
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;