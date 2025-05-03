import React from 'react';

const Footer = () => {
  // Current year
  const currentYear = new Date().getFullYear();
  
  // Footer links
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#' },
        { name: 'Pricing', href: '#' },
        { name: 'API', href: '#' },
        { name: 'Documentation', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '#' },
        { name: 'Case Studies', href: '#' },
        { name: 'Guides', href: '#' },
        { name: 'Webinars', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'Partners', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '#' },
        { name: 'Terms', href: '#' },
        { name: 'Security', href: '#' },
        { name: 'Compliance', href: '#' },
      ],
    },
  ];
  
  return (
    <footer className="relative bg-gradient-to-b from-black via-indigo-950/50 to-black text-gray-300 pt-20 pb-10 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0zNiAxOGgtOHYtOGg4djh6bTIwIDIwaC04di04aDh2OHptLTEyLTEyaC04di04aDh2OHptLTIwIDBoLTh2LThoOHY4em0tMTIgMTJoLTh2LThoOHY4eiIvPjwvZz48L2c+PC9zdmc+')]">
          </div>
        </div>
        
        {/* Animated glowing elements */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-[5%] w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        
        {/* Horizontal light beam */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Footer top section with logo and newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 pb-16 border-b border-gray-800">
          {/* Logo and description */}
          <div className="mb-10 lg:mb-0 lg:max-w-xs">
            <div className="flex items-center mb-4">
              {/* Logo icon */}
              <div className="relative mr-3 w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-fuchsia-600 rounded-lg rotate-45"></div>
                <div className="absolute inset-[2px] bg-black rounded-lg rotate-45"></div>
                <div className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 font-bold text-xl">W</div>
              </div>
              
              {/* Logo text */}
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">WEB</span>
                  <span className="text-white">ANALYZER</span>
                </h1>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6">
              Revolutionizing website design analysis with cutting-edge AI technology and computer vision algorithms.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'github', 'linkedin'].map((social) => (
                <a 
                  key={social} 
                  href={`#${social}`} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                  aria-label={social}
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                    {social === 'facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />}
                    {social === 'instagram' && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />}
                    {social === 'github' && <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />}
                    {social === 'linkedin' && <path fillRule="evenodd" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" clipRule="evenodd" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="lg:max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
              Subscribe to our newsletter
            </h3>
            <p className="text-gray-400 mb-4">
              Get the latest updates, news and product developments from our team.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow bg-gray-900 border border-gray-700 text-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
              />
              <button 
                type="submit" 
                className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-medium py-2 px-4 rounded-r-lg hover:from-cyan-600 hover:to-fuchsia-600 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
        
        {/* Footer links section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Footer bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="text-xs text-gray-400">
              &copy; {currentYear} WebAnalyzer. All rights reserved.
            </div>
            <div className="ml-4 text-xs text-gray-400 border border-gray-800 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
              AI Engine v3.0
            </div>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      <div className="absolute -bottom-8 right-10 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl"></div>
    </footer>
  );
};

export default Footer;
