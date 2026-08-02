import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full backdrop-blur-xl bg-gray-900/50 border-t border-white/20 mt-16">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
                    
                    <div className="text-center md:text-left">
                        <div className="text-2xl font-extrabold text-white tracking-wider">
                            Interview<span className="text-indigo-400">Hub</span>
                        </div>
                        <p className="mt-2 text-gray-400 text-sm">Your community for interview success.</p>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-300">
                        <Link to="/explore" className="hover:text-indigo-400 transition-colors">Explore</Link>
                        <Link to="/submitexperience" className="hover:text-indigo-400 transition-colors">Share</Link>
                        <Link to="/resume-analyzer" className="hover:text-indigo-400 transition-colors">Resume Tool</Link>
                    </nav>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm text-center sm:text-left">
                        &copy; {currentYear} InterviewHub. All Rights Reserved.
                    </p>
                   
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, label, children }) => (
    <a 
        href={href}
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-indigo-400 transition-colors"
    >
        {children}
    </a>
);

export default Footer;
