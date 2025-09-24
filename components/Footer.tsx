import React from 'react';

const Footer: React.FC<{ onNavigate: (page: 'about' | 'contact') => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900/50 text-gray-300 py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">AI Image Expander</h3>
          <p className="text-sm">Expand your images seamlessly with the power of generative AI. Free, fast, and easy to use.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => onNavigate('about')} className="hover:text-primary-400 transition-colors">About Us</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-primary-400 transition-colors">Contact Us</button></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Connect</h3>
           <div className="flex justify-center md:justify-start gap-4">
             <a href="https://www.youtube.com/@codebyrushi" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">YouTube</a>
             <a href="https://www.instagram.com/codebyrushi/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">Instagram</a>
             <a href="https://x.com/CodeByRushi" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">X (Twitter)</a>
           </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} AI Image Expander. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
